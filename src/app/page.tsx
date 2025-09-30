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
          掃除屋S │ 奈良🦌汚れ退治の秘密結社。奈良市を中心に奈良県全域で、
          <br className="hidden lg:block" />
          奈良県民がまだ知らない“地域密着”の掃除屋さんとして、代表自ら丁寧に対応します。
          <br className="hidden lg:block" />
          大手にはない柔軟対応＆徹底洗浄で、主婦層から管理会社までリピート多数。お財布に優しい価格も好評です。
          <br className="hidden lg:block" />
          キッチン・浴室などの水回り、リビングの徹底清掃、エアコン洗浄、定期プランまでお任せください。
          <br className="hidden lg:block" />
          🧽「奈良の掃除屋をもっと身近に！」👉
          フォローでプロの掃除術もチェック‼️
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
