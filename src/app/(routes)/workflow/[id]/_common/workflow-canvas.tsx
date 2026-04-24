/** biome-ignore-all lint/suspicious/noExplicitAny: Forwarding types from reactflow */
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant,
  ReactFlow,
  useReactFlow,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import "@xyflow/react/dist/style.css";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/constants/workflow";
import { useWorkflowContext } from "@/context/workflow-context";
import { cn } from "@/lib/utils";
import { createNode, type NodeType } from "@/lib/workflow/node-config";
import { CustomControls } from "./custom-controls";
import { NodePanel } from "./node-panel";

const initialNodes = [
  { id: "n1", position: { x: 0, y: 0 }, data: { label: "Node 1" } },
  { id: "n2", position: { x: 0, y: 100 }, data: { label: "Node 2" } },
];
const initialEdges = [{ id: "n1-n2", source: "n1", target: "n2" }];

export const WorkflowCanvas = () => {
  const { view } = useWorkflowContext();
  const { screenToFlowPosition } = useReactFlow();

  const [nodes, setNodes] = useState(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const isSelectMode = toolMode === TOOL_MODE_ENUM.SELECT;

  const isPreview = view === "preview";

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
