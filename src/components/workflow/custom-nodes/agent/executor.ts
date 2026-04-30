import type { Node } from "@xyflow/react";
import { Output } from "ai";
import { convertJsonSchemaToZod } from "zod-from-json-schema";
import { streamAgentAction } from "@/app/action/agent-action";
import { replaceVariables } from "@/lib/helper";
import type { ExecutorContextType } from "@/types/workflow";
import { MODELS } from "../../../../lib/workflow/constants";

interface Props {
  context: ExecutorContextType;
  node: Node;
}

export async function agentNodeExecutor({ node, context }: Props) {
  const { history, channel, outputs } = context;

  // Inputs
  const {
    instructions,
    model: selectedModel,
    tools: selectedTools,
    outputFormat = "text",
    responseSchema,
    // biome-ignore lint/suspicious/noExplicitAny: agent node data can have dynamic properties based on the tools and configurations.
  } = node.data as any;

  const model = selectedModel ?? MODELS[0].value;
  const tools = selectedTools || [];

  const replacedInstructions = replaceVariables(instructions, outputs);

  const jsonOutput =
    outputFormat === "json" && responseSchema
      ? {
          output: Output.object({
            schema: convertJsonSchemaToZod(responseSchema), // as ai-sdk expects a Zod schema for structured outputs
          }),
        }
      : null;

  const result = await streamAgentAction({
    model,
    instructions: replacedInstructions,
    history,
    jsonOutput,
    selectedTools: tools,
  });

  if (outputFormat === "json") {
    try {
      const text = await result.text;
      return {
        output: JSON.parse(text),
      };
    } catch (error) {
      console.log("error", error);
      throw new Error(
        "Failed to parse JSON output. Please ensure the agent's response adheres to the specified schema."
      );
    }
  }

  let fullText = "";

  for await (const chunk of result.fullStream) {
    switch (chunk.type) {
      case "text-delta":
        fullText += chunk.text;
        await channel.emit("workflow.chunks", {
          type: "data-workflow-node",
          id: node.id,
          data: {
            id: node.id,
            nodeType: node.type,
            nodeName: node.data.label,
            status: "loading",
            type: "text-delta",
            output: fullText,
          },
        });
        break;

      case "tool-call":
        await channel.emit("workflow.chunks", {
          type: "data-workflow-node",
          id: node.id,
          data: {
            id: node.id,
            nodeType: node.type,
            nodeName: node.data.label,
            status: "loading",
            type: "tool-call",
            toolCall: {
              name: chunk.toolName,
            },
          },
        });
        break;

      case "tool-result":
        await channel.emit("workflow.chunks", {
          type: "data-workflow-node",
          id: node.id,
          data: {
            id: node.id,
            nodeType: node.type,
            nodeName: node.data.label,
            status: "loading",
            type: "tool-result",
            toolResult: {
              name: chunk.toolName,
              result: chunk.output,
            },
          },
        });
        break;

      default:
        break;
    }
  }

  return {
    output: {
      text: fullText,
    },
  };
}
