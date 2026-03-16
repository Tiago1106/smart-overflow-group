import type { HTMLAttributes, ReactNode } from "react";
export type OverflowGroupProps = HTMLAttributes<HTMLDivElement> & {
    children: ReactNode;
    maxLines?: number;
    gap?: number;
    renderOverflow?: (hiddenCount: number) => ReactNode;
};
export type OverflowGroupLayout = {
    hiddenCount: number;
    visibleCount: number;
};
export type UseOverflowGroupOptions = {
    gap: number;
    items: ReactNode[];
    maxLines: number;
};
export type UseOverflowGroupResult = {
    containerRef: React.RefObject<HTMLDivElement | null>;
    getItemMeasureRef: (index: number) => (node: HTMLDivElement | null) => void;
    hiddenCount: number;
    isMeasuring: boolean;
    overflowMeasureCount: number;
    overflowMeasureRef: React.RefObject<HTMLDivElement | null>;
    shouldMeasure: boolean;
    visibleCount: number;
};
