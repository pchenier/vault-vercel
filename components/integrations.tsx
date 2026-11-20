import { getI18n } from "@/lib/i18n/server";

export async function Integrations() {
  const { t } = await getI18n();
  const sources = t.integrations.sources;
  const row = [...sources, ...sources];
  return (
    <section aria-label={t.integrations.aria} className="border-y border-line py-7">
      <p className="mb-5 text-center text-xs font-medium uppercase tracking-[0.16em] text-dim">
        {t.integrations.title}
      </p>
      <div className="marquee-wrap relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_12%,#000_88%,transparent)]">
        <ul className="marquee flex w-max gap-3">
          {row.map((s, i) => (
            <li
              key={i}
              aria-hidden={i >= sources.length}
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
