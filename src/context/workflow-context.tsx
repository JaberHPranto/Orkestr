import type { Edge, Node } from "@xyflow/react";
import { createContext, useContext, useState } from "react";
import { createNode, NodeTypeEnum } from "@/lib/workflow/node-config";

export type WorkflowView = "edit" | "preview";

export interface WorkflowContextType {
  edges: Edge[];
  getNodeSuggestions: (
    nodeId: string
    // biome-ignore lint/suspicious/noExplicitAny: output format is determined by individual nodes
  ) => { id: string; label: string; outputs: any }[];
  nodes: Node[];
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setView: (view: WorkflowView) => void;
  view: WorkflowView;
}

const WorkflowContext = createContext<WorkflowContextType | undefined>(
  undefined
);

export function WorkflowProvider({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<WorkflowView>("edit");

  const startNode = createNode({
    type: NodeTypeEnum.START,
    position: { x: 400, y: 200 },
  });

  const [nodes, setNodes] = useState<Node[]>([startNode]);
  const [edges, setEdges] = useState<Edge[]>([]);

  // Utility function to get all backward nodes of a given node
  const getUpstreamNodes = (nodeId: string) => {
    const upstream = new Set<string>();

    const findUpstream = (currentId: string) => {
      for (const edge of edges) {
        if (edge.target === currentId) {
          upstream.add(edge.source);
          findUpstream(edge.source);
        }
      }
    };

    findUpstream(nodeId);
    return Array.from(upstream);
  };

  const getNodeSuggestions = (nodeId: string) => {
    const upstreamNodes = getUpstreamNodes(nodeId);

    return nodes
      .filter((node) => upstreamNodes.includes(node.id))
      .map((node) => ({
        id: node.id,
        label: (node.data?.label ?? "Unknown") as string,
        outputs: node.data?.outputs || [],
      }));
  };

  return (
    <WorkflowContext.Provider
      value={{
        view,
        setView,
        nodes,
        edges,
        setNodes,
        setEdges,
        getNodeSuggestions,
      }}
    >
      {children}
    </WorkflowContext.Provider>
  );
}

export function useWorkflowContext() {
  const context = useContext(WorkflowContext);
  if (!context) {
    throw new Error(
      "useWorkflowContext must be used within a WorkflowProvider"
    );
  }
  return context;
}
