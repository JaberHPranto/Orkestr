import type { Node } from "@xyflow/react";
import type { ExecutorContextType } from "@/types/workflow";

interface Props {
  context: ExecutorContextType;
  node: Node;
}

export function startNodeExecutor({ node, context }: Props) {
  return {
    output: {
      input: context.outputs[node.id]?.input || "",
    },
  };
}
