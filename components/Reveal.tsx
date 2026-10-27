"use client";

import { useEffect, useRef, useState } from "react";

type Props = { children: React.ReactNode; className?: string; delay?: number };

/**
 * Apparition douce au scroll. Sans JavaScript (ou si l'élément est déjà visible),
 * le contenu s'affiche normalement : rien n'est jamais caché pour de bon.
 */
export default function Reveal({ children, className = "", delay = 0 }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"init" | "hidden" | "shown">("init");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) return;
    if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return; // déjà à l'écran

    setState("hidden");
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setState("shown");
          io.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const visual =
    state === "hidden"
      ? "translate-y-5 opacity-0"
      : "translate-y-0 opacity-100 transition-all duration-700 ease-out";

  return (
    <div ref={ref} style={{ transitionDelay: `${delay}ms` }} className={`${visual} ${className}`}>
      {children}
    </div>
  );
}
