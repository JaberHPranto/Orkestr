/** biome-ignore-all lint/suspicious/noExplicitAny: any */
import type { Edge, Node } from "@xyflow/react";
import Mustache from "mustache";
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

  if (!obj || typeof obj !== "object") {
    return {
      nodes: [],
      edges: [],
    };
  }
  return {
    nodes: (obj?.nodes ?? []) as Node[],
    edges: (obj?.edges ?? []) as Edge[],
  };
}

export function replaceVariables(
  template: string,
  variables: Record<string, any>
) {
  return Mustache.render(template, variables);
}
