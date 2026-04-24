import { Copy, File02Icon } from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { Icon } from "@/components/icon";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "@/components/ui/input-group";

interface Props {
  nodeId: string;
}

export const StartNodeSettings = ({ nodeId }: Props) => {
  const inputVariables = `${nodeId}-input`;

  const onCopy = () => {
    navigator.clipboard.writeText(`{{${inputVariables}}}`);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="space-y-2">
      <h5 className="font-medium"> Input Variables</h5>
      <InputGroup className="border-0!">
        <InputGroupAddon align={"inline-start"}>
          <Icon className="mr-1.5 size-4 text-primary" icon={File02Icon} />
        </InputGroupAddon>

        <code className="flex-1 bg-background px-2 py-1 font-mono">
          {`{{${inputVariables}}}`}
        </code>

        <InputGroupButton
          className={"h-6"}
          onClick={onCopy}
          size={"icon-sm"}
          variant={"ghost"}
        >
          <Icon className="size-4" icon={Copy} />
        </InputGroupButton>
      </InputGroup>
    </div>
  );
};
