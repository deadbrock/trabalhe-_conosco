import * as React from "react";
import { cn } from "@/lib/cn";

export function TableContainer({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("rounded-lg border border-neutral-200 bg-white shadow-md overflow-hidden", className)}
      {...props}
    />
  );
}

export function Table({ className, ...props }: React.TableHTMLAttributes<HTMLTableElement>) {
  return <table className={cn("w-full border-collapse", className)} {...props} />;
}

export function THead({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn("sticky top-0 bg-neutral-50", className)} {...props} />;
}

export function TH({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "h-16 px-6 text-left text-xs font-semibold uppercase tracking-wide text-neutral-500",
        "border-b border-neutral-200",
        className
      )}
      {...props}
    />
  );
}

export function TR({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn("border-b border-neutral-100 hover:bg-neutral-50 transition duration-180 ease-out", className)} {...props} />;
}

export function TD({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn("h-16 px-6 text-sm text-neutral-800 align-middle", className)} {...props} />;
}


