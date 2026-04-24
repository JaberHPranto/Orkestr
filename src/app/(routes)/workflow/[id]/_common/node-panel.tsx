import { Panel } from "@xyflow/react";
import { Icon } from "@/components/icon";
import { cn } from "@/lib/utils";
import { getNodeConfig, NodeTypeEnum } from "@/lib/workflow/node-config";

export const NodePanel = () => {
  const NODE_LIST = [
    {
      group: "Core",
      items: [
        NodeTypeEnum.START,
        NodeTypeEnum.END,
        NodeTypeEnum.COMMENT,
        NodeTypeEnum.AGENT,
      ],
    },
    {
      group: "Logic",
      items: [NodeTypeEnum.IF_ELSE],
    },
    {
      group: "Integrations",
      items: [NodeTypeEnum.HTTP],
    },
  ];

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType);
    event.dataTransfer.effectAllowed = "move";
  };

  return (
    <Panel
      className="top-10! flex h-fit w-60 flex-col rounded-lg border bg-card p-4 shadow-xl"
      position="top-left"
    >
      {NODE_LIST.map((group, index) => (
        <div className={cn(index > 0 ? "mt-2" : "")} key={group.group}>
          <h4 className="px-1 font-medium text-[11px] text-muted-foreground">
            {group.group}
          </h4>
          <div className="space-y-1">
            {group.items.map((nodeType) => {
              const config = getNodeConfig(nodeType);
              if (!config) {
                return null;
              }

              const icon = config.icon;
              return (
                <button
                  className={
                    "group flex w-full cursor-grab items-center gap-3 p-1 transition-all hover:bg-background active:cursor-grabbing disabled:pointer-events-none disabled:opacity-50"
                  }
                  disabled={false}
                  draggable
                  key={nodeType}
                  onDragStart={(e) => onDragStart(e, nodeType)}
                  type="button"
                >
                  <div
                    className={cn(
                      `flex size-7 items-center justify-center rounded-sm ${config.color}`
                    )}
                  >
                    <Icon className="size-3.5! text-white" icon={icon} />
                  </div>
                  <span className="font-medium text-foreground text-sm">
                    {config.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </Panel>
  );
};
