import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

import { MotionProvider } from "@/components/motion/provider";
import { SearchPalette } from "@/components/search-palette";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { profile } from "@/content/profile";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

const DESCRIPTION =
  "Mapa interativo de segurança de software: AppSec, CloudSec e agentes de IA, com trilhas, cenários de ataque e quizzes. Conteúdo estático, sem rastreamento.";

export const metadata: Metadata = {
  metadataBase: new URL(profile.siteUrl),
  title: {
    default: "appsec/kb — mapa interativo de segurança de software",
    template: "%s · appsec/kb",
  },
  description: DESCRIPTION,
  authors: [{ name: profile.name, url: profile.links.linkedin }],
  creator: profile.name,
  openGraph: {
    type: "website",
    siteName: "appsec/kb",
    locale: "pt_BR",
    title: "appsec/kb — mapa interativo de segurança de software",
    description: DESCRIPTION,
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-svh flex-col font-sans antialiased">
        <a
          href="#conteudo"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:border focus:border-border focus:bg-card focus:px-4 focus:py-2 focus:font-mono focus:text-sm"
        >
          pular para o conteúdo
        </a>
        <MotionProvider>
          <SiteHeader />
          <main id="conteudo" className="flex-1">{children}</main>
          <SiteFooter />
          <SearchPalette />
        </MotionProvider>
      </body>
    </html>
  );
}
