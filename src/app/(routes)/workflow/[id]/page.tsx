"use client";

import { ReactFlowProvider } from "@xyflow/react";
import { useParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { WorkflowProvider } from "@/context/workflow-context";
import { UseGetWorkflowById } from "@/features/use-workflow";
import { Header } from "./_common/header";
import { WorkflowCanvas } from "./_common/workflow-canvas";

const Page = () => {
  const params = useParams();

  const { data: workflow, isPending } = UseGetWorkflowById(params.id as string);

  if (!(isPending || workflow)) {
    return <div>Workflow not found</div>;
  }

  if (isPending) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <ReactFlowProvider>
        <WorkflowProvider>
          <div className="relative flex h-screen flex-col bg-blue-400!">
            <Header
              isLoading={isPending}
              name={workflow.name}
              workflowId={workflow.id}
            />

            <div className="relative flex-1 overflow-hidden">
              {isPending ? (
                <div className="flex items-center justify-center">
                  <Spinner className="size-12 text-primary" />
                </div>
              ) : (
                <WorkflowCanvas />
              )}
            </div>
          </div>
        </WorkflowProvider>
      </ReactFlowProvider>
    </div>
  );
};
export default Page;
