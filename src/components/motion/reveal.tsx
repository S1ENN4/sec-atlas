"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  delay?: number;
  y?: number;
};

/**
 * Use to fade-and-rise a block the first time it enters the viewport.
 * Animation is one-shot (`viewport.once`) and respects the provider's
 * `reducedMotion="user"` setting via MotionConfig.
 */
export function Reveal({ children, delay = 0, y = 8 }: RevealProps) {
  return (
    <m.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.4, delay, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] }}
    >
      {children}
    </m.div>
  );
}
