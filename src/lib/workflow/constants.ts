import { Globe02Icon, ServerStack03Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const MODELS = [
  // OpenAI
  { value: "openai/gpt-5.4-mini", label: "GPT Mini" },
  // Qwen (Alibaba)
  { value: "qwen/qwen3.6-max-preview", label: "Qwen3.6 Max Preview" },
  { value: "qwen/qwen3.6-flash", label: "Qwen3.6 Flash" },
  // Moonshot
  { value: "moonshotai/kimi-k2.6", label: "Kimi K2.6" },
  // DeepSeek
  { value: "deepseek/deepseek-r1", label: "DeepSeek R1" },
  { value: "deepseek/deepseek-chat", label: "DeepSeek V3" },
  // Anthropic
  { value: "anthropic/claude-haiku-4.5", label: "Claude Haiku" },
  // Google
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "google/gemini-2.0-flash-001", label: "Gemini 2.0 Flash" },
];

export interface MCPToolType {
  description: string;
  name: string;
}

export interface ToolType {
  description: string;
  icon: IconSvgElement;
  id: string;
  name: string;
  tools?: MCPToolType[];
  type: "native" | "mcp";
}

export const TOOLS: ToolType[] = [
  {
    id: "webSearch",
    type: "native",
    name: "Web Search",
    description: "Search the web",
    icon: Globe02Icon,
  },
  {
    id: "mcpServer",
    type: "mcp",
    name: "MCP Server",
    description: "Connect to external MCP server",
    icon: ServerStack03Icon,
    tools: [],
  },
];
