"use client";

import { Delete02Icon, Settings01Icon } from "@hugeicons/core-free-icons";
import type { IconSvgElement } from "@hugeicons/react";
import { Position, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Icon } from "../icon";
import { Button } from "../ui/button";
import { ButtonGroup } from "../ui/button-group";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { BaseHandle } from "./react-flow/base-handle";
import {
  BaseNode,
  BaseNodeContent,
  BaseNodeHeader,
  BaseNodeHeaderTitle,
} from "./react-flow/base-node";
import { NodeStatusIndicator } from "./react-flow/node-status-indicator";

interface Props {
  children?: React.ReactNode;
  className?: string;
  color?: string;
  handles: { target: boolean; source: boolean };
  icon: IconSvgElement;
  isDeletable?: boolean;
  label: string;
  nodeId: string;
  selected?: boolean;

  settingComponent?: React.ReactNode;
  settingDescription?: string;
  settingTitle?: string;
  status?: "initial" | "loading" | "error" | "success";
  subText: string;
}

export const WorkflowNode = ({
  nodeId,
  label,
  subText,
  icon,
  handles,
  isDeletable,
  selected,
  color,
  status,
  className,
  children,
  settingComponent,
  settingTitle,
  settingDescription,
}: Props) => {
  const { deleteElements } = useReactFlow();

  const [settingsOpen, setSettingsOpen] = useState(false);

  const onDelete = () => {
    if (!isDeletable) {
      toast.error("This node cannot be deleted");
      return;
    }
    deleteElements({ nodes: [{ id: nodeId }] });
  };

  return (
    <>
      <div className="relative">
        <NodeStatusIndicator status={status} variant="border">
          <BaseNode
            className={cn("w-fit min-w-36 cursor-pointer", className)}
            onDoubleClick={(e) => {
              if (!settingComponent) {
                return;
              }

              e.stopPropagation();
              setSettingsOpen(true);
            }}
          >
            <BaseNodeHeader className="flex items-start px-2 pt-3 pb-3.5">
              <div className="flex items-center gap-2">
                <div
                  className={cn(
                    "flex size-7 items-center justify-center rounded-sm!",
                    color
                  )}
                >
                  <Icon className="size-3.5! text-white" icon={icon} />
                </div>

                <div className="flex flex-col">
                  <BaseNodeHeaderTitle className="pr-2 font-medium! text-sm!">
                    {label}
                  </BaseNodeHeaderTitle>

                  {subText && (
                    <p className="-mt-0.5 max-w-20 truncate text-muted-foreground text-xs">
                      {subText}
                    </p>
                  )}
                </div>
              </div>

              {selected && (
                <ButtonGroup className="-mt-px flex items-center">
                  {settingComponent && (
                    <Button
                      className={"size-6! hover:bg-accent"}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSettingsOpen(true);
                      }}
                      size="icon-sm"
                      variant={"ghost"}
                    >
                      <Icon
                        className="-mt-0.5 size-3.5"
                        icon={Settings01Icon}
                      />
                    </Button>
                  )}

                  {isDeletable && (
                    <Button
                      className={
                        "-ml-px size-6! hover:bg-destructive/10 hover:text-destructive"
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete();
                      }}
                      size="icon-sm"
                      variant={"ghost"}
                    >
                      <Icon className="-mt-0.5 size-3.5" icon={Delete02Icon} />
                    </Button>
                  )}
                </ButtonGroup>
              )}
            </BaseNodeHeader>

            {children && <BaseNodeContent>{children}</BaseNodeContent>}

            {handles.target && (
              <BaseHandle
                className="size-2!"
                id={"target-1"}
                position={Position.Left}
                type="target"
              />
            )}
            {handles.source && (
              <BaseHandle
                className="size-2!"
                id={"source-1"}
                position={Position.Right}
                type="source"
              />
            )}
          </BaseNode>
        </NodeStatusIndicator>
      </div>

      {settingComponent && (
        <Dialog onOpenChange={setSettingsOpen} open={settingsOpen}>
          <DialogContent
            className="max-w-md! px-0 pb-2"
            overlayClassName="bg-black/20! backdrop-blur-sm!"
          >
            <DialogHeader className="px-4">
              <DialogTitle>{settingTitle || `${label} Settings`}</DialogTitle>
              {settingDescription && (
                <DialogDescription>{settingDescription}</DialogDescription>
              )}
            </DialogHeader>
            <div className="h-full max-h-[65vh] space-y-4 overflow-y-auto px-4">
              {settingComponent}
            </div>

            <DialogFooter className="border-t px-4 pt-2">
              <Button
                className="w-full"
                onClick={() => setSettingsOpen(false)}
                variant="outline"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};
