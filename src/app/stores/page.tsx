import type { Metadata } from "next";
import StoresClient from "@/components/StoresClient";
import { PhoneSection } from "@/components/PhoneSection";

export const metadata: Metadata = {
  title: "店舗一覧｜HOUSE CLEAR",
  description:
    "HOUSE CLEAR の店舗一覧ページ。奈良市を中心に奈良県全域対応のハウスクリーニングサービス拠点情報をご紹介します。",
  openGraph: {
    title: "店舗一覧｜HOUSE CLEAR",
    description:
      "HOUSE CLEAR の各店舗情報。奈良県内のサービス対応エリア、店舗紹介、連絡先を掲載しています。",
    url: "https://ecoro-osouji.com/stores",
    siteName: "HOUSE CLEAR",
    images: [
      {
        url: "https://ecoro-osouji.com/ogpLogo.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "ja_JP",
    type: "website",
  },
  alternates: { canonical: "https://ecoro-osouji.com/stores" },
};

export default function StoresPage() {
  return (
    <main className="px-4 py-16">
      {/* ページタイトル・説明文 */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <h1 className="text-2xl lg:text-3xl font-extrabold mb-4 text-white text-outline">
          HOUSE CLEAR ─ 店舗一覧
        </h1>
        <p className="leading-relaxed text-white text-outline">
          <strong>HOUSE CLEAR</strong> は
          <strong>奈良市を中心に奈良県全域</strong>で
          ハウスクリーニングサービスを提供しています。
          <br className="hidden lg:block" />
          各店舗のサービス対応エリアや詳細情報をこちらからご確認いただけます。
        </p>
      </section>

      {/* 電話番号や連絡先セクション */}
      <section className="max-w-4xl mx-auto text-center mb-12">
        <PhoneSection />
      </section>

      {/* 店舗カードのクライアントレンダリング（Firestore対応） */}
      <StoresClient />
    </main>
  );
}
