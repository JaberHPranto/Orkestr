import { PlayIcon } from "@hugeicons/core-free-icons";
import type { NodeProps } from "@xyflow/react";
import { WorkflowNode } from "../../workflow-node";
import { StartNodeSettings } from "./settings";

export const StartNode = (props: NodeProps) => {
  const { id, data, selected } = props;

  const bgColor = data?.color || "bg-emerald-500";

  return (
    <div>
      <WorkflowNode
        className="min-w-28!"
        color={bgColor as string}
        handles={{
          target: false,
          source: true,
        }}
        icon={PlayIcon}
        label="Start"
        nodeId={id}
        selected={selected}
        settingComponent={<StartNodeSettings nodeId={id} />}
        settingDescription="The workflow starting point"
        settingTitle="Start Node Settings"
        subText="Trigger"
      />
    </div>
  );
};
