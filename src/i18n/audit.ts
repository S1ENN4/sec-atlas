// Drift audit: compares every unit's source with every locale's overlay.
// Shared by the validator (rule R9) and the i18n CLI (status / pending).

import { LOCALES, type Locale } from "./config";
import { checkTranslation, compare, extract, isCodeKey, looksUntranslated, type Overlay, type Report } from "./engine";
import { listUnits, type UnitInfo } from "./content";
import { readOverlay } from "./store";
import { UI_UNIT, uiSource } from "./ui";

export const allUnits = (): UnitInfo[] =>
  listUnits([{ id: UI_UNIT, source: uiSource, lang: "en", strict: true, group: "ui" }]);

export interface UnitAudit {
  unit: UnitInfo;
  locale: Locale;
  report: Report;
  overlay: Overlay | null;
  /** Hard failures: these break the build. */
  errors: string[];
}

const list = (keys: string[], n = 4) => `${keys.slice(0, n).join(", ")}${keys.length > n ? ` (+${keys.length - n} more)` : ""}`;

export function auditUnit(unit: UnitInfo, locale: Locale): UnitAudit {
  const overlay = readOverlay(locale, unit.id);
  const report = compare(unit.source, overlay);
  const errors: string[] = [];
  const src = extract(unit.source);

  if (report.stale.length) errors.push(`${report.stale.length} stale translation(s): ${list(report.stale)}. The source changed: re-translate, \`prune\`, or \`keep\` if the meaning did not change`);
  if (report.orphans.length) errors.push(`${report.orphans.length} orphan key(s) no longer in the source: ${list(report.orphans)}. Run \`prune\``);
  if (unit.strict && report.missing.length) errors.push(`${report.missing.length} missing translation(s) in a strict unit: ${list(report.missing)}`);

  for (const [key, entry] of Object.entries(overlay ?? {})) {
    const source = src[key];
    if (source === undefined || entry.h === undefined || report.stale.includes(key)) continue;
    const problem = checkTranslation(key, source, entry.t);
    if (problem) errors.push(`${key}: ${problem}`);
    else if (!isCodeKey(key) && looksUntranslated(source, entry.t)) errors.push(`${key}: translation is identical to the source text`);
  }
  return { unit, locale, report, overlay, errors };
}

/** Audit every unit for every locale other than the unit's own language. */
export function auditAll(units: UnitInfo[] = allUnits()): UnitAudit[] {
  const out: UnitAudit[] = [];
  for (const unit of units) for (const locale of LOCALES) if (locale !== unit.lang) out.push(auditUnit(unit, locale));
  return out;
}
