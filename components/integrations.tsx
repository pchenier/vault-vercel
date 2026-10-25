const SOURCES = [
  "12,000+ banks via Plaid",
  "Wise",
  "Questrade",
  "Solana",
  "Bitcoin",
  "Google sign-in",
  "CAD · USD · EUR",
  "Credit cards",
  "TFSA · RRSP",
];

export function Integrations() {
  const row = [...SOURCES, ...SOURCES];
  return (
    <section aria-label="Supported connections" className="border-y border-line py-7">
      <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.16em] text-dim">
        Connects to everything you already use
      </p>
      <div className="marquee-wrap relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="marquee flex w-max gap-3">
          {row.map((s, i) => (
            <li
              key={i}
              aria-hidden={i >= SOURCES.length}
              className="flex items-center gap-2 whitespace-nowrap rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted"
            >
              <span className="size-1.5 rounded-full bg-lime/70" />
              {s}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
