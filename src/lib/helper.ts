import type { Edge, Node } from "@xyflow/react";
import { nanoid } from "nanoid";

export function generateId(type: string) {
  return `${type.toLowerCase()}-${nanoid(8)}`;
}

export interface FlowObject {
  edges: Edge[];
  nodes: Node[];
}

export function parseFlowObject(value: unknown): FlowObject {
  const obj = value as { nodes?: Node[]; edges?: Edge[] };
  return {
    nodes: (obj?.nodes ?? []) as Node[],
    edges: (obj?.edges ?? []) as Edge[],
  };
}
