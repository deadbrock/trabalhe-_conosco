import * as React from "react";
import { cn } from "@/lib/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
};

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  { className, leftIcon, ...props },
  ref
) {
  return (
    <div className={cn("relative", className)}>
      {leftIcon ? (
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500">
          {leftIcon}
        </div>
      ) : null}
      <input
        ref={ref}
        className={cn(
          "h-12 w-full rounded-lg border border-neutral-200 bg-white px-4 text-sm text-neutral-900",
          "placeholder:text-neutral-400",
          "transition duration-180 ease-out",
          "focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/40",
          leftIcon ? "pl-11" : ""
        )}
        {...props}
      />
    </div>
  );
});


