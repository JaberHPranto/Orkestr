import { Client } from "@upstash/qstash";
import { serve } from "@upstash/workflow/nextjs";
import type { UIMessage } from "ai";
import { parseFlowObject } from "@/lib/helper";
import prisma from "@/lib/prisma";
import { realtime } from "@/lib/realtime";
import { executeWorkflow } from "@/lib/workflow-orchestrator";

export const GET = (req: Request) => {
  const { searchParams } = new URL(req.url);
  const workflowRunId = searchParams.get("id");

  if (!workflowRunId) {
    return new Response("Workflow run ID is required", { status: 400 });
  }

  const channel = realtime.channel(workflowRunId);
  const isReconnect = req.headers.get("x-is-reconnect") === "true";

  const stream = new ReadableStream({
    async start(controller) {
      const encoder = new TextEncoder();
      await channel.subscribe({
        events: ["workflow.chunks"],
        history: isReconnect,
        onData: ({ data }) => {
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
          );

          if (data.type === "finish") {
            controller.close();
          }
        },
      });
      req.signal.addEventListener("abort", () => {
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  });
};

export const { POST } = serve(
  async (ctx) => {
    const { messages, workflowId } = ctx.requestPayload as {
      messages: UIMessage[];
      workflowId: string;
    };

    const workflowRunId = ctx.workflowRunId;
    const channel = realtime.channel(workflowRunId);
    const lastMessage = messages.at(-1);
    const userInput =
      lastMessage?.role === "user" && lastMessage.parts[0].type === "text"
        ? lastMessage.parts[0].text
        : "";

    const { nodes, edges } = await ctx.run("fetch-from-database", async () => {
      const workflow = await prisma.workflow.findUnique({
        where: { id: workflowId },
      });

      if (!workflow) {
        throw new Error("Workflow not found");
      }

      const { nodes, edges } = parseFlowObject(workflow.flowObject);

      return { nodes, edges };
    });

    await ctx.run("workflow-execution", async () => {
      try {
        await executeWorkflow({
          nodes,
          edges,
          userInput,
          workflowRunId,
          channel,
          messages,
        });
      } catch (err) {
        console.error("Error executing workflow: ", err);
        throw err;
      }
    });
  },
  {
    // For deployment on Vercel, we need to use QStash to trigger the workflow due to execution time limits.
    qstashClient: new Client({
      token: process.env.QSTASH_TOKEN,
      headers: {
        "x-vercel-protection-bypass":
          process.env.VERCEL_PROTECTION_BYPASS_TOKEN || "",
      },
    }),
  }
);
