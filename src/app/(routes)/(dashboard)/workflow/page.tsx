"use client";
import { WorkflowSquare06Icon } from "@hugeicons/core-free-icons";
import { format } from "date-fns";
import { useRouter } from "next/navigation";
import { Icon } from "@/components/icon";
import { Card, CardContent } from "@/components/ui/card";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Skeleton } from "@/components/ui/skeleton";
import { UseGetWorkflows } from "@/features/use-workflow";
import { WorkflowDialog } from "../_common/workflow-dialog";

export const Page = () => {
  const { data: workflows, isPending, isError } = UseGetWorkflows();

  const router = useRouter();

  const renderWorkflows = () => {
    if (isPending) {
      return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: skeletons
            <Skeleton className="h-40" key={index} />
          ))}
        </div>
      );
    }

    if (isError || !workflows?.length) {
      return (
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <Icon icon={WorkflowSquare06Icon} />
            </EmptyMedia>
            <EmptyTitle>No Workflows Found</EmptyTitle>
            <EmptyDescription>
              You haven't created any workflows yet. Click the button above to
              create your first workflow.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      );
    }

    return (
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {workflows.map((workflow) => (
          <Card
            className="cursor-pointer py-5"
            key={workflow.id}
            onClick={() => router.push(`/workflow/${workflow.id}`)}
          >
            <CardContent className="space-y-5">
              <div>
                <div className="relative mb-3">
                  <div className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Icon icon={WorkflowSquare06Icon} />
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="font-semibold text-foreground">
                    {workflow.name}
                  </h3>
                  <p className="line-clamp-2 text-ellipsis text-muted-foreground text-xs">
                    {workflow.description ?? "No description provided."}
                  </p>
                </div>
              </div>

              <div className="flex items-center pt-1 font-medium text-muted-foreground/70 text-xs">
                <span>
                  {format(new Date(workflow.createdAt), "MMM d, yyyy")}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-auto">
      <div className="py-4">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-3xl text-foreground">Workflow</h1>
            <p className="mt-1 text-muted-foreground">
              Build a agent workflow with custom logic and tools
            </p>
          </div>
          <WorkflowDialog />
        </div>

        {renderWorkflows()}
      </div>
    </div>
  );
};

export default Page;
