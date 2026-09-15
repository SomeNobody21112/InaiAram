import { useEffect, useRef } from 'react';

interface RevealOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
}

export function useReveal(options: RevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      el.style.opacity = '1';
      el.style.transform = 'none';
      return;
    }

    const { threshold = 0.15, rootMargin = '0px', once = true } = options;

    el.style.opacity = '0';
    el.style.transform = 'translateY(12px)';
    el.style.transition = 'opacity 420ms cubic-bezier(.2,.6,.2,1), transform 420ms cubic-bezier(.2,.6,.2,1)';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.opacity = '1';
          el.style.transform = 'translateY(0)';
          if (once) observer.unobserve(el);
        } else if (!once) {
          el.style.opacity = '0';
          el.style.transform = 'translateY(12px)';
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [options.threshold, options.rootMargin, options.once]);

  return ref;
}
