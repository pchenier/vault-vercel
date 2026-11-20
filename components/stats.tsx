import { CountUp } from "./count-up";
import { getI18n } from "@/lib/i18n/server";

// Numbers only; the labels come from the dictionary, in the same order.
const STATS: { to: number; suffix?: string; currency?: boolean }[] = [
  { to: 12000, suffix: "+" },
  { to: 5 },
  { to: 0, currency: true },
  { to: 1 },
];

export async function Stats() {
  const { t } = await getI18n();
  const stats = STATS.map((s, i) => ({ ...s, label: t.stats[i] }));
  return (
    <section className="border-y border-line">
      <dl className="mx-auto grid max-w-6xl grid-cols-2 lg:grid-cols-4">
        {stats.map((s, i) => (
          <div
            key={s.label}
            className={`px-4 py-10 sm:px-8 ${i % 2 ? "border-l border-line" : ""} ${i >= 2 ? "border-t border-line lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="sr-only">{s.label}</dt>
            <dd className="text-[clamp(2rem,4vw,3rem)] font-semibold leading-none tracking-tight">
              <CountUp to={s.to} currency={s.currency} suffix={s.suffix} />
            </dd>
            <dd className="mt-3 text-sm text-muted">{s.label}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
