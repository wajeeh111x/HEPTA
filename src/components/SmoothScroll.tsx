import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {

  useEffect(() => {

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.08,
    });

    return () => {
      lenis.destroy();
    };

  }, []);

  return null;
}