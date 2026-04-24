import { RoboticIcon } from "@hugeicons/core-free-icons";
import type { NodeProps } from "@xyflow/react";
import { WorkflowNode } from "../../workflow-node";

export const AgentNode = (props: NodeProps) => {
  const { id, data, selected } = props;

  const bgColor = (data?.color as string) || "bg-blue-500";
  const label = (data?.label as string) || "Agent";

  return (
    <div>
      <WorkflowNode
        className="min-w-28!"
        color={bgColor as string}
        handles={{
          target: true,
          source: true,
        }}
        icon={RoboticIcon}
        isDeletable={true}
        label={label}
        nodeId={id}
        selected={selected}
        settingComponent={null}
        settingDescription="Configure the agent's behavior and properties"
        settingTitle={`${label} Node Settings`}
        subText="Agent"
      />
    </div>
  );
};
