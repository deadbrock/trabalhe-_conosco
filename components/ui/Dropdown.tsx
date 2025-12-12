import * as React from "react";
import { cn } from "@/lib/cn";

export type DropdownProps = React.HTMLAttributes<HTMLDivElement> & {
  open: boolean;
};

/**
 * Dropdown (visual) — animação fade+slide.
 * Observação: controle de abertura/fechamento fica no componente pai (state).
 */
export function Dropdown({ open, className, ...props }: DropdownProps) {
  if (!open) return null;
  return (
    <div
      className={cn(
        "rounded-lg border border-neutral-200 bg-white/85 backdrop-blur-md shadow-lg",
        "animate-[dropdownIn_180ms_ease-out]",
        className
      )}
      {...props}
    />
  );
}


