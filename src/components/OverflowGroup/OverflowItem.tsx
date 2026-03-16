import { forwardRef, type HTMLAttributes } from "react";

type OverflowItemProps = HTMLAttributes<HTMLDivElement>;

export const OverflowItem = forwardRef<HTMLDivElement, OverflowItemProps>(function OverflowItem(
  { children, style, ...props },
  ref,
) {
  return (
    <div
      ref={ref}
      style={{
        display: "inline-flex",
        flex: "0 0 auto",
        minWidth: 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
});
