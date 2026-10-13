import { LOCALES, LOCALE_LABEL } from "@/i18n/config";
import { LocaleRedirect } from "./redirect";

// "/" has no language: static export cannot negotiate one on the server, so a
// small client script picks it (saved choice, then browser languages) and
// everyone else (no JS, crawlers) gets plain links, plus a meta refresh to English.
export default function RootPage() {
  return (
    <>
      <meta httpEquiv="refresh" content="3; url=/en" />
      <LocaleRedirect />
      <nav aria-label="Language" className="text-center font-mono text-sm">
        <p className="mb-4 text-muted-foreground">appsec/kb</p>
        <ul className="flex gap-4">
          {LOCALES.map((l) => (
            <li key={l}>
              <a href={`/${l}`} hrefLang={l} lang={l} className="text-primary underline-offset-4 hover:underline">
                {LOCALE_LABEL[l]}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </>
  );
}
