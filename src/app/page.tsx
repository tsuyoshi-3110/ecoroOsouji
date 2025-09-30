// src/app/(routes)/home/page.tsx

import type { Metadata } from "next";
import BackgroundVideo from "@/components/backgroundVideo/BackgroundVideo";
import TopFixedText from "@/components/TopFixedText";
import TopVisibleSections from "@/components/TopVisibleSections";

export const metadata: Metadata = {
  title: "HOUSE CLEAR｜ハウスクリーニング（奈良市・奈良県）",
  description:
    "奈良市を中心に奈良県全域対応のハウスクリーニング。キッチン・浴室などの水回りからリビング清掃、エアコン洗浄、定期清掃まで安心価格で丁寧に対応します。",
  openGraph: {
    title: "HOUSE CLEAR｜ハウスクリーニング（奈良市・奈良県）",
    description:
      "奈良市・奈良県でのハウスクリーニング専門サービス。水回り清掃・エアコンクリーニング・定期プランまで、暮らしに寄り添う丁寧な清掃を提供します。",
    url: "https://ecoro-osouji.com/",
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
  alternates: { canonical: "https://ecoro-osouji.com/" },
};

export default function HomePage() {
  return (
    <main className="w-full overflow-x-hidden">
      {/* ① ファーストビュー：背景動画または画像 */}
      <section className="relative h-screen overflow-hidden">
        <BackgroundVideo />
      </section>

      {/* ② テキスト紹介セクション */}
      <section className="relative z-10 text-white px-4 py-20">
        <TopFixedText />

        <h1 className="text-3xl lg:text-4xl font-extrabold text-center leading-tight mb-6 text-outline">
          HOUSE CLEAR
        </h1>

        <p className="max-w-3xl mx-auto text-center leading-relaxed text-outline">
          奈良市を中心に奈良県全域で、ハウスクリーニングを提供しています。
          キッチン・浴室などの水回りから、リビングの徹底清掃、エアコン洗浄、定期プランまで。
          ご家庭の状態やご要望に合わせて、無理なく続けられるプランをご提案します。
        </p>

        <TopVisibleSections />
      </section>

      {/* ③ JSON-LD（構造化データ） */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "CleaningService",
              name: "HOUSE CLEAR",
              url: "https://ecoro-osouji.com/",
              description:
                "奈良市を中心に奈良県全域対応のハウスクリーニングサービス。水回り・エアコン・定期清掃まで丁寧に対応します。",
              serviceType: ["ハウスクリーニング"],
              areaServed: [
                { "@type": "AdministrativeArea", name: "奈良県" },
                { "@type": "AdministrativeArea", name: "奈良市" },
              ],
              image: "https://ecoro-osouji.com/ogp-home.jpg",
              address: {
                "@type": "PostalAddress",
                addressRegion: "奈良県",
                addressLocality: "奈良市",
                streetAddress: "出屋敷町17-152",
                postalCode: "630-8423",
              },
              telephone: "+817091793124",
              email: "mailto:ecoro.osouji@gmail.com",
              founder: { "@type": "Person", name: "眞田 光" },
            },
          ]),
        }}
      />
    </main>
  );
}
