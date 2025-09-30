// src/app/(routes)/news/page.tsx
import type { Metadata } from "next";
import NewsClient from "@/components/NewsClient";

export const metadata: Metadata = {
  title: "お知らせ｜HOUSE CLEAR",
  description:
    "HOUSE CLEAR の最新情報・キャンペーン・サービス更新・営業時間に関するお知らせを掲載しています。（奈良市を中心に奈良県全域対応のハウスクリーニング）",
  openGraph: {
    title: "お知らせ｜HOUSE CLEAR",
    description:
      "HOUSE CLEAR からのお知らせ。最新の清掃サービスやキャンペーン、営業時間・対応エリアの変更などを随時ご案内します。",
    url: "https://ecoro-osouji.com/news",
    siteName: "HOUSE CLEAR",
    images: [
      {
        url: "https://ecoro-osouji.com/ogpLogo.png",
        width: 1200,
        height: 630,
        alt: "HOUSE CLEAR OGP",
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  alternates: { canonical: "https://ecoro-osouji.com/news" },
};

export default function NewsPage() {
  return (
    <main className="px-4 py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mt-6 mb-6 text-center text-white/80 text-outline">
        お知らせ
      </h1>
      <NewsClient />
    </main>
  );
}
