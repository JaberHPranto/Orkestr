/** biome-ignore-all lint/suspicious/noExplicitAny: any acceptable for channel as it depends on the real-time library used */
import type { Edge, Node } from "@xyflow/react";
import type { UIMessage } from "ai";
import TopologicalSort from "topological-sort";
import type { ExecutorContextType } from "@/types/workflow";
import {
  getExecutorNode,
  type NodeType,
  NodeTypeEnum,
} from "./workflow/node-config";

const getTopologicallySortedNodes = (nodes: Node[], edges: Edge[]) => {
  const graph = new TopologicalSort(new Map());
  const excludedNodeTypes: NodeType[] = [NodeTypeEnum.COMMENT];

  for (const node of nodes) {
    graph.addNode(node.id, node);
  }

  for (const edge of edges) {
    graph.addEdge(edge.source, edge.target);
  }

  try {
    const sortedMap = graph.sort();
    const sortedIds = Array.from(sortedMap.keys());

    return sortedIds
      .map((id) => nodes.find((node) => node.id === id))
      .filter(
        (node) => node && !excludedNodeTypes.includes(node.type as NodeType)
      );
  } catch (error) {
    console.error("Error in topological sort:", error);
    throw new Error(
      "Failed to sort nodes. Please check for cycles in the workflow."
    );
  }
};

export function getNextNodes(
  currentNodeId: string,
  edges: Edge[],
  context: ExecutorContextType
) {
  const outgoingEdges = edges.filter((edge) => edge.source === currentNodeId);

  if (outgoingEdges.length === 0) {
    return [];
  }

  const currentOutput = context.outputs[currentNodeId];

  if (currentOutput?.selectedBranch) {
    const branchEdge = outgoingEdges.find(
      (edge) => edge.sourceHandle === currentOutput.selectedBranch
    );
    return branchEdge ? [branchEdge.target] : [];
  }

  return outgoingEdges.map((edge) => edge.target);
}

async function executeNode(
  node: Node,
  edges: Edge[],
  context: ExecutorContextType,
  nodesToExecute: Set<string>,
  channel: any
) {
  const nodeType = node.type as NodeType;
  const executor = getExecutorNode(nodeType);

  await channel.emit("workflow.chunks", {
    type: "data-workflow-node",
    id: node.id,
    data: {
      id: node.id,
      nodeType: node.type,
      nodeName: node.data.label,
      status: "loading",
    },
  });

  const result = await executor({ node, context });
  await channel.emit("workflow.chunks", {
    type: "data-workflow-node",
    id: node.id,
    data: {
      id: node.id,
      nodeType: node.type,
      nodeName: node.data.label,
      status: "complete",
      output: result.output?.text || result.output,
    },
  });

  if (node.type !== NodeTypeEnum.START) {
    const outputResult =
      node.type === NodeTypeEnum.AGENT ? result : result.output;
    context.outputs[node.id] = outputResult;
  }

  if (node.type === NodeTypeEnum.END) {
    return { isEnd: true };
  }

  const nextNodeIds = getNextNodes(node.id, edges, context);

  if (nextNodeIds.length === 0) {
    return { isEnd: true };
  }

  for (const id of nextNodeIds) {
    nodesToExecute.add(id);
  }

  return { isEnd: false };
}

export async function executeWorkflow({
  nodes,
  edges,
  userInput,
  workflowRunId,
  messages,
  channel,
}: {
  nodes: Node[];
  edges: Edge[];
  userInput: string;
  messages: UIMessage[];
  workflowRunId: string;
  channel: any;
}) {
  const startNode = nodes.find((node) => node.type === NodeTypeEnum.START);

  if (!startNode) {
    throw new Error("Start node not found");
  }

  const context: ExecutorContextType = {
    outputs: {
      [startNode.id]: {
        input: userInput,
      },
    },
    history: messages ?? [],
    workflowRunId,
    channel,
  };

  const sortedNodes = getTopologicallySortedNodes(nodes, edges);

  const nodesToExecute = new Set<string>([startNode.id]);

  if (sortedNodes.length === 0) {
    throw new Error("No executable nodes found in the workflow");
  }

  for (const node of sortedNodes as Node[]) {
    if (!nodesToExecute.has(node.id)) {
      continue;
    }

    try {
      const { isEnd } = await executeNode(
        node,
        edges,
        context,
        nodesToExecute,
        channel
      );

      if (isEnd) {
        await channel.emit("workflow.chunks", {
          type: "finish",
          reason: "stop",
        });
        return {
          success: true,
          output: context.outputs,
        };
      }
    } catch (error) {
      await channel.emit("workflow.chunks", {
        type: "data-workflow-node",
        id: node.id,
        data: {
          id: node.id,
          nodeType: node.type,
          nodeName: node.data?.label,
          status: "error",
          error: error instanceof Error ? error.message : String(error),
        },
      });
      throw error;
    }
  }
}
