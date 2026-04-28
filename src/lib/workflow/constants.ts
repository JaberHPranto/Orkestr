import { Globe02Icon, ServerStack03Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";

export const MODELS = [
  {
    value: "google/gemini-2.0-flash-001",
    label: "Gemini 2.0 Flash",
  },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash" },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo" },
  { value: "claude-3-haiku", label: "Claude 3 Haiku (Fast)" },
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
