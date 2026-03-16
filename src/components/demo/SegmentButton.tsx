import type { ReactNode } from "react";
import { cn } from "../../utils/cn";

type SegmentButtonProps = {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
};

export function SegmentButton({ active, children, onClick }: SegmentButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex min-w-10 items-center justify-center rounded-[10px] px-3 py-2 text-sm",
        active ? "bg-[#2d2d31] text-white" : "bg-[#202024] text-[#c7c7cc]",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
