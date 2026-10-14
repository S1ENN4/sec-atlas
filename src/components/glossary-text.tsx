// Renders topic prose with glossary terms turned into small buttons that open a
// definition popup (the native Popover API: no JavaScript, Escape and
// click-outside close it, it is keyboard reachable). Plain function, not a
// component, so the order of calls (and therefore "first occurrence of each
// term") is deterministic while the page renders.

import type { ReactNode } from "react";
import Link from "next/link";

import { localePath, type Locale } from "@/i18n/config";
import { splitTerms, type TermInfo } from "@/lib/glossary-terms";

const MAX_TERMS_PER_PAGE = 8;

export function createTermLinker(locale: Locale, seeInGlossary: string) {
  const used = new Set<string>();
  const infos = new Map<string, TermInfo>();
  let n = 0;

  const text = (value: string): ReactNode[] =>
    splitTerms(value, locale, used, MAX_TERMS_PER_PAGE).map((piece) => {
      if (typeof piece === "string") return piece;
      infos.set(piece.info.id, piece.info);
      return (
        <button key={`${piece.info.id}-${n++}`} type="button" className="gloss-term" popoverTarget={`pop-${piece.info.id}`}>
          {piece.match}
        </button>
      );
    });

  /** The popups for every term linked so far. Call after all the text has been rendered. */
  const popovers = (): ReactNode =>
    [...infos.values()].map((info) => (
      <span key={info.id} id={`pop-${info.id}`} popover="auto" className="gloss-pop">
        <span className="gloss-pop-term">
          {info.term}
          {info.aka ? <span className="gloss-pop-aka">{info.aka}</span> : null}
        </span>
        <span className="gloss-pop-meaning">{info.meaning}</span>
        <Link href={`${localePath(locale, "/glossary")}#${info.id}`} className="gloss-pop-link">
          {seeInGlossary} →
        </Link>
      </span>
    ));

  return { text, popovers };
}
