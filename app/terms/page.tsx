import type { Metadata } from "next";
import { LegalPage, type LegalDoc } from "@/components/legal-page";
import { getLang } from "@/lib/i18n/server";
import type { Lang } from "@/lib/i18n/config";
import { termsEn } from "@/lib/i18n/legal/terms.en";
import { termsFr } from "@/lib/i18n/legal/terms.fr";

const DOCS: Record<Lang, LegalDoc> = { en: termsEn, fr: termsFr };

export async function generateMetadata(): Promise<Metadata> {
  const doc = DOCS[await getLang()];
  return { title: doc.metaTitle, description: doc.metaDescription };
}

export default async function TermsPage() {
  const lang = await getLang();
  const doc = DOCS[lang];
  return (
    <LegalPage
      lang={lang}
      title={doc.title}
      accent={doc.accent}
      updated={doc.updated}
      intro={doc.intro}
      sections={doc.sections}
    />
  );
}
