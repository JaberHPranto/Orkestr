import {
  FourFinger03Icon,
  FullscreenIcon,
  MinusSignIcon,
  PlusSignIcon,
  SquareMousePointerIcon,
} from "@hugeicons/core-free-icons";
import { useReactFlow, useStore } from "@xyflow/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { TOOL_MODE_ENUM, type ToolModeType } from "@/constants/workflow";

interface Props {
  setToolMode: React.Dispatch<React.SetStateAction<ToolModeType>>;
  toolMode: ToolModeType;
}

export const CustomControls = ({ toolMode, setToolMode }: Props) => {
  const { zoomIn, zoomOut, fitView } = useReactFlow();

  const zoom = useStore((state) => state.transform[2]);
  const zoomPercentage = Math.round(zoom * 100);

  return (
    <div className="absolute bottom-6 left-1/2 z-50 flex -translate-x-1/2 items-center gap-1 rounded-full border bg-background/80 p-2 shadow-lg backdrop-blur-md">
      <div className="mr-2 flex items-center gap-1">
        <Button
          className="size-8 rounded-full"
          onClick={() => setToolMode(TOOL_MODE_ENUM.HAND)}
          size={"icon"}
          variant={toolMode === TOOL_MODE_ENUM.HAND ? "secondary" : "ghost"}
        >
          <Icon className="size-4" icon={FourFinger03Icon} />
        </Button>
        <Button
          className="size-8 rounded-full"
          onClick={() => setToolMode(TOOL_MODE_ENUM.SELECT)}
          size={"icon"}
          variant={toolMode === TOOL_MODE_ENUM.SELECT ? "secondary" : "ghost"}
        >
          <Icon className="size-4" icon={SquareMousePointerIcon} />
        </Button>
      </div>

      <Separator className={"h-8"} orientation="vertical" />

      <div className="ml-2 flex items-center gap-px">
        <Button
          className={"size-8 rounded-full"}
          onClick={() => zoomOut()}
          size={"icon"}
          variant={"ghost"}
        >
          <Icon className="size-4" icon={MinusSignIcon} />
        </Button>

        <div className="min-w-7 text-center font-medium text-xs tabular-nums">
          {zoomPercentage}%
        </div>

        <Button
          className={"size-8 rounded-full"}
          onClick={() => zoomIn()}
          size={"icon"}
          variant={"ghost"}
        >
          <Icon className="size-4" icon={PlusSignIcon} />
        </Button>
      </div>

      <Separator className={"h-8"} orientation="vertical" />

      <Button
        className={"size-8 rounded-full"}
        onClick={() => fitView()}
        size={"icon"}
        variant={"ghost"}
      >
        <Icon className="size-4" icon={FullscreenIcon} />
      </Button>
    </div>
  );
};
