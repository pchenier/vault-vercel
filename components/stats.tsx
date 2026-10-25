import { CountUp } from "./count-up";

const STATS = [
  { to: 12000, suffix: "+", label: "banks and credit unions" },
  { to: 5, label: "kinds of accounts in one net worth" },
  { to: 0, prefix: "$", label: "access to move your money" },
  { to: 1, label: "dashboard instead of five apps" },
];

export function Stats() {
  return (
    <section className="border-y border-line">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-10 sm:px-8 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-tight">
              <CountUp to={s.to} prefix={s.prefix} suffix={s.suffix} />
            </dd>
            <dd className="mt-3 text-sm text-muted">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
