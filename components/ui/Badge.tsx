import * as React from "react";
import { cn } from "@/lib/cn";

type BadgeTone = "neutral" | "primary" | "secondary" | "success" | "warning" | "error";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & {
  tone?: BadgeTone;
};

const toneMap: Record<BadgeTone, string> = {
  neutral: "bg-neutral-100 text-neutral-700",
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  success: "bg-success/10 text-success",
  warning: "bg-warning/15 text-neutral-900",
  error: "bg-error/10 text-error",
};

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold",
        toneMap[tone],
        className
      )}
      {...props}
    />
  );
}


