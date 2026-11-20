import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import { Providers } from "@/components/providers";
import { getI18n } from "@/lib/i18n/server";
import { htmlLang } from "@/lib/i18n/config";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

// Titles and descriptions follow the visitor's language (cookie, else Accept-Language)
export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: t.meta.title,
    description: t.meta.description,
    metadataBase: new URL("https://fiscit.com"),
    openGraph: {
      title: t.meta.ogTitle,
      description: t.meta.ogDescription,
      url: "https://fiscit.com",
      siteName: "Fiscit",
      type: "website",
      locale: t.meta.ogLocale,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#080808",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Read on the server so the first render is already in the visitor's language
  const { lang } = await getI18n();
  return (
    <html
      lang={htmlLang(lang)}
      className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers lang={lang}>{children}</Providers>
      </body>
    </html>
  );
}
