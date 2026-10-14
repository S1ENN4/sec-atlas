// Stable anchor id for a glossary term ("Prompt injection" -> "term-prompt-injection").
// Shared by the glossary page (which puts the id on each entry) and by the
// in-text term popups (which link to it). No imports: safe on server and client.
export function termId(term: string): string {
  const slug = term
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `term-${slug || "x"}`;
}
