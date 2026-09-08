import { useEffect } from "react";

// The field moves only with scrolling; no idle animation or extra GPU canvas.
export default function StudioAtmosphere() {
  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    function paint() {
      frame = 0;
      root.style.setProperty(
        "--field-offset",
        `${media.matches ? 0 : Math.sin(window.scrollY / 1500) * 45}px`,
      );
    }
    function schedule() {
      if (!frame && !media.matches && !document.hidden)
        frame = requestAnimationFrame(paint);
    }
    function preference() {
      cancelAnimationFrame(frame);
      frame = 0;
      paint();
    }
    window.addEventListener("scroll", schedule, { passive: true });
    media.addEventListener("change", preference);
    document.addEventListener("visibilitychange", schedule);
    paint();
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      media.removeEventListener("change", preference);
      document.removeEventListener("visibilitychange", schedule);
      root.style.removeProperty("--field-offset");
    };
  }, []);
  return null;
}
