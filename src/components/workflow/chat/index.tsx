import { Sheet, SheetContent } from "@/components/ui/sheet";
import { useWorkflowContext } from "@/context/workflow-context";
import { ChatPanel } from "./chat-panel";

interface Props {
  workflowId: string;
}

export const ChatView = ({ workflowId }: Props) => {
  const { view, setView } = useWorkflowContext();
  const isPreview = view === "preview";

  const handlePreviewClose = () => {
    setView("edit");
  };

  return (
    <Sheet
      modal={false}
      onOpenChange={(open) => !open && handlePreviewClose()}
      open={isPreview}
    >
      <SheetContent
        className={
          "top-18! z-95 mr-1 h-full max-h-[calc(100vh-5rem)] w-full overflow-hidden rounded-md bg-background p-0 sm:max-w-lg!"
        }
        overlayClassName="bg-black/30! backdrop-blur-xs!"
        showCloseButton={false}
        side="right"
      >
        <ChatPanel workflowId={workflowId} />
      </SheetContent>
    </Sheet>
  );
};
