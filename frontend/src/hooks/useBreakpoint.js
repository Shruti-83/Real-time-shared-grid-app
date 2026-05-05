import { useState, useEffect } from "react";

const BREAKPOINTS = {
  mobile: 480,
  tablet: 768,
  desktop: 1024,
};

export function useBreakpoint() {
  const getBreakpoint = () => {
    const w = window.innerWidth;
    if (w < BREAKPOINTS.mobile) return "mobile";
    if (w < BREAKPOINTS.tablet) return "tablet";
    if (w < BREAKPOINTS.desktop) return "laptop";
    return "desktop";
  };

  const [bp, setBp] = useState(getBreakpoint);

  useEffect(() => {
    let raf;
    const handler = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setBp(getBreakpoint()));
    };
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  return {
    bp,
    isMobile: bp === "mobile",
    isTablet: bp === "tablet",
    isLaptop: bp === "laptop",
    isDesktop: bp === "desktop",
    isMobileOrTablet: bp === "mobile" || bp === "tablet",
    width: typeof window !== "undefined" ? window.innerWidth : 1024,
  };
}