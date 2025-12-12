import * as React from "react";
import { cn } from "@/lib/cn";

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select({ className, ...props }, ref) {
  return (
    <select
      ref={ref}
      className={cn(
        "h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900",
        "transition duration-180 ease-out",
        "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
        className
      )}
      {...props}
    />
  );
});


