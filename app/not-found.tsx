import type { Metadata } from "next";
import { ErrorScreen } from "@/components/error-screen";
import { getI18n } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.errors.notFoundMeta, robots: { index: false } };
}

export default async function NotFound() {
  const { lang, t } = await getI18n();
  return (
    <ErrorScreen
      lang={lang}
      code="404"
      title={t.errors.notFoundTitle}
      message={t.errors.notFoundMessage}
    />
  );
}
