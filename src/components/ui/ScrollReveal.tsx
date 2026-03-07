"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "left" | "right";
  distance?: "sm" | "md" | "lg";
}

const DISTANCE_MAP = {
  sm: "translate-y-4",
  md: "translate-y-8",
  lg: "translate-y-14",
};

export function ScrollReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = "md",
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.style.transitionDelay = `${delay}ms`;
          el.dataset.visible = "true";
          observer.disconnect();
        }
      },
      { threshold: 0.08 },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  const translateClass =
    direction === "left"
      ? "-translate-x-8"
      : direction === "right"
        ? "translate-x-8"
        : DISTANCE_MAP[distance];

  return (
    <div
      ref={ref}
      data-visible="false"
      className={`w-full overflow-hidden opacity-0 ${translateClass} transition-all duration-700 ease-out data-[visible=true]:opacity-100 data-[visible=true]:translate-x-0 data-[visible=true]:translate-y-0 ${className}`}
    >
      {children}
    </div>
  );
}
