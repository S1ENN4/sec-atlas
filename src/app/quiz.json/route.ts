import { quizzes } from "@/content/quiz";

// Static quiz bank, emitted at build time as /quiz.json and fetched by the
// quiz component when it scrolls near the viewport. Keeping it out of the
// topic pages avoids duplicating each topic's questions in that page's HTML
// and in every RSC payload. Keys are "<domain>/<slug>".
export const dynamic = "force-static";

export function GET() {
  const flat: Record<string, unknown> = {};
  for (const [domain, bank] of Object.entries(quizzes)) {
    for (const [slug, questions] of Object.entries(bank)) flat[`${domain}/${slug}`] = questions;
  }
  return Response.json(flat);
}
