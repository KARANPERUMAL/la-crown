import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * useSmoothScroll: Application-wide fluid, momentum-based scrolling powered by Lenis.
 * Synchronizes with native window scroll and Framer Motion's useScroll hook.
 * Automatically halts when a modal/drawer is open to prevent background scrolling.
 */
export const useSmoothScroll = (isLocked = false) => {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user's reduced motion accessibility preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isLocked) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [isLocked]);

  return lenisRef;
};
