/** biome-ignore-all lint/suspicious/noExplicitAny: json schema is dynamic and tools */
"use server";

import { webSearch } from "@exalabs/ai-sdk";
import { openrouter } from "@openrouter/ai-sdk-provider";
import { stepCountIs, streamText, type UIMessage } from "ai";

// biome-ignore lint/suspicious/useAwait: .
export async function streamAgentAction({
  model,
  instructions,
  history,
  jsonOutput,
  selectedTools,
}: {
  model: string;
  instructions: string;
  history: UIMessage[];
  jsonOutput?: any;
  selectedTools: Array<
    | { type: "native"; value: string }
    | { type: "mcp"; value: string; tools: [] }
  >;
}) {
  const modelMessage = history.map((message) => {
    if (message.role === "user") {
      const text =
        message.parts.find((part) => part.type === "text")?.text || "";
      return {
        role: "user",
        content: text,
      };
    }
    if (message.role === "assistant") {
      return extractAssistantContent(message.parts);
    }

    return {
      role: message.role,
      content: "",
    };
  });

  const tools: Record<string, any> = {};

  // Native Tools
  const nativeTools = selectedTools.filter((tool) => tool.type === "native");
  for (const tool of nativeTools) {
    if (tool.value === "webSearch") {
      tools.webSearch = webSearch();
    }
  }

  const toolList = Object.entries(tools)
    .map(([name]) => `- ${name}`)
    .join("\n");

  const systemPrompt = `You are a helpful assistant.

    **Analyze the conversation flow:**
    1. Check YOUR last message - did you ask the user for information?
    2. If YES and the user is providing that information → treat it as a follow-up response
    3. If NO or the user changes the topic → classify the message independently as a new intent

    **System Instructions:**
    ${instructions}

    ${toolList ? `**Available tools:**\n${toolList}` : ""}`.trim();

  const result = streamText({
    model: openrouter.chat(model),
    system: systemPrompt,
    messages: modelMessage,
    tools: Object.keys(tools).length > 0 ? tools : undefined,
    stopWhen: stepCountIs(5),
    ...jsonOutput,
  });

  return result;
}

// function extractAssistantContent(parts: any[]) {
//   const content =
//     parts
//       ?.filter(
//         (p) => p.type === "data-workflow-node" && p.data?.nodeType === "agent"
//       )
//       ?.map((p: any) => {
//         const { output } = p.data;
//         return typeof output === "string" ? output : output?.text || "";
//       })
//       ?.filter(Boolean)
//       ?.join("\n\n") || "";

//   return {
//     role: "assistant",
//     content,
//   };
// }

function extractAssistantContent(parts: any[]) {
  const content: any[] = [];

  parts
    ?.filter(
      (p) => p.type === "data-workflow-node" && p.data?.nodeType === "agent"
    )
    // biome-ignore lint/suspicious/useIterableCallbackReturn: we are pushing to content array, not transforming to a new array
    ?.map((p) => {
      const { type, toolCall, toolResult, output } = p.data;

      if (type === "tool-call" && toolCall) {
        content.push({
          type: "tool-call",
          toolCallId: toolCall.toolCallId,
          toolName: toolCall.name,
        });
      }
      if (type === "tool-result" && toolResult) {
        content.push({
          type: "tool-result",
          toolCallId: toolResult.toolCallId,
          toolName: toolResult.name,
          result: toolResult.result,
        });
      }
      if (typeof output === "string") {
        content.push({
          type: "text",
          text: output,
        });
      } else if (output?.text) {
        content.push({
          type: "text",
          text: output.text,
        });
      }
    });

  return {
    role: "assistant" as const,
    content: content.length > 0 ? content : "",
  };
}
