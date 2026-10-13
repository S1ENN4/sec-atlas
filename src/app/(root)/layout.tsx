import type { Metadata } from "next";
import type { ReactNode } from "react";

import "../globals.css";

// Root layout for "/": a tiny page that sends the reader to a locale.
export const metadata: Metadata = {
  title: "appsec/kb",
  robots: { index: false, follow: true },
};

export default function RootRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex min-h-svh items-center justify-center font-sans antialiased">{children}</body>
    </html>
  );
}
