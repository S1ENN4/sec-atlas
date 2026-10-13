import { domains } from "@/content/registry";
import { LOCALES } from "@/i18n/config";
import { domainLang, localizeUnit, quizUnitSource } from "@/i18n/content";
import { isLocale } from "@/i18n/config";

// Static quiz bank per locale, emitted at build time as /<locale>/quiz.json and
// fetched by the quiz component when it scrolls near the viewport. Keeping it
// out of the topic pages avoids duplicating each topic's questions in that
// page's HTML and in every RSC payload. Keys are "<domain>/<slug>".
export const dynamic = "force-static";
export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function GET(_req: Request, ctx: { params: Promise<{ lang: string }> }) {
  const { lang } = await ctx.params;
  if (!isLocale(lang)) return new Response("Not found", { status: 404 });
  const flat: Record<string, unknown> = {};
  for (const d of Object.values(domains)) {
    for (const t of d.topics) {
      const unit = localizeUnit(`quiz:${d.id}/${t.slug}`, quizUnitSource(d.id, t.slug), domainLang(d), lang);
      flat[`${d.id}/${t.slug}`] = unit.value.questions;
    }
  }
  return Response.json(flat);
}
