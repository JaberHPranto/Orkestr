import { type NodeProps, useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

export const CommentNode = (props: NodeProps) => {
  const { id, data } = props;

  const { updateNodeData } = useReactFlow();

  const [comment, setComment] = useState<string>(
    (data?.comment as string) || ""
  );

  const handleCommentChange = (value: string) => {
    updateNodeData(id, { comment: value });
  };

  return (
    <div
      className={cn(
        "box-border size-full rounded-lg border bg-amber-300 p-1 dark:bg-[#b08915]"
      )}
      style={{
        width: "150px",
        minHeight: "40px",
        maxHeight: "150px",
      }}
    >
      <Textarea
        className="h-full max-h-37.5 min-h-10 w-full resize-none overflow-auto border-none px-1! text-xs! shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 dark:text-black"
        onBlur={(e) => handleCommentChange(e.target.value)}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write a comment..."
        value={comment ?? ""}
      />
    </div>
  );
};
