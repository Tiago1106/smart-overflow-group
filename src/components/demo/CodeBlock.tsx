import { highlightLine } from "../../utils/code-highlight";
import { cn } from "../../utils/cn";

type CodeBlockProps = {
  code: string;
};

export function CodeBlock({ code }: CodeBlockProps) {
  const lines = code.split("\n");

  return (
    <pre
      className={cn(
        "overflow-x-auto p-5 text-sm leading-7",
        "bg-[linear-gradient(180deg,#151519_0%,#101013_100%)]",
      )}
    >
      <code>
        {lines.map((line, index) => (
          <div key={`${line}-${index}`} className={cn("whitespace-pre") }>
            {highlightLine(line)}
          </div>
        ))}
      </code>
    </pre>
  );
}
