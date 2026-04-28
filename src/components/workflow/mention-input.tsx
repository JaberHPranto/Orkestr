import { FileBracesIcon } from "@hugeicons/core-free-icons";
import { useMemo, useState } from "react";
import {
  Mention,
  MentionsInput,
  type MentionsInputStyle,
} from "react-mentions";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useWorkflowContext } from "@/context/workflow-context";
import { cn } from "@/lib/utils";
import { Icon } from "../icon";
import { Button } from "../ui/button";
import { Command, CommandInput, CommandItem, CommandList } from "../ui/command";

interface Props {
  className?: string;
  multiline?: boolean;
  nodeId: string;
  onBlur?: () => void;
  onChange: (value: string) => void;
  placeholder?: string;
  showTriggerButton?: boolean;
  value: string;
}

interface Suggestion {
  display: string;
  id: string;
}

export const MentionInput = ({
  value,
  placeholder,
  className,
  multiline,
  showTriggerButton,
  onChange,
  onBlur,
  nodeId,
}: Props) => {
  const { getNodeSuggestions } = useWorkflowContext();

  const [open, setOpen] = useState(false);

  const suggestions: Suggestion[] = useMemo(() => {
    if (!nodeId) {
      return [];
    }

    const nodeSuggestions = getNodeSuggestions(nodeId);
    return nodeSuggestions.flatMap((node) =>
      node.outputs.map((output: string) => ({
        id: `${node.id}.${output}`,
        display: `${node.label.toLowerCase()?.replace(/ /g, "_")}.${output}`,
      }))
    );
  }, [nodeId, getNodeSuggestions]);

  const mentionsStyle: MentionsInputStyle = {
    control: {
      backgroundColor: "#2F2F2F",
      fontSize: 14,
      lineHeight: "20px",
      fontFamily: "inherit",
      border: "none",
    },

    highlighter: {
      padding: "8px",
      minHeight: multiline ? 120 : 32,
      maxHeight: multiline ? 200 : undefined,
      overflowY: multiline ? "auto" : "hidden",
      boxSizing: "border-box",
      whiteSpace: multiline ? "pre-wrap" : "nowrap",
      wordWrap: multiline ? "break-word" : "normal",
      fontSize: 14,
      lineHeight: "20px",
      fontFamily: "inherit",
    },

    input: {
      padding: "8px",
      height: multiline ? undefined : 32,
      minHeight: multiline ? 120 : 32,
      overflowY: multiline ? "auto" : "hidden",
      boxSizing: "border-box",
      border: "none",
      outline: "none",
      resize: multiline ? "none" : undefined,
      backgroundColor: "transparent",
      color: "inherit",
      whiteSpace: multiline ? "pre-wrap" : "nowrap",
      wordWrap: multiline ? "break-word" : "normal",
      fontSize: 14,
      lineHeight: "20px",
      fontFamily: "inherit",
    },
  };

  return (
    <div
      className={cn(
        "relative w-full rounded-md border border-input bg-background text-foreground text-sm",
        className
      )}
    >
      <MentionsInput
        customSuggestionsContainer={(children) => (
          <div className="fixed z-999! min-w-64 max-w-2xl rounded-lg border bg-popover shadow-lg">
            <Command>
              <CommandList className="max-h-64 overflow-y-auto">
                {children}
              </CommandList>
            </Command>
          </div>
        )}
        onBlur={onBlur}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        singleLine={!multiline}
        spellCheck={false}
        style={mentionsStyle}
        value={value}
      >
        <Mention
          appendSpaceOnAdd
          className="bg-primary/20!"
          data={suggestions ?? []}
          displayTransform={(id) => `{{${id}}}`}
          markup="{{__id__}}"
          renderSuggestion={(
            entry,
            _search,
            _highlightedDisplay,
            _index,
            focused
          ) => (
            <CommandItem
              className={cn(
                "flex justify-between text-sm",
                focused && "bg-accent text-accent-foreground"
              )}
              value={entry.display}
            >
              <div className="flex flex-1 items-start gap-2">
                <span>{entry.display}</span>
              </div>
            </CommandItem>
          )}
          trigger="{{"
        />
      </MentionsInput>

      {showTriggerButton && (
        <Popover onOpenChange={setOpen} open={open}>
          <PopoverTrigger
            render={
              <Button
                className={cn(
                  "absolute h-6 w-6",
                  multiline
                    ? "right-2 bottom-2"
                    : "top-1/2 right-2 -translate-y-1/2"
                )}
                size="icon-sm"
                type="button"
                variant="ghost"
              />
            }
          >
            <Icon className="size-3.5" icon={FileBracesIcon} />
          </PopoverTrigger>
          <PopoverContent
            align="end"
            className={"z-50 min-w-64 max-w-2xl p-0"}
            side="bottom"
            sideOffset={6}
          >
            <Command>
              <CommandInput placeholder="Type to search variables..." />
              <CommandList className="max-h-64 overflow-y-auto">
                {suggestions.map((suggestion) => (
                  <CommandItem
                    className="text-sm"
                    key={suggestion.id}
                    onSelect={() => {
                      onChange(`${value}{{${suggestion.id}}}}`);
                      setOpen(false);
                    }}
                    value={suggestion.display}
                  >
                    <div className="flex flex-1 items-start gap-2">
                      <span>{suggestion.display}</span>
                    </div>
                  </CommandItem>
                ))}
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
};
