"use client";

import { m } from "motion/react";
import type { ReactNode } from "react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

type StaggerProps = {
  children: ReactNode;
};

/**
 * Container that drives a staggered cascade of children using `StaggerItem`.
 * Children must be `<StaggerItem>` so variants propagate; the parent does
 * the in-view detection so children do not need their own observers.
 */
export function Stagger({ children }: StaggerProps) {
  return (
    <m.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
    >
      {children}
    </m.div>
  );
}
