import { GitBranchIcon } from "@hugeicons/core-free-icons";
import { type NodeProps, Position } from "@xyflow/react";
import { BaseHandle } from "../../react-flow/base-handle";
import { WorkflowNode } from "../../workflow-node";
import { IfElseSettings } from "./settings";

interface Condition {
  caseName: "";
  operator: "";
  value: "";
  variable: "";
}

export const IfElseNode = (props: NodeProps) => {
  const { id, data, selected } = props;
  const conditions: Condition[] = (data?.conditions as Condition[]) || [
    { caseName: "", operator: "", value: "", variable: "" },
  ];

  const bgColor = data?.color || "bg-yellow-500";

  const conditionStyle = `relative flex items-center justify-end p-2
  rounded-md bg-muted/30 border border-dashed border-border
text-[11px] font-medium text-muted-foreground whitespace-nowrap`;

  return (
    <div>
      <WorkflowNode
        className="min-w-28!"
        color={bgColor as string}
        handles={{
          target: true,
          source: false,
        }}
        icon={GitBranchIcon}
        label="If-Else"
        nodeId={id}
        selected={selected}
        settingComponent={<IfElseSettings data={data} id={id} />}
        settingDescription="Define conditions for branching the workflow."
        settingTitle="If / Else"
        subText="Branching"
      >
        {conditions.map((condition, index) => (
          <div className="relative" key={`condition-${index as number}`}>
            <div className={conditionStyle}>
              <p className="max-w-62.5 overflow-hidden truncate text-ellipsis whitespace-nowrap">
                {condition.caseName || `Case ${index + 1}`}
              </p>
            </div>

            <BaseHandle
              className="-right-1.5 size-2!"
              id={`condition-${index}`}
              position={Position.Right}
              type="source"
            />
          </div>
        ))}

        <div className="relative">
          <div className={conditionStyle}>Else</div>

          <BaseHandle
            className="-right-1.5 size-2!"
            id={"else"}
            position={Position.Right}
            type="source"
          />
        </div>
      </WorkflowNode>
    </div>
  );
};
