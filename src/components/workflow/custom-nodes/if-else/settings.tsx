/** biome-ignore-all lint/suspicious/noExplicitAny: data can be anything */
"use client";

import { Delete02Icon, Plus } from "@hugeicons/core-free-icons";
import { useReactFlow } from "@xyflow/react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MentionInput } from "../../mention-input";

interface Props {
  data: any;
  id: string;
}

interface Condition {
  caseName: "";
  operator: "";
  value: "";
  variable: "";
}

const OPERATORS = [
  { label: "Equals", value: "==" },
  { label: "Not Equals", value: "!=" },
  { label: "Greater Than", value: ">" },
  { label: "Less Than", value: "<" },
  { label: "Greater Than or Equal To", value: ">=" },
  { label: "Less Than or Equal To", value: "<=" },
];

export const IfElseSettings = ({ id, data }: Props) => {
  const { updateNodeData } = useReactFlow();

  const conditions: Condition[] = data?.conditions as Condition[];

  const getConditionLabel = (index: number) => {
    if (index === 0) {
      return "If";
    }
    return "Else If";
  };

  const handleAddCondition = () => {
    const newConditions = [
      ...conditions,
      { caseName: "", operator: "", value: "", variable: "" },
    ];
    updateNodeData(id, { conditions: newConditions });
  };

  const handleRemoveCondition = (index: number) => {
    const remainingConditions = conditions.filter((_, i) => i !== index);
    updateNodeData(id, { conditions: remainingConditions });
  };

  const handleConditionChange = (
    index: number,
    field: keyof Condition,
    value: string
  ) => {
    const updatedConditions = conditions.map((condition, i) => {
      if (i === index) {
        return { ...condition, [field]: value };
      }
      return condition;
    });
    updateNodeData(id, { conditions: updatedConditions });
  };

  return (
    <div className="space-y-2">
      {conditions.map((condition, index) => (
        <div
          className="space-y-2 border-b pb-2.5 last:border-b-0"
          key={`condition-settings-${index as number}`}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm"> {getConditionLabel(index)}</h4>

            {conditions.length > 1 && (
              <Button
                className={
                  "size-6 hover:bg-destructive/10 hover:text-destructive"
                }
                onClick={() => handleRemoveCondition(index)}
                size={"icon-sm"}
                variant={"ghost"}
              >
                <Icon className="size-3.5" icon={Delete02Icon} />
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Input
              className="bg-muted/50"
              onChange={(e) =>
                handleConditionChange(index, "caseName", e.target.value)
              }
              placeholder="Case Name (optional)"
              value={condition.caseName || ""}
            />
          </div>

          <div className="flex gap-2">
            <MentionInput
              className="w-full max-w-48! bg-muted/50 text-xs"
              multiline={false}
              nodeId={id}
              onChange={(value) =>
                handleConditionChange(index, "variable", value)
              }
              placeholder="{{agent.output}}"
              showTriggerButton
              value={condition.variable || ""}
            />

            <Select
              onValueChange={(value) =>
                handleConditionChange(index, "operator", value as string)
              }
              value={condition.operator}
            >
              <SelectTrigger className={"w-28 text-lg"}>
                <SelectValue placeholder="Operator" />
              </SelectTrigger>
              <SelectContent>
                {OPERATORS.map((operator) => (
                  <SelectItem key={operator.value} value={operator.value}>
                    {operator.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              className="bg-muted/50"
              onChange={(e) =>
                handleConditionChange(index, "value", e.target.value)
              }
              placeholder="Value"
              value={condition.value || ""}
            />
          </div>

          <Button onClick={handleAddCondition} size={"sm"} variant={"outline"}>
            <Icon className="mr-2 size-3.5" icon={Plus} />
            Add
          </Button>
        </div>
      ))}
    </div>
  );
};
