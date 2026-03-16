import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type TagProps = {
  children: ReactNode;
};

export function Tag({ children }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex min-h-[30px] items-center whitespace-nowrap rounded-full px-2.5 text-sm",
        "border border-white/8 bg-[#1a1a1d] text-neutral-100",
      )}
    >
      {children}
    </span>
  );
}
