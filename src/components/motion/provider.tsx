"use client";

import { LazyMotion, MotionConfig, domMax } from "motion/react";
import type { ReactNode } from "react";

/**
 * LazyMotion + MotionConfig root.
 *
 * - LazyMotion(..., strict): require feature-gated children; tree-shakes the
 *   domMax feature bundle so `m.*` components only pull in the runtime features
 *   (gestures, drag, etc.) on first render. The shared chunk ships the core only.
 * - MotionConfig reducedMotion="user": honors the OS `prefers-reduced-motion`
 *   setting and disables non-essential transforms when the user opts out.
 *
 * Children are rendered verbatim — this provider is purely an in-place boundary.
 */
export function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <LazyMotion features={domMax} strict>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
