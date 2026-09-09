import { useState, useEffect } from "react";

/**
 * useKeyboardInset
 *
 * `interactive-widget=resizes-content` (see the root layout's viewport meta
 * tag) makes the layout viewport shrink when the on-screen keyboard opens, so
 * height: var(--app-height)/100dvh containers are supposed to resize cleanly
 * above the keyboard. In practice, some Android/Chrome builds add extra UI
 * above the keyboard itself (e.g. the autofill suggestion strip) that isn't
 * fully accounted for in that resize, leaving a residual sliver of the
 * "resized" content still hidden behind it.
 *
 * window.visualViewport tracks the actual visible region in real time,
 * including that residual overlap. This hook reports exactly how many pixels
 * of the bottom of the layout viewport are still covered beyond what the
 * content resize already handled, so callers can nudge a fixed/absolute
 * bottom-anchored element up by that amount as a safety net.
 */
export const useKeyboardInset = () => {
  const [inset, setInset] = useState(0);

  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;

    const update = () => {
      const overlap = window.innerHeight - vv.height - vv.offsetTop;
      setInset(Math.max(0, Math.round(overlap)));
    };

    update();
    vv.addEventListener("resize", update);
    vv.addEventListener("scroll", update);
    return () => {
      vv.removeEventListener("resize", update);
      vv.removeEventListener("scroll", update);
    };
  }, []);

  return inset;
};
