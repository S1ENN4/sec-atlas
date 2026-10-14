// "Key points" for a topic preview: derived from the content that already
// exists, so nothing new has to be written or translated. Pure and
// deterministic (no DOM, no React), like reading-time.ts.
//
// Rule: take the first bullet of each section that has bullets, in order, up to
// `max`. A topic with no bullets falls back to the first sentence of its first
// paragraphs. Each point is trimmed to a short line at a word boundary.

import type { TopicBodyShape } from "@/lib/reading-time";

const clip = (text: string, limit = 150): string => {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= limit) return t;
  const cut = t.slice(0, limit);
  const at = cut.lastIndexOf(" ");
  return `${cut.slice(0, at > 60 ? at : limit).replace(/[,:;(]$/, "")}…`;
};

const firstSentence = (text: string): string => {
  const m = text.match(/^(.+?[.!?])(\s|$)/);
  return m ? m[1] : text;
};

export function keyPoints(topic: TopicBodyShape, max = 3): string[] {
  const out: string[] = [];
  for (const s of topic.sections) {
    const b = s.bullets?.find((x) => x.trim().length > 0);
    if (b) out.push(clip(b));
    if (out.length >= max) return out;
  }
  if (out.length === 0) {
    for (const s of topic.sections) {
      for (const p of s.body ?? []) {
        if (p.trim()) out.push(clip(firstSentence(p)));
        if (out.length >= max) return out;
      }
    }
  }
  return out;
}
