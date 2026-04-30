/** biome-ignore-all lint/suspicious/noExplicitAny: any acceptable for now */
import type { UIMessage } from "ai";

export interface ExecutorContextType {
  channel: any;
  history: UIMessage[];
  outputs: Record<string, any>;
  workflowRunId: string;
}

export interface ExecutorResultType {
  output: any;
}
