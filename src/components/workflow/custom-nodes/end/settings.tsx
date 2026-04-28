/** biome-ignore-all lint/suspicious/noExplicitAny: data can be of any type */

import { useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  data: any;
  id: string;
}

export const EndNodeSettings = ({ id, data }: Props) => {
  const { updateNodeData } = useReactFlow();

  const [value, setValue] = useState((data?.value as string) ?? "");

  const handleValueChange = (value: string) => {
    updateNodeData(id, {
      value,
    });
  };

  return (
    <div className="space-y-2">
      <Label className="font-medium" htmlFor="output">
        Output
      </Label>
      <Textarea
        className="resize-none bg-muted/50"
        id="output"
        onBlur={(e) => handleValueChange(e.target.value)}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Define the output variable or message"
        rows={4}
        value={value}
      />

      <p className="text-muted-foreground text-xs">
        Set the final output value or message for this workflow.
      </p>
    </div>
  );
};
