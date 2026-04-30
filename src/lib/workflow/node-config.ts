import {
  Comment01Icon,
  GitBranchIcon,
  Globe02Icon,
  Play,
  RoboticIcon,
  StopIcon,
} from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { agentNodeExecutor } from "@/components/workflow/custom-nodes/agent/executor";
import { endNodeExecutor } from "@/components/workflow/custom-nodes/end/executor";
import { ifElseNodeExecutor } from "@/components/workflow/custom-nodes/if-else/executor";
import { startNodeExecutor } from "../../components/workflow/custom-nodes/start/executor";
import { generateId } from "../helper";
import { MODELS } from "./constants";

export const NodeTypeEnum = {
  START: "start",
  END: "end",
  AGENT: "agent",
  IF_ELSE: "if_else",
  HTTP: "http",
  COMMENT: "comment",
} as const;

export type NodeType = (typeof NodeTypeEnum)[keyof typeof NodeTypeEnum];

export const NODE_EXECUTORS = {
  [NodeTypeEnum.START]: startNodeExecutor,
  [NodeTypeEnum.AGENT]: agentNodeExecutor,
  [NodeTypeEnum.IF_ELSE]: ifElseNodeExecutor,
  [NodeTypeEnum.END]: endNodeExecutor, // end node executor
  [NodeTypeEnum.HTTP]: null, // to be implemented
};

interface NodeConfigBase {
  color: string;
  icon: IconSvgElement;

  inputs: Record<string, unknown>;
  label: string;
  outputs: string[];
  type: NodeType;
}

export const NODE_CONFIG: Record<NodeType, NodeConfigBase> = {
  [NodeTypeEnum.START]: {
    color: "bg-emerald-500",
    icon: Play,
    label: "Start",
    type: NodeTypeEnum.START,
    inputs: {},
    outputs: ["input"], // {{startId.input}}
  },
  [NodeTypeEnum.END]: {
    color: "bg-rose-500",
    icon: StopIcon,
    label: "End",
    type: NodeTypeEnum.END,
    inputs: {
      value: "",
    },
    outputs: ["output.text"],
  },
  [NodeTypeEnum.AGENT]: {
    color: "bg-blue-500",
    icon: RoboticIcon,
    label: "Agent",
    type: NodeTypeEnum.AGENT,
    inputs: {
      label: "Agent",
      instructions: "",
      model: MODELS[0].value,
      tools: [],
      outputFormat: "text", // text or json
      responseSchema: null,
    },
    outputs: ["output.text"], // {{agentId.output.text}} === "return_item"
  },
  [NodeTypeEnum.IF_ELSE]: {
    color: "bg-yellow-500",
    icon: GitBranchIcon,
    label: "If/Else",
    type: NodeTypeEnum.IF_ELSE,
    inputs: {
      conditions: [
        {
          caseName: "",
          variable: "",
          operator: "",
          value: "",
        },
      ],
    },
    outputs: ["output.result"], // {{ifElseId.output.result}} === "caseName"
  },
  [NodeTypeEnum.HTTP]: {
    color: "bg-purple-500",
    icon: Globe02Icon,
    label: "HTTP",
    type: NodeTypeEnum.HTTP,
    inputs: {
      method: "GET",
      url: "",
      headers: {},
      body: {},
    },
    outputs: ["output.body"],
  },
  [NodeTypeEnum.COMMENT]: {
    color: "bg-gray-500",
    icon: Comment01Icon,
    label: "Comment",
    type: NodeTypeEnum.COMMENT,
    inputs: {
      comment: "",
    },
    outputs: [],
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
    isDeletable: type !== NodeTypeEnum.START,
    data: {
      label: config.label,
      color: config.color,
      outputs: config.outputs,
      ...config.inputs,
    },
  };
}

export const getExecutorNode = (type: NodeType) => {
  const executor = NODE_EXECUTORS[type as keyof typeof NODE_EXECUTORS];

  if (!executor) {
    throw new Error(`Executor not found for node type: ${type}`);
  }

  return executor;
};
