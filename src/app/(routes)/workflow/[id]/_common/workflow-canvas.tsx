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
import {
  ActionBar,
  ActionBarGroup,
  ActionBarItem,
} from "@/components/ui/action-bar";
import { Spinner } from "@/components/ui/spinner";
import { AgentNode } from "@/components/workflow/custom-nodes/agent/node";
import { CommentNode } from "@/components/workflow/custom-nodes/comment/node";
import { EndNode } from "@/components/workflow/custom-nodes/end/node";
import { IfElseNode } from "@/components/workflow/custom-nodes/if-else/node";
import { StartNode } from "@/components/workflow/custom-nodes/start/node";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/constants/workflow";
import { useWorkflowContext } from "@/context/workflow-context";
import { UseUpdateWorkflow } from "@/features/use-workflow";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { cn } from "@/lib/utils";
import {
  createNode,
  type NodeType,
  NodeTypeEnum,
} from "@/lib/workflow/node-config";
import { CustomControls } from "./custom-controls";
import { NodePanel } from "./node-panel";

interface Props {
  workflowId: string;
}

export const WorkflowCanvas = ({ workflowId }: Props) => {
  const { view, nodes, edges, setNodes, setEdges } = useWorkflowContext();
  const { screenToFlowPosition } = useReactFlow();

  const [toolMode, setToolMode] = useState<ToolModeType>(TOOL_MODE_ENUM.SELECT);
  const isSelectMode = toolMode === TOOL_MODE_ENUM.SELECT;

  const { mutate: updateWorkflow, isPending: isSaving } =
    UseUpdateWorkflow(workflowId);

  const { hasUnsavedChanges, discardChanges } = useUnsavedChanges({
    edges,
    nodes,
  });

  const isPreview = view === "preview";

  const nodeTypes = {
    [NodeTypeEnum.START]: StartNode,
    [NodeTypeEnum.AGENT]: AgentNode,
    [NodeTypeEnum.IF_ELSE]: IfElseNode,
    [NodeTypeEnum.COMMENT]: CommentNode,
    [NodeTypeEnum.END]: EndNode,
  };

  const onNodesChange = useCallback(
    (changes: any) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [setNodes]
  );
  const onEdgesChange = useCallback(
    (changes: any) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [setEdges]
  );
  const onConnect = useCallback(
    (params: any) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [setEdges]
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
    [screenToFlowPosition, setNodes]
  );

  const handleDiscard = () => {
    const { nodes: savedNodes, edges: savedEdges } = discardChanges();
    setNodes(savedNodes);
    setEdges(savedEdges);
  };

  const handleSaveChanges = () => {
    updateWorkflow({
      edges,
      nodes,
    });
  };

  return (
    <>
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

      {hasUnsavedChanges && (
        <ActionBar
          align="center"
          className="max-w-xs"
          open={true}
          side="top"
          sideOffset={70}
        >
          <ActionBarGroup>
            <ActionBarItem
              disabled={isSaving}
              onClick={handleDiscard}
              variant={"ghost"}
            >
              Discard
            </ActionBarItem>
            <ActionBarItem disabled={isSaving} onClick={handleSaveChanges}>
              {isSaving && <Spinner />}
              Save Changes
            </ActionBarItem>
          </ActionBarGroup>
        </ActionBar>
      )}
    </>
  );
};
