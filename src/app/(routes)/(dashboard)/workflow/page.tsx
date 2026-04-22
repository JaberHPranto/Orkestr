import { Plus, WorkflowSquare06Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export const Page = () => (
  <div className="min-h-auto">
    <div className="py-4">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-foreground">Workflow</h1>
          <p className="mt-1 text-muted-foreground">
            Build a agent workflow with custom logic and tools
          </p>
        </div>

        <Button>
          <HugeiconsIcon className="size-4" icon={Plus} />
          <span>New Workflow</span>
        </Button>
      </div>

      <div>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant={"icon"}>
              <HugeiconsIcon icon={WorkflowSquare06Icon} />
            </EmptyMedia>
            <EmptyTitle>No Workflows Found</EmptyTitle>
            <EmptyDescription>
              You haven't created any workflows yet. Click the button above to
              create your first workflow.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      </div>
    </div>
  </div>
);

export default Page;
