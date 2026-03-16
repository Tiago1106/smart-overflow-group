import { useEffect, useMemo, useRef, useState } from "react";
import packageJson from "../package.json";
import { CodeBlock } from "./components/demo/CodeBlock";
import { SegmentButton } from "./components/demo/SegmentButton";
import { Tag } from "./components/demo/Tag";
import { OverflowGroup } from "./components/OverflowGroup";
import { cn } from "./utils/cn";
import { createOverflowGroupSnippet } from "./utils/code-snippet";
import { extendedItems, widthOptions } from "./utils/demo-data";
export default function App() {
  const [containerWidth, setContainerWidth] = useState(360);
  const [maxLines, setMaxLines] = useState(2);
  const [gap, setGap] = useState(8);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const toastTimeoutRef = useRef<number | null>(null);
  const previewLoadingTimeoutRef = useRef<number | null>(null);

  const items = useMemo(() => extendedItems, []);
  const codeSnippet = useMemo(
    () =>
      createOverflowGroupSnippet({
        gap,
        maxLines,
        packageName: packageJson.name,
      }),
    [gap, maxLines],
  );

  useEffect(() => {
    return () => {
      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }

      if (previewLoadingTimeoutRef.current !== null) {
        window.clearTimeout(previewLoadingTimeoutRef.current);
      }
    };
  }, []);

  function runPreviewUpdate(update: () => void) {
    setIsPreviewLoading(true);
    update();

    if (previewLoadingTimeoutRef.current !== null) {
      window.clearTimeout(previewLoadingTimeoutRef.current);
    }

    previewLoadingTimeoutRef.current = window.setTimeout(() => {
      setIsPreviewLoading(false);
      previewLoadingTimeoutRef.current = null;
    }, 220);
  }

  async function handleCopyCode() {
    try {
      await navigator.clipboard.writeText(codeSnippet);
      setShowToast(true);

      if (toastTimeoutRef.current !== null) {
        window.clearTimeout(toastTimeoutRef.current);
      }

      toastTimeoutRef.current = window.setTimeout(() => {
        setShowToast(false);
        toastTimeoutRef.current = null;
      }, 1800);
    } catch {
      setShowToast(false);
    }
  }

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.05),transparent_24%),linear-gradient(180deg,#0d0d0f_0%,#09090b_100%)] px-4 pb-[210px] pt-6 text-neutral-100 md:pb-[170px]">
      <div
        className={cn(
          "pointer-events-none fixed left-1/2 z-50 -translate-x-1/2 rounded-xl border border-emerald-400/20 bg-[#17181b] px-4 py-2 text-sm text-emerald-300 shadow-[0_16px_40px_rgba(0,0,0,0.35)] transition-all duration-200",
          showToast ? "top-6 opacity-100" : "top-4 opacity-0",
        )}
        role="status"
      >
        Codigo copiado
      </div>

      <section className="mx-auto flex min-h-[calc(100vh-240px)] w-full max-w-[760px] flex-col justify-center gap-[18px] md:min-h-[calc(100vh-200px)]">
        <div className="grid gap-3">
          <div className="relative grid min-h-[320px] place-items-center rounded-[20px] border border-white/6 bg-[linear-gradient(180deg,#141417_0%,#101013_100%)] px-6 py-12 shadow-[0_24px_60px_rgba(0,0,0,0.28)]">
            <button
              aria-label="Show implementation example"
              className="absolute bottom-4 right-4 inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-[#1a1a1d] text-zinc-300 transition-colors duration-150 hover:bg-[#232327] hover:text-white"
              onClick={() => setShowCode((value) => !value)}
              title="Show implementation"
              type="button"
            >
              <svg aria-hidden="true" className="h-[18px] w-[18px]" fill="none" viewBox="0 0 24 24">
                <path
                  d="M8 9 4.5 12 8 15.5M16 9l3.5 3-3.5 3.5M13.5 6l-3 12"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                />
              </svg>
            </button>

            <div
              className="relative max-w-full rounded-2xl border border-white/7 bg-[#0b0b0d] p-4 transition-[width] duration-150"
              style={{ width: containerWidth }}
            >
              <div
                className={cn(
                  "pointer-events-none absolute inset-0 z-10 rounded-2xl bg-[#0b0b0d]/88 backdrop-blur-[2px] transition-opacity duration-150",
                  isPreviewLoading ? "opacity-100" : "opacity-0",
                )}
              />

              <OverflowGroup maxLines={maxLines} gap={gap} renderOverflow={(count) => <Tag>+{count}</Tag>}>
                {items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </OverflowGroup>
            </div>
          </div>

          <div
            className={cn(
              "grid overflow-hidden transition-all duration-300 ease-out",
              showCode ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0",
            )}
          >
            <div className="min-h-0">
              <div className="overflow-hidden rounded-[22px] border border-white/8 bg-[#121214] shadow-[0_18px_40px_rgba(0,0,0,0.3)]">
                <div className="flex items-center justify-between border-b border-white/6 bg-[#1a1a1d] px-4 py-3">
                  <div className="flex items-center gap-2" aria-hidden="true">
                    <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
                    <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
                  </div>

                  <span className="text-xs text-zinc-400">OverflowGroup.tsx</span>

                  <div className="flex items-center gap-2">
                    <button
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-[#232327] px-3 text-xs text-zinc-300 transition-colors hover:bg-[#2c2c31] hover:text-white"
                      onClick={() => void handleCopyCode()}
                      type="button"
                    >
                      Copy
                    </button>

                    <button
                      className="inline-flex h-8 items-center justify-center rounded-lg bg-[#232327] px-3 text-xs text-zinc-300 transition-colors hover:bg-[#2c2c31] hover:text-white"
                      onClick={() => setShowCode(false)}
                      type="button"
                    >
                      Hide
                    </button>
                  </div>
                </div>

                <CodeBlock code={codeSnippet} />
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-[0.78rem] text-zinc-500">v{packageJson.version}</p>
      </section>

      <div className="fixed inset-x-4 bottom-4 z-40 md:left-1/2 md:w-[760px] md:-translate-x-1/2">
        <div className="grid items-center gap-[18px] rounded-[18px] border border-white/8 bg-[#171718]/95 px-5 py-[18px] shadow-[0_14px_32px_rgba(0,0,0,0.22)] backdrop-blur-xl md:grid-cols-[auto_auto_auto]">
          <div className="grid min-w-max gap-2.5 max-md:min-w-0">
            <span className="text-[0.8rem] text-zinc-400">Width</span>
            <div className="inline-flex flex-wrap gap-1.5" role="group" aria-label="Width value">
              {widthOptions.map((width) => (
                <SegmentButton
                  active={width === containerWidth}
                  key={width}
                  onClick={() => runPreviewUpdate(() => setContainerWidth(width))}
                >
                  {width}
                </SegmentButton>
              ))}
            </div>
          </div>

          <div className="grid min-w-max gap-2.5 max-md:min-w-0">
            <span className="text-[0.8rem] text-zinc-400">Lines</span>
            <div className="inline-flex flex-wrap gap-1.5" role="group" aria-label="Max lines">
              {[1, 2, 3, 4].map((lineCount) => (
                <SegmentButton
                  active={lineCount === maxLines}
                  key={lineCount}
                  onClick={() => runPreviewUpdate(() => setMaxLines(lineCount))}
                >
                  {lineCount}
                </SegmentButton>
              ))}
            </div>
          </div>

          <div className="grid min-w-max gap-2.5 max-md:min-w-0">
            <span className="text-[0.8rem] text-zinc-400">Gap</span>
            <div className="inline-flex flex-wrap gap-1.5" role="group" aria-label="Gap value">
              {[4, 8, 12, 16].map((gapValue) => (
                <SegmentButton
                  active={gapValue === gap}
                  key={gapValue}
                  onClick={() => runPreviewUpdate(() => setGap(gapValue))}
                >
                  {gapValue}
                </SegmentButton>
              ))}
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
