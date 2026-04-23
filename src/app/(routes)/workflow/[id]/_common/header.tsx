"use client";
import {
  ChevronLeft,
  Code,
  Edit04Icon,
  MoreHorizontal,
  Play,
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useWorkflowContext } from "@/context/workflow-context";
import { cn } from "@/lib/utils";

interface Props {
  isLoading?: boolean;
  name?: string;
  workflowId?: string;
}

type View = "edit" | "preview";

export const Header = ({ name, isLoading }: Props) => {
  const { view, setView } = useWorkflowContext();

  const tabs = [
    { id: "edit", label: "Edit", icon: Edit04Icon },
    { id: "preview", label: "Preview", icon: Play },
  ];

  const handleSetView = (view: View) => {
    setView(view);
  };

  return (
    <div className="relative">
      <header className="absolute top-0 z-50 w-full bg-transparent">
        <div className="flex h-14 items-center justify-between px-4">
          <Link
            className={cn(
              "flex items-center gap-2 rounded-lg bg-card p-1 pr-2",
              {
                "z-99": view === "preview",
              }
            )}
            href="/workflow"
          >
            <Button className={"size-8!"} size={"icon"} variant={"secondary"}>
              <Icon icon={ChevronLeft} />
            </Button>
            <div>
              {isLoading ? (
                <Skeleton className="w-20" />
              ) : (
                <h1 className="max-w-50 truncate font-semibold text-sm">
                  {name ?? "Untitled Workflow"}
                </h1>
              )}
            </div>
          </Link>

          <div className="z-999! mt-1 flex items-center gap-1 rounded-lg bg-muted p-1">
            {tabs.map((tab) => (
              <button
                className={cn(
                  "flex items-center gap-2 rounded-md px-3 py-1.5 font-medium text-muted-foreground text-sm transition-colors hover:text-foreground",
                  {
                    "bg-background text-foreground shadow-sm": view === tab.id,
                  }
                )}
                key={tab.id}
                onClick={() => handleSetView(tab.id as View)}
                type="button"
              >
                <Icon className="size-3.5" icon={tab.icon} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-lg bg-card p-1">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button className={"size-8"} size={"icon"} variant={"ghost"}>
                  <Icon className="size-4" icon={MoreHorizontal} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>
                  <span>Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button className={"h-8 gap-1.5"} variant={"ghost"}>
              <Icon className="size-4" icon={Code} />
              Code
            </Button>
          </div>
        </div>
      </header>
    </div>
  );
};
