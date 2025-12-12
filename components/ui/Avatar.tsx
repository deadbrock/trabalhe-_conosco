import * as React from "react";
import { cn } from "@/lib/cn";

export type AvatarProps = React.HTMLAttributes<HTMLDivElement> & {
  initials?: string;
};

export function Avatar({ className, initials, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full",
        "bg-neutral-900 text-white text-sm font-semibold shadow-sm",
        className
      )}
      {...props}
    >
      {initials ?? "A"}
    </div>
  );
}


