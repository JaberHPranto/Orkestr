import type { Edge, Node } from "@xyflow/react";
import { useMemo } from "react";
import { useWorkflowStore } from "@/store/workflow-store";

interface useUnsavedChangesReturns {
  discardChanges: () => {
    nodes: Node[];
    edges: Edge[];
  };
  hasUnsavedChanges: boolean;
}

interface Props {
  edges: Edge[];
  nodes: Node[];
}

export const useUnsavedChanges = ({
  edges,
  nodes,
}: Props): useUnsavedChangesReturns => {
  const { savedEdges, savedNodes } = useWorkflowStore();

  const hasUnsavedChanges = useMemo(() => {
    const nodeData = (list: Node[]) =>
      list.map((n) => ({ id: n.id, type: n.type, data: n.data }));
    const edgeData = (list: Edge[]) =>
      list.map((e) => ({ source: e.source, target: e.target, id: e.id }));

    return (
      JSON.stringify(nodeData(nodes)) !==
        JSON.stringify(nodeData(savedNodes)) ||
      JSON.stringify(edgeData(edges)) !== JSON.stringify(edgeData(savedEdges))
    );
  }, [nodes, edges, savedNodes, savedEdges]);

  const discardChanges = () => ({ nodes: savedNodes, edges: savedEdges });

  return {
    hasUnsavedChanges,
    discardChanges,
  };
};
