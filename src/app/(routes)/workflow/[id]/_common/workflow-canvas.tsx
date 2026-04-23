/** biome-ignore-all lint/suspicious/noExplicitAny: Forwarding types from reactflow */
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/constants/workflow";
import { cn } from "@/lib/utils";
import { CustomControls } from "./custom-controls";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export const WorkflowCanvas = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const isSelectMode = toolMode === TOOL_MODE_ENUM.SELECT;

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
          edges={edges}
          fitView
          nodes={nodes}
          nodesDraggable={isSelectMode}
          onConnect={onConnect}
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
          <CustomControls setToolMode={setToolMode} toolMode={toolMode} />
        </ReactFlow>
      </div>
    </div>
  );
};
