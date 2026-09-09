import { useState, useEffect } from "react";

export const usePortraitMode = () => {
  const [isPortrait, setIsPortrait] = useState(false);

  useEffect(() => {
    // IMPORTANT: window.innerWidth/innerHeight, and even the CSS
    // `orientation` media feature (matchMedia('(orientation: ...)')), are ALL
    // defined in terms of the *viewport*, not the device's physical
    // orientation. With `interactive-widget=resizes-content` in the viewport
    // meta tag, the on-screen keyboard genuinely shrinks the viewport height
    // — so all of those would (and did) misread "keyboard is open" as
    // "device rotated to landscape" while typing.
    //
    // window.screen.width/height reflect the physical screen's dimensions in
    // its current hardware orientation and are NOT affected by the on-screen
    // keyboard, browser toolbars, or any viewport resize — only an actual
    // device rotation changes which of the two is larger.
    const checkOrientation = () => {
      const isMobileOrTablet = window.innerWidth <= 1024;
      const isPortraitMode = window.screen.width <= window.screen.height;
      setIsPortrait(isMobileOrTablet && isPortraitMode);
    };

    checkOrientation();

    const screenOrientation = window.screen?.orientation;
    if (screenOrientation?.addEventListener) {
      screenOrientation.addEventListener("change", checkOrientation);
    } else {
      // Safari (no Screen Orientation API support) falls back to this event.
      window.addEventListener("orientationchange", checkOrientation);
    }
    window.addEventListener("resize", checkOrientation);
    // iOS Safari doesn't fire resize when returning from another tab — re-check on visibility.
    document.addEventListener("visibilitychange", checkOrientation);

    return () => {
      if (screenOrientation?.removeEventListener) {
        screenOrientation.removeEventListener("change", checkOrientation);
      } else {
        window.removeEventListener("orientationchange", checkOrientation);
      }
      window.removeEventListener("resize", checkOrientation);
      document.removeEventListener("visibilitychange", checkOrientation);
    };
  }, []);

  return isPortrait;
};
