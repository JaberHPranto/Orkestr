/** biome-ignore-all lint/suspicious/noExplicitAny: Forwarding types from reactflow */
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  type Edge,
  type Node,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import { AgentNode } from "@/components/workflow/custom-nodes/agent/node";
import { StartNode } from "@/components/workflow/custom-nodes/start/node";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/constants/workflow";
import { useWorkflowContext } from "@/context/workflow-context";
import { cn } from "@/lib/utils";
import {
  createNode,
  type NodeType,
  NodeTypeEnum,
} from "@/lib/workflow/node-config";
import { CustomControls } from "./custom-controls";
import { NodePanel } from "./node-panel";

export const WorkflowCanvas = () => {
  const { view } = useWorkflowContext();
  const { screenToFlowPosition } = useReactFlow();

  const startNode = createNode({
    type: NodeTypeEnum.START,
    position: { x: 400, y: 200 },
  });

  const [nodes, setNodes] = useState<Node[]>([startNode]);
  const [edges, setEdges] = useState<Edge[]>([]);

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const isSelectMode = toolMode === TOOL_MODE_ENUM.SELECT;

  const isPreview = view === "preview";

  const nodeTypes = {
    [NodeTypeEnum.START]: StartNode,
    [NodeTypeEnum.AGENT]: AgentNode,
  };

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    []
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    []
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    []
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const node_type = event.dataTransfer.getData("application/reactflow");

      if (!node_type) {
        return;
      }

      const position = screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode = createNode({ type: node_type as NodeType, position });

      setNodes((nds) => nds.concat(newNode));
    },
    [screenToFlowPosition]
  );

  return (
    <div className="relative flex h-full flex-1 overflow-hidden bg-red-400!">
      <div className="relative h-full flex-1">
        <ReactFlow
          className={cn(
            isSelectMode
              ? "cursor-default"
              : "cursor-grab active:cursor-grabbing"
          )}
          colorMode="system"
          deleteKeyCode={["Delete", "Backspace"]}
          edges={edges}
          fitView
          nodes={nodes}
          nodesDraggable={isSelectMode}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onEdgesChange={onEdgesChange}
          onNodesChange={onNodesChange}
          panOnDrag={!isSelectMode}
          panOnScroll={!isSelectMode}
          selectionOnDrag={isSelectMode}
          zoomOnPinch={!isSelectMode}
          zoomOnScroll={!isSelectMode}
        >
          <Background
            bgColor={"var(--sidebar)"}
            variant={BackgroundVariant.Dots}
          />

          {!isPreview && (
            <>
              <NodePanel />
              <CustomControls setToolMode={setToolMode} toolMode={toolMode} />
            </>
          )}
        </ReactFlow>
      </div>
    </div>
  );
};
