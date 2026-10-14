import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

import { SearchPalette } from "@/components/search-palette";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/profile";
import { HTML_LANG, LOCALES } from "@/i18n/config";
import { LocaleProvider } from "@/i18n/locale-context";
import { alternatesFor, openGraphLocale, resolveLocale } from "@/i18n/server";

import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const dynamicParams = false;
export const generateStaticParams = () => LOCALES.map((lang) => ({ lang }));

export async function generateMetadata({ params }: { params: Promise<{ lang: string }> }): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  return {
    metadataBase: new URL(profile.siteUrl),
    title: { default: t.meta.title, template: `%s · ${t.meta.siteName}` },
    description: t.meta.description,
    authors: [{ name: profile.name, url: profile.links.linkedin }],
    creator: profile.name,
    alternates: alternatesFor(locale),
    openGraph: { type: "website", siteName: t.meta.siteName, title: t.meta.title, description: t.meta.description, ...openGraphLocale(locale) },
    twitter: { card: "summary_large_image" },
  };
}

export default async function LocaleLayout({ children, params }: { children: ReactNode; params: Promise<{ lang: string }> }) {
  const { locale, t } = await resolveLocale(params);
  return (
    <html lang={HTML_LANG[locale]} className={`${inter.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script
          // Inline anti-flash: set [data-theme] on <html> from localStorage["kb-theme"]
          // before the first paint so users who toggled the theme (P2.5) don't see a
          // dark → light flash on hard reload. Falls back to prefers-color-scheme.
          // Wrapped in try/catch because localStorage is unavailable in some
          // test runners and private-browsing modes. Must stay inline + under 300
          // chars and must remain in <head> ahead of any stylesheet evaluation.
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("kb-theme")||(window.matchMedia("(prefers-color-scheme: light)").matches?"light":"dark");document.documentElement.dataset.theme=t}catch(e){}})()`,
          }}
        />
      </head>
      <body className="flex min-h-svh flex-col font-sans antialiased">
        <LocaleProvider locale={locale}>
          <a
            href="#content"
            className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[80] focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
          >
            {t.a11y.skipToContent}
          </a>
          <SiteHeader locale={locale} t={t} />
          <main id="content" tabIndex={-1} className="flex-1 focus:outline-none">
            {children}
          </main>
          <SiteFooter locale={locale} t={t} />
          <SearchPalette t={t.search} />
        </LocaleProvider>
      </body>
    </html>
  );
}
