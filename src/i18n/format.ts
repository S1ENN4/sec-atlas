// Client-safe string helpers (no fs, no crypto).

/** Replace {name} placeholders. Unknown placeholders are left as-is. */
export function fmt(template: string, vars: Record<string, string | number> = {}): string {
  return template.replace(/\{(\w+)\}/g, (m, k) => (k in vars ? String(vars[k]) : m));
}

/** Pick `<key>_one` when n === 1, otherwise `<key>_other`. Works for en, pt and es. */
export function plural(dict: Record<string, string>, key: string, n: number, vars: Record<string, string | number> = {}): string {
  const tpl = dict[n === 1 ? `${key}_one` : `${key}_other`] ?? dict[`${key}_other`] ?? key;
  return fmt(tpl, { n, ...vars });
}
