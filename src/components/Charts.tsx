import { C, Tx, mTx, sum, ym } from "@/lib/penny";

export function Donut({ data, f }: { data: Record<string, number>; f: (n: number) => string }) {
  const total = sum(Object.values(data), (x) => x);
  let acc = 0;
  const seg = Object.entries(data).sort((a, b) => b[1] - a[1]).map(([c, v]) => {
    const p = (v / (total || 1)) * 100, off = -acc; acc += p;
    return { c, v, p, off };
  });
  return (
    <div className="donut-wrap">
      <svg className="donut-svg" width="150" height="150" viewBox="0 0 42 42">
        <circle cx="21" cy="21" r="15.9" fill="none" stroke="var(--bd)" strokeWidth="5.5" />
        {seg.map((s) => (
          <circle key={s.c} cx="21" cy="21" r="15.9" fill="none" stroke={C[s.c] || "#999"} strokeWidth="5.5"
            strokeDasharray={`${s.p} ${100 - s.p}`} strokeDashoffset={s.off} transform="rotate(-90 21 21)" />
        ))}
        <text x="21" y="22.5" textAnchor="middle" fontSize="5" fontWeight="800" fill="var(--tx)">{f(total)}</text>
      </svg>
      <div className="donut-legend">
        {seg.length ? seg.map((s) => (
          <div className="lg" key={s.c}><s style={{ background: C[s.c] }} />{s.c}<span>{f(s.v)}</span></div>
        )) : <span className="sub">No spending yet</span>}
      </div>
    </div>
  );
}

export function Bars({ txs }: { txs: Tx[] }) {
  const ms = [5, 4, 3, 2, 1, 0].map(ym);
  const d = ms.map((k) => [sum(mTx(txs, k).filter((x) => x.t === "in"), (x) => x.a), sum(mTx(txs, k).filter((x) => x.t === "out"), (x) => x.a)]);
  const mx = Math.max(1, ...d.flat());
  return (
    <>
      <svg className="bars-svg" viewBox="0 0 360 160" width="100%">
        {d.map((v, i) => {
          const x = i * 60 + 8, h1 = (v[0] / mx) * 115, h2 = (v[1] / mx) * 115;
          return (
            <g key={ms[i]}>
              <rect x={x} y={130 - h1} width="20" height={h1} rx="4" fill="var(--ok)" />
              <rect x={x + 23} y={130 - h2} width="20" height={h2} rx="4" fill="var(--ac)" />
              <text x={x + 21} y="148" textAnchor="middle" fontSize="10" fill="var(--mut)">
                {new Date(ms[i] + "-02").toLocaleString("en", { month: "short" })}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="sub"><span className="pos">■</span> Income &nbsp;<span style={{ color: "var(--ac)" }}>■</span> Spending</div>
    </>
  );
}