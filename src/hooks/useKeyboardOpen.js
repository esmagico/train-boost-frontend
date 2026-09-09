import { useState, useEffect, useRef } from "react";

/**
 * useKeyboardOpen
 *
 * Reports whether the on-screen keyboard is currently open, by comparing the
 * current visible height against the tallest height seen so far (the
 * "no keyboard" baseline — also self-corrects across orientation changes and
 * browser chrome show/hide, which change height without a keyboard).
 *
 * Used to let a fixed-position bottom drawer temporarily grow upward past its
 * normal top offset while the keyboard is open — a drawer pinned below other
 * content can only shrink from the bottom to make room for the keyboard, so
 * if the keyboard is taller than the drawer's own slack space, its input can
 * never fully clear the keyboard without this.
 */
export const useKeyboardOpen = (threshold = 150) => {
  const [isOpen, setIsOpen] = useState(false);
  const baselineRef = useRef(null);

  useEffect(() => {
    const vv = window.visualViewport;
    const getHeight = () => vv?.height ?? window.innerHeight;

    if (baselineRef.current == null) baselineRef.current = getHeight();

    const update = () => {
      const height = getHeight();
      if (height > baselineRef.current) baselineRef.current = height;
      setIsOpen(baselineRef.current - height > threshold);
    };

    update();
    vv?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    return () => {
      vv?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
    };
  }, [threshold]);

  return isOpen;
};
