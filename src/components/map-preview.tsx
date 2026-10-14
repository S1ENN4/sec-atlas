// A small, static picture of the mind map, used on the hub so the maps are visible
// before anyone clicks. Decorative: the link around it carries the meaning.

const H = 190;

const pill = (label: string) => Math.max(56, label.length * 6.4 + 30);

export function MapPreview({ center, items }: { center: string; items: string[] }) {
  const cx = 0;
  const cy = 0;
  const cw = pill(center) + 14;
  const right = items.slice(0, Math.ceil(items.length / 2));
  const left = items.slice(Math.ceil(items.length / 2));
  const place = (group: string[], side: 1 | -1) =>
    group.map((label, i) => {
      const n = group.length;
      const y = cy + (i - (n - 1) / 2) * 46;
      const w = pill(label);
      const x = cx + side * (cw / 2 + 56 + w / 2);
      return { label, x, y, w, side, hue: [152, 200, 250, 300, 12, 52][(side === 1 ? i : i + right.length) % 6] };
    });
  const nodes = [...place(right, 1), ...place(left, -1)];
  const reach = Math.max(cw / 2 + 10, ...nodes.map((n) => Math.abs(n.x) + n.w / 2 + 8));

  return (
    <svg viewBox={`${-reach} ${-H / 2} ${reach * 2} ${H}`} role="img" aria-hidden className="explore-canvas h-auto w-full" preserveAspectRatio="xMidYMid meet">
      {nodes.map((n) => {
        const x1 = cx + n.side * (cw / 2);
        const x2 = n.x - n.side * (n.w / 2);
        const xm = (x1 + x2) / 2;
        return (
          <path
            key={n.label}
            d={`M${x1},${cy} C${xm},${cy} ${xm},${n.y} ${x2},${n.y}`}
            fill="none"
            strokeWidth={1.6}
            strokeLinecap="round"
            style={{ stroke: `oklch(var(--nl) var(--nc) ${n.hue})`, opacity: 0.7 }}
          />
        );
      })}
      {nodes.map((n) => (
        <g key={n.label} transform={`translate(${n.x} ${n.y})`}>
          <rect x={-n.w / 2} y={-13} width={n.w} height={26} rx={13} style={{ fill: "var(--card)", stroke: `oklch(var(--nl) var(--nc) ${n.hue})`, strokeWidth: 1.5 }} />
          <text textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={500} className="fill-foreground">
            {n.label}
          </text>
        </g>
      ))}
      <g transform={`translate(${cx} ${cy})`}>
        <rect x={-cw / 2} y={-17} width={cw} height={34} rx={17} style={{ fill: "var(--card)", stroke: "oklch(var(--nl) var(--nc) 152)", strokeWidth: 2.2 }} />
        <text textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={600} className="fill-foreground">
          {center}
        </text>
      </g>
    </svg>
  );
}
