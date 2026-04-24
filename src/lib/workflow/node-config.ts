import {
  Comment01Icon,
  GitBranchIcon,
  Globe02Icon,
  Play,
  RoboticIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { generateId } from "../helper";

export const NodeTypeEnum = {
  START: "start",
  END: "end",
  AGENT: "agent",
  IF_ELSE: "if_else",
  HTTP: "http",
  COMMENT: "comment",
} as const;

export type NodeType = (typeof NodeTypeEnum)[keyof typeof NodeTypeEnum];

interface NodeConfigBase {
  color: string;
  icon: IconSvgElement;
  label: string;
  type: NodeType;

  // inputs: Record<string, unknown>;
  // outputs: string[];
}

export const NODE_CONFIG: Record<NodeType, NodeConfigBase> = {
  [NodeTypeEnum.START]: {
    color: "bg-emerald-500",
    icon: Play,
    label: "Start",
    type: NodeTypeEnum.START,
  },
  [NodeTypeEnum.END]: {
    color: "bg-red-500",
    icon: StopIcon,
    label: "End",
    type: NodeTypeEnum.END,
  },
  [NodeTypeEnum.AGENT]: {
    color: "bg-blue-500",
    icon: RoboticIcon,
    label: "Agent",
    type: NodeTypeEnum.AGENT,
  },
  [NodeTypeEnum.IF_ELSE]: {
    color: "bg-yellow-500",
    icon: GitBranchIcon,
    label: "If/Else",
    type: NodeTypeEnum.IF_ELSE,
  },
  [NodeTypeEnum.HTTP]: {
    color: "bg-purple-500",
    icon: Globe02Icon,
    label: "HTTP",
    type: NodeTypeEnum.HTTP,
  },
  [NodeTypeEnum.COMMENT]: {
    color: "bg-gray-500",
    icon: Comment01Icon,
    label: "Comment",
    type: NodeTypeEnum.COMMENT,
  },
};

export const getNodeConfig = (type: NodeType) => {
  const nodeType = NODE_CONFIG?.[type];

  if (!nodeType) {
    return null;
  }
  return nodeType;
};

export interface CreateNodeOptions {
  position?: { x: number; y: number };
  type: NodeType;
}

export function createNode(options: CreateNodeOptions) {
  const { position = { x: 400, y: 200 }, type } = options;

  const config = getNodeConfig(type);

  if (!config) {
    throw new Error(`Invalid node type: ${type}`);
  }

  const id = generateId(type);

  return {
    id,
    type,
    position,
    data: {
      label: config.label,
      color: config.color,
      // ...config,
    },
  };
}
