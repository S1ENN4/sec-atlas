// Reading-time estimator. Pure, deterministic, no DOM, no React.
//
// The estimate strips fenced code blocks and HTML before counting words, so a
// 50-line snippet does not bloat the headline. The body of a topic is the
// tagline plus each section's heading, paragraphs and bullet lines, plus the
// filename of every code sample (filenames are short but they are still words
// a person reads out loud when scanning).

/**
 * Estimate how many minutes it takes to read `text` at `wpm` words per minute.
 *
 * The function strips fenced code blocks (` ``` … ``` `) and inline HTML tags,
 * collapses whitespace, and returns `max(1, ceil(words / wpm))` so the floor is
 * one minute: even an empty topic shows "1 min".
 */
export function estimateReadingMinutes(text: string, wpm = 200): number {
  if (!text) return 1;
  if (wpm <= 0) return 1;
  const stripped = text
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`[^`]*`/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, " $1")
    .replace(/https?:\/\/\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!stripped) return 1;
  const words = stripped.split(" ").length;
  return Math.max(1, Math.ceil(words / wpm));
}

/**
 * The smallest shape that captures every string a topic contributes to the
 * reading-time estimate. Defined here so this file does not depend on the
 * content layer (which would create a cycle).
 */
export interface TopicBodyShape {
  tagline: string;
  sections: ReadonlyArray<{
    heading: string;
    body?: ReadonlyArray<string>;
    bullets?: ReadonlyArray<string>;
    code?: ReadonlyArray<{ filename?: string }>;
  }>;
}

/**
 * Concatenate the prose fields of a topic. The caller passes any value that
 * matches `TopicBodyShape`; the full `Topic` type from `src/content/types`
 * already satisfies it.
 */
export function topicBodyText(topic: TopicBodyShape): string {
  const parts: string[] = [];
  if (topic.tagline) parts.push(topic.tagline);
  for (const section of topic.sections) {
    parts.push(section.heading);
    if (section.body) for (const p of section.body) if (p) parts.push(p);
    if (section.bullets) for (const b of section.bullets) if (b) parts.push(b);
    if (section.code) for (const c of section.code) if (c.filename) parts.push(c.filename);
  }
  return parts.join(" ");
}