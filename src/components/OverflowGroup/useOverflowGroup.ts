import {
  isValidElement,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type JSXElementConstructor,
  type ReactNode,
} from "react";
import type { OverflowGroupLayout, UseOverflowGroupOptions, UseOverflowGroupResult } from "./types";

type LineLayout = {
  lastLineWidth: number;
  lineCount: number;
};

function getNodeSignature(node: ReactNode): string {
  if (node == null || typeof node === "boolean") {
    return String(node);
  }

  if (typeof node === "string" || typeof node === "number") {
    return `${typeof node}:${node}`;
  }

  if (Array.isArray(node)) {
    return `[${node.map(getNodeSignature).join(",")}]`;
  }

  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode; className?: string; style?: unknown };
    const componentType = node.type as string | JSXElementConstructor<unknown>;
    const typeName =
      typeof componentType === "string"
        ? componentType
        : ((componentType as { displayName?: string; name?: string }).displayName ??
          (componentType as { displayName?: string; name?: string }).name ??
          "component");
    const className = typeof props.className === "string" ? props.className : "";
    const style = props.style ? JSON.stringify(props.style) : "";

    return `element:${typeName}:key:${String(node.key ?? "")}:class:${className}:style:${style}:children:${getNodeSignature(props.children)}`;
  }

  return typeof node;
}

function isSameLayout(nextLayout: OverflowGroupLayout, currentLayout: OverflowGroupLayout) {
  return (
    nextLayout.hiddenCount === currentLayout.hiddenCount &&
    nextLayout.visibleCount === currentLayout.visibleCount
  );
}

function measureWidth(element: HTMLElement | null) {
  if (!element) {
    return 0;
  }

  return element.getBoundingClientRect().width;
}

function getMaxVisibleCount(widths: number[], containerWidth: number, gap: number, maxLines: number) {
  if (maxLines <= 0 || widths.length === 0) {
    return 0;
  }

  let visibleCount = 0;
  let lineCount = 1;
  let lineWidth = 0;

  for (const width of widths) {
    if (visibleCount === 0 || lineWidth === 0) {
      lineWidth = width;
      visibleCount += 1;
      continue;
    }

    if (lineWidth + gap + width <= containerWidth) {
      lineWidth += gap + width;
      visibleCount += 1;
      continue;
    }

    if (lineCount === maxLines) {
      break;
    }

    lineCount += 1;
    lineWidth = width;
    visibleCount += 1;
  }

  return visibleCount;
}

function getLayoutWithOverflow(
  widths: number[],
  containerWidth: number,
  gap: number,
  maxLines: number,
  overflowWidth: number,
): OverflowGroupLayout {
  const maxVisibleCount = getMaxVisibleCount(widths, containerWidth, gap, maxLines);
  const totalItems = widths.length;

  if (maxVisibleCount >= totalItems) {
    return { hiddenCount: 0, visibleCount: totalItems };
  }

  let visibleCount = maxVisibleCount;

  while (visibleCount >= 0) {
    const hiddenCount = totalItems - visibleCount;
    const { lineCount, lastLineWidth } = getWrappedLayout(widths, visibleCount, gap, containerWidth);

    if (visibleCount === 0) {
      return { hiddenCount, visibleCount: 0 };
    }

    const fitsSameLine = lastLineWidth + gap + overflowWidth <= containerWidth;
    const fitsNextLine = lineCount < maxLines;

    if (fitsSameLine || fitsNextLine) {
      return { hiddenCount, visibleCount };
    }

    visibleCount -= 1;
  }

  return { hiddenCount: totalItems, visibleCount: 0 };
}

function getWrappedLayout(widths: number[], count: number, gap: number, containerWidth: number): LineLayout {
  let lineCount = 0;
  let lineWidth = 0;

  for (let index = 0; index < count; index += 1) {
    const width = widths[index] ?? 0;

    if (lineCount === 0 || lineWidth === 0) {
      lineCount += 1;
      lineWidth = width;
      continue;
    }

    if (lineWidth + gap + width <= containerWidth) {
      lineWidth += gap + width;
      continue;
    }

    lineCount += 1;
    lineWidth = width;
  }

  return { lastLineWidth: lineWidth, lineCount };
}

export function useOverflowGroup({ gap, items, maxLines }: UseOverflowGroupOptions): UseOverflowGroupResult {
  const containerRef = useRef<HTMLDivElement>(null);
  const itemMeasureRefs = useRef<Array<HTMLDivElement | null>>([]);
  const overflowMeasureRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number | null>(null);
  const itemsSignatureRef = useRef("");
  const configSignatureRef = useRef("");
  const lastMeasuredContainerWidthRef = useRef(0);

  const [measureTick, setMeasureTick] = useState(0);
  const [overflowMeasureCount, setOverflowMeasureCount] = useState(0);
  const [isMeasuring, setIsMeasuring] = useState(true);
  const [layout, setLayout] = useState<OverflowGroupLayout>({
    hiddenCount: 0,
    visibleCount: items.length,
  });

  const itemCount = items.length;
  const itemsSignature = items.map((item) => getNodeSignature(item)).join("|");
  const configSignature = `${gap}:${maxLines}`;
  const shouldMeasure = isMeasuring || itemsSignatureRef.current !== itemsSignature;

  useLayoutEffect(() => {
    if (itemsSignatureRef.current === itemsSignature) {
      return;
    }

    itemsSignatureRef.current = itemsSignature;
    itemMeasureRefs.current = [];
    setOverflowMeasureCount(0);
    setIsMeasuring(true);
  }, [itemsSignature]);

  useLayoutEffect(() => {
    if (configSignatureRef.current === configSignature) {
      return;
    }

    configSignatureRef.current = configSignature;
    setOverflowMeasureCount(0);
    setIsMeasuring(true);
  }, [configSignature]);

  useLayoutEffect(() => {
    const currentContainerWidth = measureWidth(containerRef.current);

    if (!currentContainerWidth || isMeasuring) {
      return;
    }

    if (currentContainerWidth !== lastMeasuredContainerWidthRef.current) {
      setOverflowMeasureCount(0);
      setIsMeasuring(true);
    }
  });

  useLayoutEffect(() => {
    const observer = new ResizeObserver(() => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }

      rafRef.current = requestAnimationFrame(() => {
        setIsMeasuring(true);
        setMeasureTick((value) => value + 1);
      });
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    for (const element of itemMeasureRefs.current) {
      if (element) {
        observer.observe(element);
      }
    }

    if (overflowMeasureRef.current) {
      observer.observe(overflowMeasureRef.current);
    }

    return () => {
      observer.disconnect();

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isMeasuring, itemCount, layout.visibleCount, overflowMeasureCount]);

  useLayoutEffect(() => {
    if (!isMeasuring) {
      return;
    }

    const containerWidth = measureWidth(containerRef.current);

    if (!containerWidth || itemCount === 0 || maxLines <= 0) {
      setOverflowMeasureCount(0);

      setLayout((currentLayout) => {
        const nextLayout = { hiddenCount: itemCount, visibleCount: 0 };
        return isSameLayout(nextLayout, currentLayout) ? currentLayout : nextLayout;
      });

      lastMeasuredContainerWidthRef.current = containerWidth;
      setIsMeasuring(false);

      return;
    }

    const itemWidths = itemMeasureRefs.current.slice(0, itemCount).map((element) => measureWidth(element));

    const withoutOverflow = getMaxVisibleCount(itemWidths, containerWidth, gap, maxLines);

    if (withoutOverflow >= itemCount) {
      if (overflowMeasureCount !== 0) {
        setOverflowMeasureCount(0);
        return;
      }

      setLayout((currentLayout) => {
        const nextLayout = { hiddenCount: 0, visibleCount: itemCount };
        return isSameLayout(nextLayout, currentLayout) ? currentLayout : nextLayout;
      });

      lastMeasuredContainerWidthRef.current = containerWidth;
      setIsMeasuring(false);

      return;
    }

    if (overflowMeasureCount !== itemCount) {
      setOverflowMeasureCount(itemCount);
      return;
    }

    const overflowWidth = measureWidth(overflowMeasureRef.current);

    if (!overflowWidth) {
      return;
    }

    const nextLayout = getLayoutWithOverflow(
      itemWidths,
      containerWidth,
      gap,
      maxLines,
      overflowWidth,
    );

    setLayout((currentLayout) => (isSameLayout(nextLayout, currentLayout) ? currentLayout : nextLayout));
    lastMeasuredContainerWidthRef.current = containerWidth;
    setIsMeasuring(false);
  }, [gap, isMeasuring, itemCount, maxLines, measureTick, overflowMeasureCount]);

  const getItemMeasureRef = useMemo(
    () =>
      (index: number) =>
      (node: HTMLDivElement | null) => {
        itemMeasureRefs.current[index] = node;
      },
    [],
  );

  return {
    containerRef,
    getItemMeasureRef,
    hiddenCount: layout.hiddenCount,
    isMeasuring,
    overflowMeasureCount,
    overflowMeasureRef,
    shouldMeasure,
    visibleCount: layout.visibleCount,
  };
}
