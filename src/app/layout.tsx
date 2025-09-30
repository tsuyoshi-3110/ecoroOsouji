import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/common/Header";
import Footer from "@/components/common/Footer";
import Script from "next/script";
import ThemeBackground from "@/components/ThemeBackground";
import WallpaperBackground from "@/components/WallpaperBackground";
import SubscriptionOverlay from "@/components/SubscriptionOverlay";
import AnalyticsLogger from "@/components/AnalyticsLogger";
import { SITE_KEY } from "@/lib/atoms/siteKeyAtom";
import {
  kosugiMaru,
  notoSansJP,
  shipporiMincho,
  reggaeOne,
  yomogi,
  hachiMaruPop,
} from "@/lib/font";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
});

export const metadata: Metadata = {
  title: "HOUSE CLEAR｜ハウスクリーニング（奈良市・奈良県）",
  description:
    "奈良市を中心に奈良県全域対応のハウスクリーニング。水回り・リビング・エアコン・定期清掃まで安心価格で丁寧に対応。まずはお気軽にご相談ください。",
  keywords: [
    "HOUSE CLEAR",
    "ハウスクリーニング",
    "清掃",
    "奈良",
    "奈良市",
    "水回り掃除",
    "エアコンクリーニング",
    "定期清掃",
  ],
  authors: [{ name: "HOUSE CLEAR（眞田 光）" }],
  metadataBase: new URL("https://ecoro-osouji.com"),
  alternates: { canonical: "https://ecoro-osouji.com/" },
  openGraph: {
    title: "HOUSE CLEAR｜ハウスクリーニング（奈良市・奈良県）",
    description:
      "奈良市・奈良県全域のハウスクリーニング。キッチン/浴室/トイレ/エアコンから定期清掃までお任せください。",
    url: "https://ecoro-osouji.com/",
    siteName: "HOUSE CLEAR",
    type: "website",
    images: [
      {
        url: "https://ecoro-osouji.com/ogpLogo.png",
        width: 1200,
        height: 630,
        alt: "HOUSE CLEAR OGP",
      },
    ],
    locale: "ja_JP",
  },
  twitter: {
    card: "summary_large_image",
    title: "HOUSE CLEAR｜ハウスクリーニング（奈良市・奈良県）",
    description: "奈良市を中心に奈良県全域対応のハウスクリーニングサービス。",
    images: ["https://ecoro-osouji.com/ogpLogo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon.ico?v=4" },
      { url: "/icon.png", type: "image/png", sizes: "any" },
    ],
    apple: "/icon.png",
    shortcut: "/favicon.ico?v=4",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#000000" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="ja"
      className={`
        ${geistSans.variable} ${geistMono.variable}
        ${kosugiMaru.variable} ${notoSansJP.variable}
        ${yomogi.variable} ${hachiMaruPop.variable} ${reggaeOne.variable} ${shipporiMincho.variable}
        antialiased
      `}
    >
      <head>
        <link rel="preload" as="image" href="/ogpLogo.png" type="image/png" />
        {/* Google サーチコンソール用の検証コードは必要に応じて追加 */}
      </head>

      <body className="relative min-h-[100dvh] flex flex-col">
        <SubscriptionOverlay siteKey={SITE_KEY} />
        <AnalyticsLogger />
        <WallpaperBackground />
        <ThemeBackground />

        <Header />

        <main className="flex-1">{children}</main>

        <Footer />

        {/* 構造化データ（CleaningService） */}
        <Script
          id="ld-json"
          type="application/ld+json"
          strategy="afterInteractive"
        >
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CleaningService",
            name: "HOUSE CLEAR",
            url: "https://ecoro-osouji.com/",
            image: "https://ecoro-osouji.com/ogpLogo.png",
            description:
              "奈良市を中心に奈良県全域対応のハウスクリーニング。水回り・エアコン・定期清掃まで丁寧に対応します。",
            areaServed: [
              { "@type": "AdministrativeArea", name: "奈良県" },
              { "@type": "AdministrativeArea", name: "奈良市" },
            ],
            serviceType: ["ハウスクリーニング"],
            address: {
              "@type": "PostalAddress",
              addressRegion: "奈良県",
              addressLocality: "奈良市",
              streetAddress: "出屋敷町17-152",
              postalCode: "630-8423",
            },
            email: "mailto:ecoro.osouji@gmail.com",
            telephone: "+817091793124",
            founder: { "@type": "Person", name: "眞田 光" },
          })}
        </Script>
      </body>
    </html>
  );
}
