import { Children, isValidElement } from "react";
import { OverflowItem } from "./OverflowItem";
import type { OverflowGroupProps } from "./types";
import { useOverflowGroup } from "./useOverflowGroup";

const defaultRenderOverflow = (hiddenCount: number) => <span>+{hiddenCount}</span>;

export function OverflowGroup({
  children,
  className,
  gap = 8,
  maxLines = 1,
  renderOverflow = defaultRenderOverflow,
  style,
  ...props
}: OverflowGroupProps) {
  const items = Children.toArray(children);
  const {
    containerRef,
    getItemMeasureRef,
    hiddenCount,
    isMeasuring,
    overflowMeasureCount,
    overflowMeasureRef,
    shouldMeasure,
    visibleCount,
  } = useOverflowGroup({ gap, items, maxLines });

  const renderedItems = shouldMeasure ? items : items.slice(0, visibleCount);
  const overflowContent = hiddenCount > 0 || shouldMeasure ? renderOverflow(Math.max(overflowMeasureCount, hiddenCount)) : null;
  const measurementContainerStyle = {
    height: 0,
    left: 0,
    overflow: "hidden",
    pointerEvents: "none" as const,
    position: "absolute" as const,
    top: 0,
    visibility: "hidden" as const,
    whiteSpace: "nowrap" as const,
  };
  const wrapperStyle = {
    alignItems: "flex-start" as const,
    display: "flex" as const,
    flexWrap: "wrap" as const,
    gap,
    visibility: shouldMeasure ? ("hidden" as const) : undefined,
    ...style,
  };

  function getItemKey(item: (typeof items)[number], index: number) {
    if (isValidElement(item) && item.key != null) {
      return item.key;
    }

    return index;
  }

  return (
    <>
      <div ref={containerRef} className={className} style={wrapperStyle} {...props}>
        {renderedItems.map((item, index) => (
          <OverflowItem key={getItemKey(item, index)} ref={getItemMeasureRef(index)}>
            {item}
          </OverflowItem>
        ))}

        {!shouldMeasure && hiddenCount > 0 ? (
          <OverflowItem aria-label={`${hiddenCount} more items`}>{overflowContent}</OverflowItem>
        ) : null}
      </div>

      <div aria-hidden="true" style={measurementContainerStyle}>
        {shouldMeasure && overflowMeasureCount > 0 ? (
          <OverflowItem ref={overflowMeasureRef}>{overflowContent}</OverflowItem>
        ) : null}
      </div>
    </>
  );
}
