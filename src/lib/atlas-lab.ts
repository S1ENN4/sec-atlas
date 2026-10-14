// A tiny, safe simulation of the Atlas Maps API and dashboard for the lab. It runs
// entirely in the browser on fake data: nothing is sent anywhere and no user input
// is ever evaluated as code. The "vulnerable" and "fixed" behaviours mirror what the
// real code shown next to them would do.

export interface Customer {
  id: number;
  name: string;
  apiKey: string;
}
export interface MapRow {
  id: number;
  owner: number;
  title: string;
  stops: string[];
}

export const customers: Customer[] = [
  { id: 1, name: "Acme Logistics", apiKey: "ak_acme_7f3a91" },
  { id: 2, name: "Globex Delivery", apiKey: "ak_globex_c20e5b" },
  { id: 3, name: "Initech Cabs", apiKey: "ak_initech_55de08" },
];

export const maps: MapRow[] = [
  { id: 1, owner: 1, title: "Acme depot routes", stops: ["Depot A", "Hub 3"] },
  { id: 2, owner: 1, title: "Acme north zone", stops: ["Depot A", "Stop N1", "Stop N2"] },
  { id: 3, owner: 1, title: "Acme weekend loop", stops: ["Hub 3", "Stop W7"] },
  { id: 4, owner: 2, title: "Globex night deliveries", stops: ["Warehouse G", "12 Pine St (customer home)", "48 Oak Ave (customer home)"] },
  { id: 5, owner: 2, title: "Globex pharmacy run", stops: ["Pharmacy 9", "7 Elm Rd (customer home)"] },
  { id: 6, owner: 3, title: "Initech airport transfers", stops: ["Airport T1", "Hotel Central"] },
];

/** The signed-in customer in every exercise. */
export const ME = customers[0];

export interface RunResult {
  /** What the API or page returned, as text. */
  output: string;
  /** True when the attack got something it should not have. */
  leaked: boolean;
  /** The SQL (or HTML) the server built, shown to the learner. */
  built?: string;
  /** Extra outcome for the XSS exercise. */
  outcome?: "script" | "markup" | "text";
}

const json = (v: unknown) => JSON.stringify(v, null, 2);

// --- IDOR -------------------------------------------------------------------------

export function runIdor(rawId: string, fixed: boolean): RunResult {
  const id = Number(rawId.trim());
  if (!Number.isInteger(id)) return { output: json({ error: "id must be a number" }), leaked: false };
  const map = maps.find((m) => m.id === id);
  if (!map) return { output: json({ error: "not found" }), leaked: false };
  if (fixed && map.owner !== ME.id) return { output: json({ error: "not found" }), leaked: false };
  return { output: json(map), leaked: map.owner !== ME.id };
}

// --- SQL injection ----------------------------------------------------------------

export function runSqli(q: string, fixed: boolean): RunResult {
  if (fixed) {
    const rows = maps.filter((m) => m.owner === ME.id && m.title.toLowerCase().includes(q.toLowerCase()));
    return {
      output: json(rows.map((m) => ({ id: m.id, title: m.title }))),
      leaked: false,
      built: `SELECT id, title FROM maps WHERE owner = $1 AND title ILIKE $2\n-- $1 = ${ME.id}\n-- $2 = '%${q}%'`,
    };
  }
  const built = `SELECT id, title FROM maps WHERE owner = ${ME.id} AND title ILIKE '%${q}%'`;
  if (!q.includes("'")) {
    const rows = maps.filter((m) => m.owner === ME.id && m.title.toLowerCase().includes(q.toLowerCase()));
    return { output: json(rows.map((m) => ({ id: m.id, title: m.title }))), leaked: false, built };
  }
  // A quote closes the string. A few well-known follow-ups are simulated.
  if (/union\s+select[\s\S]*\bfrom\s+customers\b/i.test(q)) {
    return { output: json(customers.map((c) => ({ id: c.id, title: c.apiKey }))), leaked: true, built };
  }
  if (/'\s*or\s+(['"]?)(\w+)\1\s*=\s*['"]?\2/i.test(q) || /'\s*or\s+true\b/i.test(q)) {
    return { output: json(maps.map((m) => ({ id: m.id, title: m.title }))), leaked: true, built };
  }
  return {
    output: json({ error: `ERROR: syntax error at or near "${q.slice(q.indexOf("'"), q.indexOf("'") + 12)}"` }),
    leaked: false,
    built,
  };
}

// --- Cross-site scripting ---------------------------------------------------------

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

export function runXss(title: string, fixed: boolean): RunResult {
  if (fixed) {
    return { output: title, leaked: false, built: `<h3>${escapeHtml(title)}</h3>`, outcome: "text" };
  }
  const built = `<h3>${title}</h3>`;
  const runs = /<\s*script\b/i.test(title) || /<\s*[a-z][^>]*\son\w+\s*=/i.test(title) || /javascript\s*:/i.test(title);
  if (runs) return { output: title, leaked: true, built, outcome: "script" };
  const hasTag = /<\s*\/?\s*[a-z][^>]*>/i.test(title);
  return { output: title, leaked: false, built, outcome: hasTag ? "markup" : "text" };
}
