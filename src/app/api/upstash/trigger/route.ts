import { Client } from "@upstash/workflow";
import { NextResponse } from "next/server";

const client = new Client({
  token: process.env.QSTASH_TOKEN,
  baseUrl: process.env.QSTASH_URL,
});

export async function POST(request: Request) {
  const { messages, workflowId } = await request.json();

  try {
    const { workflowRunId } = await client.trigger({
      url: `${process.env.APP_BASE_URL}/api/workflow/chat`,
      retries: 3,
      headers: {
        "x-vercel-protection-bypass":
          process.env.VERCEL_PROTECTION_BYPASS_TOKEN || "",
      },
      body: {
        messages,
        workflowId,
      },
    });

    return NextResponse.json({
      success: true,
      data: workflowRunId,
      message: "Workflow triggered successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to trigger workflow",
      },
      { status: 500 }
    );
  }
}
