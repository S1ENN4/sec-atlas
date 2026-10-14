"use client";

import { useEffect } from "react";

import { recordTopicVisit } from "@/lib/progress";

// Tiny client island: fires once on mount to remember the topic in
// localStorage so the hub or any "continue where you left off" surface can
// read it back. Renders nothing.
export function TopicVisitRecorder({ locale, domain, slug }: { locale: string; domain: string; slug: string }) {
  useEffect(() => {
    recordTopicVisit(locale, domain, slug);
  }, [locale, domain, slug]);
  return null;
}