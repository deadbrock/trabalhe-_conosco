import * as React from "react";
import { cn } from "@/lib/cn";

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { className, ...props },
  ref
) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-lg border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-900",
        "placeholder:text-neutral-400",
        "transition duration-180 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
        className
      )}
      {...props}
    />
  );
});


