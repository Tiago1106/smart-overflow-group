import type { ReactNode } from "react";

function getTokenClassName(token: string) {
  if (token === "import" || token === "from") {
    return "text-fuchsia-300";
  }

  if (token.startsWith("'") || token.startsWith('"')) {
    return "text-emerald-300";
  }

  if (token === "maxLines" || token === "gap" || token === "renderOverflow" || token === "key") {
    return "text-amber-300";
  }

  if (token.includes("OverflowGroup") || token.includes("Tag")) {
    return "text-sky-300";
  }

  if (token === "count" || token === "items" || token === "item") {
    return "text-violet-300";
  }

  if (["{", "}", "(", ")", "=>", "<", ">", "/>"].includes(token) || token.startsWith("</")) {
    return "text-zinc-500";
  }

  if (/^\d+$/.test(token)) {
    return "text-orange-300";
  }

  return "text-zinc-100";
}

export function highlightLine(line: string): ReactNode[] {
  const tokenPattern = /(import|from|maxLines|gap|renderOverflow|key|count|items|item|<\/?OverflowGroup|<\/?Tag|=>|\/?>|"[^"]*"|'[^']*'|\d+|[{}()])/g;
  const parts = line.split(tokenPattern);

  return parts.filter(Boolean).map((part, index) => (
    <span className={getTokenClassName(part)} key={`${part}-${index}`}>
      {part}
    </span>
  ));
}
