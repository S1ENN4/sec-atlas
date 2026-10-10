import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Inter, JetBrains_Mono } from "next/font/google";

import { MotionProvider } from "@/components/motion/provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains" });

export const metadata: Metadata = {
  title: {
    default: "appsec/kb — mapa interativo de segurança de software",
    template: "%s · appsec/kb",
  },
  description:
    "Knowledge base visual sobre SAST, DAST, SCA, pipelines e segurança em CI/CD. Conteúdo estático, sem rastreamento.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${jetbrains.variable}`}>
      <body className="flex min-h-svh flex-col font-sans antialiased">
        <MotionProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <SiteFooter />
        </MotionProvider>
      </body>
    </html>
  );
}
