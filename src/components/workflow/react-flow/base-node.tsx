import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

export function BaseNode({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "relative rounded-md border bg-card text-card-foreground",
        "hover:ring-1",
        // React Flow displays node elements inside of a `NodeWrapper`
        // component, which compiles down to a div with the class
        // `react-flow__node`. When a node is selected, the class `selected` is
        // added to the `react-flow__node` element. This allows us to style the
        // node when it is selected.
        "in-[.selected]:border-muted-foreground",
        "in-[.selected]:shadow-lg",
        className
      )}
      // biome-ignore lint/a11y/noNoninteractiveTabindex: The entire node is focusable and interactive, so we need to set the tabindex on the root element to allow for keyboard navigation and accessibility.
      tabIndex={0}
      {...props}
    />
  );
}

/**
 * A container for a consistent header layout intended to be used inside the
 * `<BaseNode />` component.
 */
export function BaseNodeHeader({
  className,
  ...props
}: ComponentProps<"header">) {
  return (
    <header
      {...props}
      className={cn(
        "mx-0 my-0 -mb-1 flex flex-row items-center justify-between gap-2 px-3 py-2",
        // Remove or modify these classes if you modify the padding in the
        // `<BaseNode />` component.
        className
      )}
    />
  );
}

/**
 * The title text for the node. To maintain a native application feel, the title
 * text is not selectable.
 */
export function BaseNodeHeaderTitle({
  className,
  ...props
}: ComponentProps<"h3">) {
  return (
    <h3
      className={cn("user-select-none flex-1 font-semibold", className)}
      data-slot="base-node-title"
      {...props}
    />
  );
}

export function BaseNodeContent({
  className,
  ...props
}: ComponentProps<"div">) {
  return (
    <div
      className={cn("flex flex-col gap-y-2 p-3", className)}
      data-slot="base-node-content"
      {...props}
    />
  );
}

export function BaseNodeFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "flex flex-col items-center gap-y-2 border-t px-3 pt-2 pb-3",
        className
      )}
      data-slot="base-node-footer"
      {...props}
    />
  );
}
