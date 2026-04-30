import type { Node } from "@xyflow/react";
import type { ExecutorContextType } from "@/types/workflow";

interface Props {
  context: ExecutorContextType;
  node: Node;
}

export function endNodeExecutor({ node }: Props) {
  const text = node.data?.value || "Workflow execution completed.";

  return {
    output: text,
  };
}
