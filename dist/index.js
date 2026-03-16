import { jsx as I, jsxs as F, Fragment as z } from "react/jsx-runtime";
import { forwardRef as B, useRef as w, useState as N, useLayoutEffect as $, useMemo as J, isValidElement as G, Children as K } from "react";
const A = B(function({ children: n, style: t, ...s }, i) {
  return /* @__PURE__ */ I(
    "div",
    {
      ref: i,
      style: {
        display: "inline-flex",
        flex: "0 0 auto",
        minWidth: 0,
        ...t
      },
      ...s,
      children: n
    }
  );
});
function E(e) {
  if (e == null || typeof e == "boolean")
    return String(e);
  if (typeof e == "string" || typeof e == "number")
    return `${typeof e}:${e}`;
  if (Array.isArray(e))
    return `[${e.map(E).join(",")}]`;
  if (G(e)) {
    const n = e.props, t = e.type, s = typeof t == "string" ? t : t.displayName ?? t.name ?? "component", i = typeof n.className == "string" ? n.className : "", u = n.style ? JSON.stringify(n.style) : "";
    return `element:${s}:key:${String(e.key ?? "")}:class:${i}:style:${u}:children:${E(n.children)}`;
  }
  return typeof e;
}
function j(e, n) {
  return e.hiddenCount === n.hiddenCount && e.visibleCount === n.visibleCount;
}
function k(e) {
  return e ? e.getBoundingClientRect().width : 0;
}
function q(e, n, t, s) {
  if (s <= 0 || e.length === 0)
    return 0;
  let i = 0, u = 1, o = 0;
  for (const r of e) {
    if (i === 0 || o === 0) {
      o = r, i += 1;
      continue;
    }
    if (o + t + r <= n) {
      o += t + r, i += 1;
      continue;
    }
    if (u === s)
      break;
    u += 1, o = r, i += 1;
  }
  return i;
}
function L(e, n, t, s, i) {
  const u = q(e, n, t, s), o = e.length;
  if (u >= o)
    return { hiddenCount: 0, visibleCount: o };
  let r = u;
  for (; r >= 0; ) {
    const b = o - r, { lineCount: m, lastLineWidth: C } = D(e, r, t, n);
    if (r === 0)
      return { hiddenCount: b, visibleCount: 0 };
    const x = C + t + i <= n, a = m < s;
    if (x || a)
      return { hiddenCount: b, visibleCount: r };
    r -= 1;
  }
  return { hiddenCount: o, visibleCount: 0 };
}
function D(e, n, t, s) {
  let i = 0, u = 0;
  for (let o = 0; o < n; o += 1) {
    const r = e[o] ?? 0;
    if (i === 0 || u === 0) {
      i += 1, u = r;
      continue;
    }
    if (u + t + r <= s) {
      u += t + r;
      continue;
    }
    i += 1, u = r;
  }
  return { lastLineWidth: u, lineCount: i };
}
function H({ gap: e, items: n, maxLines: t }) {
  const s = w(null), i = w([]), u = w(null), o = w(null), r = w(""), b = w(""), m = w(0), [C, x] = N(0), [a, y] = N(0), [c, h] = N(!0), [S, g] = N({
    hiddenCount: 0,
    visibleCount: n.length
  }), f = n.length, M = n.map((l) => E(l)).join("|"), W = `${e}:${t}`, p = c || r.current !== M;
  $(() => {
    r.current !== M && (r.current = M, i.current = [], y(0), h(!0));
  }, [M]), $(() => {
    b.current !== W && (b.current = W, y(0), h(!0));
  }, [W]), $(() => {
    const l = k(s.current);
    !l || c || l !== m.current && (y(0), h(!0));
  }), $(() => {
    const l = new ResizeObserver(() => {
      o.current !== null && cancelAnimationFrame(o.current), o.current = requestAnimationFrame(() => {
        h(!0), x((v) => v + 1);
      });
    });
    s.current && l.observe(s.current);
    for (const v of i.current)
      v && l.observe(v);
    return u.current && l.observe(u.current), () => {
      l.disconnect(), o.current !== null && cancelAnimationFrame(o.current);
    };
  }, [c, f, S.visibleCount, a]), $(() => {
    if (!c)
      return;
    const l = k(s.current);
    if (!l || f === 0 || t <= 0) {
      y(0), g((d) => {
        const O = { hiddenCount: f, visibleCount: 0 };
        return j(O, d) ? d : O;
      }), m.current = l, h(!1);
      return;
    }
    const v = i.current.slice(0, f).map((d) => k(d));
    if (q(v, l, e, t) >= f) {
      if (a !== 0) {
        y(0);
        return;
      }
      g((d) => {
        const O = { hiddenCount: 0, visibleCount: f };
        return j(O, d) ? d : O;
      }), m.current = l, h(!1);
      return;
    }
    if (a !== f) {
      y(f);
      return;
    }
    const T = k(u.current);
    if (!T)
      return;
    const V = L(
      v,
      l,
      e,
      t,
      T
    );
    g((d) => j(V, d) ? d : V), m.current = l, h(!1);
  }, [e, c, f, t, C, a]);
  const R = J(
    () => (l) => (v) => {
      i.current[l] = v;
    },
    []
  );
  return {
    containerRef: s,
    getItemMeasureRef: R,
    hiddenCount: S.hiddenCount,
    isMeasuring: c,
    overflowMeasureCount: a,
    overflowMeasureRef: u,
    shouldMeasure: p,
    visibleCount: S.visibleCount
  };
}
const P = (e) => /* @__PURE__ */ F("span", { children: [
  "+",
  e
] });
function Y({
  children: e,
  className: n,
  gap: t = 8,
  maxLines: s = 1,
  renderOverflow: i = P,
  style: u,
  ...o
}) {
  const r = K.toArray(e), {
    containerRef: b,
    getItemMeasureRef: m,
    hiddenCount: C,
    isMeasuring: x,
    overflowMeasureCount: a,
    overflowMeasureRef: y,
    shouldMeasure: c,
    visibleCount: h
  } = H({ gap: t, items: r, maxLines: s }), S = c ? r : r.slice(0, h), g = C > 0 || c ? i(Math.max(a, C)) : null, f = {
    height: 0,
    left: 0,
    overflow: "hidden",
    pointerEvents: "none",
    position: "absolute",
    top: 0,
    visibility: "hidden",
    whiteSpace: "nowrap"
  }, M = {
    alignItems: "flex-start",
    display: "flex",
    flexWrap: "wrap",
    gap: t,
    visibility: c ? "hidden" : void 0,
    ...u
  };
  function W(p, R) {
    return G(p) && p.key != null ? p.key : R;
  }
  return /* @__PURE__ */ F(z, { children: [
    /* @__PURE__ */ F("div", { ref: b, className: n, style: M, ...o, children: [
      S.map((p, R) => /* @__PURE__ */ I(A, { ref: m(R), children: p }, W(p, R))),
      !c && C > 0 ? /* @__PURE__ */ I(A, { "aria-label": `${C} more items`, children: g }) : null
    ] }),
    /* @__PURE__ */ I("div", { "aria-hidden": "true", style: f, children: c && a > 0 ? /* @__PURE__ */ I(A, { ref: y, children: g }) : null })
  ] });
}
export {
  Y as OverflowGroup,
  A as OverflowItem,
  H as useOverflowGroup
};
