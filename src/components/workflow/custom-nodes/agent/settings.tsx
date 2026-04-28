/** biome-ignore-all lint/suspicious/noExplicitAny: data    */

import { Check, ChevronDown, Plus, X } from "@hugeicons/core-free-icons";
import { useReactFlow } from "@xyflow/react";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { MODELS, TOOLS } from "@/lib/workflow/constants";
import { MentionInput } from "../../mention-input";
import { JsonSchema } from "./json-schema";

interface Props {
  data: any;
  id: string;
}

const OUTPUT_FORMATS = [
  { value: "text", label: "Text" },
  { value: "json", label: "JSON" },
];

export const AgentSettings = ({ id, data }: Props) => {
  const { updateNodeData } = useReactFlow();

  const [openModel, setOpenModel] = useState(false);
  const [openFormat, setOpenFormat] = useState(false);

  const [agentLabel, setAgentLabel] = useState(data?.label ?? "Agent");
  const [instructionValue, setInstructionValue] = useState(
    data?.instructions ?? ""
  );

  const model = data?.model;
  const tools = data?.tools || [];
  const outputFormat = data?.outputFormat || "text";

  const responseSchema = data?.responseSchema || {
    type: "object",
    title: "response_schema",
    properties: {},
  };

  const handleChange = (key: string, value: any) => {
    updateNodeData(id, {
      ...data,
      [key]: value,
    });
  };

  const handleAddTool = (toolId: string) => {
    if (toolId === "mcpServer") {
      return;
    }

    const isToolExist = tools.some(
      (t: any) => t.type === "native" && t.value === toolId
    );

    if (!isToolExist) {
      handleChange("tools", [
        ...tools,
        {
          type: "native",
          id: toolId,
        },
      ]);
    }
  };

  const handleRemoveTool = (index: number) => {
    const newTools = [...tools];
    newTools.splice(index, 1);
    handleChange("tools", newTools);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Agent Name</Label>
        <Input
          className="h-8"
          onBlur={() => handleChange("label", agentLabel)}
          onChange={(e) => setAgentLabel(e.target.value)}
          placeholder="My Agent"
          value={agentLabel}
        />
      </div>
      <div className="space-y-2">
        <Label>System Instructions</Label>
        <MentionInput
          multiline
          nodeId={id}
          onBlur={() => handleChange("instructions", instructionValue)}
          onChange={(value) => setInstructionValue(value)}
          placeholder="You are a helpful assistant. Answer questions to the best of your ability."
          showTriggerButton
          value={instructionValue}
        />
      </div>

      {/* TOOLS */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label>Tools</Label>
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button size={"icon-sm"} variant={"outline"} />}
            >
              <Icon icon={Plus} />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {TOOLS.filter(
                (tool) =>
                  !tools.some(
                    (t: any) => t.type === "native" && t.id === tool.id
                  )
              ).map((tool) => (
                <DropdownMenuItem
                  key={tool.id}
                  onClick={() => handleAddTool(tool.id)}
                >
                  <Icon className="size-3.5" icon={tool.icon} />
                  {tool.name}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {tools.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tools.map((tool: any, index: number) => {
              const nativeTool =
                tool.type === "native"
                  ? TOOLS.find((t) => t.id === tool.id)
                  : null;

              const nativeToolName =
                tool.type === "native" ? nativeTool?.name : tool.name;

              return (
                <Badge key={`${tool.id}-${tool.type}`} variant={"outline"}>
                  {tool?.icon && <Icon className="size-3.5" icon={tool.icon} />}
                  <span className="text-xs">{nativeToolName}</span>
                  <button
                    className="ml-1 hover:text-destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleRemoveTool(index);
                    }}
                    type="button"
                  >
                    <Icon className="size-3" icon={X} />
                  </button>
                </Badge>
              );
            })}
          </div>
        )}
      </div>

      {/* MODELS */}
      <div className="flex items-center justify-between">
        <Label>Model</Label>

        <Popover onOpenChange={setOpenModel} open={openModel}>
          <PopoverTrigger
            render={
              <Button className={"text-xs"} variant={"outline"}>
                {model
                  ? MODELS.find((m) => m.value === model)?.label
                  : "Select Model"}
                <Icon className="size-3.5" icon={ChevronDown} />
              </Button>
            }
          />

          <PopoverContent align="end" className={"p-0"}>
            <Command>
              <CommandInput className="h-8" placeholder="Search model..." />
              <CommandList>
                <CommandEmpty>No model found</CommandEmpty>
                {MODELS.map((m) => (
                  <CommandItem
                    className="justify-between"
                    key={m.value}
                    onSelect={() => {
                      handleChange("model", m.value);
                      setOpenModel(false);
                    }}
                    value={m.value}
                  >
                    {m.label}
                    <Icon
                      className={cn(
                        "ml-auto size-4",
                        model === m.value ? "opacity-100" : "opacity-0"
                      )}
                      icon={Check}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {/* OUTPUT FORMAT */}
      <div className="flex items-center justify-between">
        <Label>Output Format</Label>

        <Popover onOpenChange={setOpenFormat} open={openFormat}>
          <PopoverTrigger
            render={
              <Button className={"text-xs"} variant={"outline"}>
                {outputFormat
                  ? OUTPUT_FORMATS.find((f) => f.value === outputFormat)?.label
                  : "Select Format"}
                <Icon className="size-3.5" icon={ChevronDown} />
              </Button>
            }
          />

          <PopoverContent align="end" className={"p-0"}>
            <Command>
              <CommandList>
                <CommandEmpty>No format found</CommandEmpty>
                {OUTPUT_FORMATS.map((f) => (
                  <CommandItem
                    className="justify-between"
                    key={f.value}
                    onSelect={(value) => {
                      updateNodeData(id, {
                        outputFormat: value,
                        outputs: value === "text" ? ["output.text"] : [],
                        responseSchema: value === "text" ? {} : responseSchema,
                      });
                      setOpenFormat(false);
                    }}
                    value={f.value}
                  >
                    {f.label}
                    <Icon
                      className={cn(
                        "ml-auto size-4",
                        outputFormat === f.value ? "opacity-100" : "opacity-0"
                      )}
                      icon={Check}
                    />
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {outputFormat === "json" && (
        <div className="space-y-2 border-t pt-3">
          <Label>JSON Schema</Label>

          <JsonSchema
            onChange={(schema) => {
              const newOutputs = Object.keys(schema.properties || {}).map(
                (key) => `output.${key}`
              );

              updateNodeData(id, {
                responseSchema: schema,
                outputs: newOutputs,
              });
            }}
            schema={responseSchema}
          />
        </div>
      )}
    </div>
  );
};
