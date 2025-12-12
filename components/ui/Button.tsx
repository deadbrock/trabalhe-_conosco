import * as React from "react";
import { cn } from "@/lib/cn";

type ButtonVariant = "solid" | "outline" | "ghost";
type ButtonTone = "primary" | "secondary" | "neutral" | "danger";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  /**
   * Gradiente premium (apenas para variante solid).
   * Inspirado em SaaS (Linear/Notion/Deel) com microinterações.
   */
  gradient?: boolean;
};

const base =
  "inline-flex items-center justify-center gap-2 select-none whitespace-nowrap " +
  "rounded-lg px-4 h-12 text-sm font-semibold " +
  "transition duration-180 ease-out " +
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 " +
  "disabled:opacity-60 disabled:pointer-events-none";

function solidClasses(tone: ButtonTone, gradient: boolean) {
  if (gradient && tone === "primary") {
    return (
      "text-white bg-premium-gradient shadow-md " +
      "hover:shadow-lg hover:brightness-[1.02] active:brightness-[0.98] " +
      "hover:-translate-y-0.5 active:translate-y-0 " +
      "hover:ring-2 hover:ring-primary/20"
    );
  }

  switch (tone) {
    case "secondary":
      return "bg-secondary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0";
    case "danger":
      return "bg-error text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0";
    case "neutral":
      return "bg-neutral-900 text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0";
    case "primary":
    default:
      return "bg-primary text-white shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0";
  }
}

function outlineClasses(tone: ButtonTone) {
  switch (tone) {
    case "secondary":
      return "border border-secondary text-secondary hover:bg-secondary/5";
    case "danger":
      return "border border-error text-error hover:bg-error/5";
    case "neutral":
      return "border border-neutral-300 text-neutral-800 hover:bg-neutral-50";
    case "primary":
    default:
      return "border border-primary text-primary hover:bg-primary/5";
  }
}

function ghostClasses(tone: ButtonTone) {
  switch (tone) {
    case "secondary":
      return "text-secondary hover:bg-secondary/10";
    case "danger":
      return "text-error hover:bg-error/10";
    case "neutral":
      return "text-neutral-800 hover:bg-neutral-100";
    case "primary":
    default:
      return "text-primary hover:bg-primary/10";
  }
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { className, variant = "solid", tone = "primary", gradient = false, type, ...props },
  ref
) {
  const variantCls =
    variant === "solid"
      ? solidClasses(tone, gradient)
      : variant === "outline"
        ? outlineClasses(tone)
        : ghostClasses(tone);

  return (
    <button ref={ref} type={type ?? "button"} className={cn(base, variantCls, className)} {...props} />
  );
});


