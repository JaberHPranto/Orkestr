/* eslint-disable @typescript-eslint/no-explicit-any */
/** biome-ignore-all lint/suspicious/noExplicitAny: Allow explicit any for schema handling */

import { Plus, X } from "@hugeicons/core-free-icons";
import { useState } from "react";
import { Icon } from "@/components/icon";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputList,
} from "@/components/ui/tags-input";
import { Textarea } from "@/components/ui/textarea";

interface JsonSchemaProps {
  onChange: (schema: any) => void;
  schema: any;
}

const SchemaType = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  ENUM: "enum",
} as const;

export function JsonSchema({ schema, onChange }: JsonSchemaProps) {
  const properties = schema?.properties || {};

  const [fields, setFields] = useState(
    Object.entries(properties).map(([name, config]: [string, any]) => ({
      name,
      type: config.enum ? "enum" : config.type,
      description: config.description || "",
      enumValues: config.enum?.join(", ") || "",
    }))
  );

  const getDefaultValue = (fieldType: string): any => {
    if (fieldType === "number") {
      return 0;
    }
    if (fieldType === "boolean") {
      return false;
    }
    return "";
  };

  const updateSchema = (newFields: any[]) => {
    const props: any = {};
    for (const f of newFields) {
      if (!f.name) {
        continue;
      }
      const field: any = {
        type: f.type === "enum" ? "string" : f.type,
        description: f.description || undefined,
        default: getDefaultValue(f.type),
      };
      if (f.type === "enum" && f.enumValues) {
        field.enum = f.enumValues
          .split(",")
          .map((v: string) => v.trim())
          .filter(Boolean);
      }
      props[f.name] = field;
    }
    onChange({
      type: "object",
      title: "response_schema",
      properties: props,
    });
  };

  const addField = () => {
    const newFields = [
      ...fields,
      { name: "", type: "string", description: "", enumValues: "" },
    ];
    setFields(newFields);
  };

  const updateField = (index: number, key: string, value: string) => {
    const newFields = [...fields];
    newFields[index] = { ...newFields[index], [key]: value };
    setFields(newFields);
    updateSchema(newFields);
  };

  const removeField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
    updateSchema(newFields);
  };

  return (
    <div className="space-y-3">
      {fields.map((field, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key since fields can be added/removed but not reordered, and it simplifies state management.
        <Card className="px-3 pt-3" key={i}>
          <div>
            <div className="flex gap-1">
              <div className="flex-1 space-y-1.5">
                <Label className="text-xs">Name</Label>
                <Input
                  className="h-8 text-sm"
                  onChange={(e) => updateField(i, "name", e.target.value)}
                  placeholder="field_name"
                  value={field.name}
                />
              </div>
              <div className="shrink-0 space-y-1.5">
                <Label className="text-xs">Type</Label>
                <Select
                  onValueChange={(v) => updateField(i, "type", v)}
                  value={field.type}
                >
                  <SelectTrigger className="h-8! py-0! text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={SchemaType.STRING}>String</SelectItem>
                    <SelectItem value={SchemaType.NUMBER}>Number</SelectItem>
                    <SelectItem value={SchemaType.BOOLEAN}>Boolean</SelectItem>
                    <SelectItem value={SchemaType.ENUM}>Enum</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1 space-y-1.5">
                <Label className="text-xs">Description</Label>
                <Textarea
                  className="h-8 max-w-32 text-xs"
                  onChange={(e) =>
                    updateField(i, "description", e.target.value)
                  }
                  placeholder="Optional description"
                  rows={2}
                  value={field.description}
                />
              </div>
              <Button
                className="mt-5 h-4 w-4"
                onClick={() => removeField(i)}
                size="icon-sm"
                type="button"
                variant="ghost"
              >
                <Icon className="size-4" icon={X} />
              </Button>
            </div>
            {field.type === SchemaType.ENUM && (
              <div className="space-y-2">
                <Label className="text-xs">Enum Values</Label>
                <TagsInput
                  onValueChange={(values: any) =>
                    updateField(i, "enumValues", values.join(", "))
                  }
                  value={field.enumValues
                    .split(",")
                    .map((v: string) => v.trim())
                    .filter(Boolean)}
                >
                  <TagsInputList>
                    {field.enumValues
                      .split(",")
                      .map((v: string) => v.trim())
                      .filter(Boolean)
                      .map((value: string) => (
                        <TagsInputItem
                          className="rounded-full bg-muted text-xs"
                          key={value}
                          value={value}
                        >
                          {value}
                        </TagsInputItem>
                      ))}
                    <TagsInputInput placeholder="Type value and press enter..." />
                  </TagsInputList>
                </TagsInput>
              </div>
            )}
          </div>
        </Card>
      ))}

      <Button
        className="w-full"
        onClick={addField}
        type="button"
        variant="outline"
      >
        <Icon className="mr-2 h-4 w-4" icon={Plus} />
        Add Field
      </Button>
    </div>
  );
}
