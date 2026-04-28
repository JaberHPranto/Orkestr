import { HugeiconsIcon } from "@hugeicons/react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type IconProps = ComponentProps<typeof HugeiconsIcon>;

export const Icon = ({ className, ...props }: IconProps) => (
  <HugeiconsIcon className={cn("size-4", className)} {...props} />
);
