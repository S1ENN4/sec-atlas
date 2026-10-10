"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

const item = {
  hidden: { opacity: 0, y: 8 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
  },
};

type StaggerItemProps = {
  children: ReactNode;
};

/**
 * Variant child of <Stagger>. Inherits `hidden`/`show` from the parent
 * via the variant string; no own viewport detection, no own initial state.
 */
export function StaggerItem({ children }: StaggerItemProps) {
  return <m.div variants={item}>{children}</m.div>;
}
