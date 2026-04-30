/** biome-ignore-all lint/suspicious/noExplicitAny: json schema is dynamic and tools */
"use server";

import { openrouter } from "@openrouter/ai-sdk-provider";
import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  type UIMessage,
} from "ai";

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
  const modelMessage = await convertToModelMessages(history);
  const tools: Record<string, any> = {};

  // Native Tools
  const nativeTools = selectedTools.filter((tool) => tool.type === "native");
  for (const tool of nativeTools) {
    if (tool.value === "webSearch") {
      // will implement web search later, for now just return a mock response
    }
  }

  const toolList = Object.entries(tools)
    .map(([name]) => `- ${name}`)
    .join("\n");

  const systemPrompt = `You are a helpful assistant that executes actions. 
    IMPORTANT: Only respond to the user's most recent message.
    *** MUST USE THE FOLLOWING INSTRUCTIONS ***
    .\n\nInstructions:\n${instructions}
    ${toolList ? `\n\nAvailable Tools:\n${toolList}` : ""}
    `.trim();

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
