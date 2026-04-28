import { StopIcon } from "@hugeicons/core-free-icons";
import type { NodeProps } from "@xyflow/react";
import { WorkflowNode } from "../../workflow-node";
import { EndNodeSettings } from "./settings";

export const EndNode = (props: NodeProps) => {
  const { id, data, selected } = props;

  const bgColor = data?.color || "bg-rose-500";

  return (
    <div>
      <WorkflowNode
        className="min-w-28!"
        color={bgColor as string}
        handles={{
          target: true,
          source: false,
        }}
        icon={StopIcon}
        isDeletable
        label="End"
        nodeId={id}
        selected={selected}
        settingComponent={<EndNodeSettings data={data} id={id} />}
        settingDescription="The workflow ending point"
        settingTitle="End Node Settings"
        subText="Trigger"
      />
    </div>
  );
};
