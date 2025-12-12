import * as React from "react";
import { cn } from "@/lib/cn";

export type SectionTitleProps = {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  right?: React.ReactNode;
  className?: string;
};

export function SectionTitle({ title, subtitle, icon, right, className }: SectionTitleProps) {
  return (
    <div className={cn("flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between", className)}>
      <div className="flex items-start gap-3">
        {icon ? (
          <div className="mt-0.5 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            {icon}
          </div>
        ) : null}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-900">{title}</h1>
          {subtitle ? <p className="mt-1 text-sm text-neutral-500">{subtitle}</p> : null}
        </div>
      </div>
      {right ? <div className="flex items-center gap-3">{right}</div> : null}
    </div>
  );
}


