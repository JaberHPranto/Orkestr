import type { Edge, Node } from "@xyflow/react";
import { create } from "zustand";

interface WorkflowStoreState {
  resetSavedState: () => void;
  savedEdges: Edge[];
  savedNodes: Node[];
  setSavedState: (nodes: Node[], edges: Edge[]) => void;
}

export const useWorkflowStore = create<WorkflowStoreState>((set) => ({
  savedNodes: [],
  savedEdges: [],
  setSavedState: (nodes, edges) =>
    set({
      savedNodes: nodes,
      savedEdges: edges,
    }),
  resetSavedState: () =>
    set({
      savedNodes: [],
      savedEdges: [],
    }),
}));
