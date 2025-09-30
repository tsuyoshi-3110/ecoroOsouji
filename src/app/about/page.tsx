import type { Metadata } from "next";
import AboutClient from "@/components/AboutClient";

export const metadata: Metadata = {
  title: "私たちの想い｜HOUSE CLEAR",
  description:
    "HOUSE CLEAR の想いをご紹介します。奈良市を中心に奈良県全域で、お客様の暮らしに寄り添い、快適で清潔な空間づくりをサポートする私たちの理念と姿勢をお伝えします。",
  openGraph: {
    title: "私たちの想い｜HOUSE CLEAR",
    description:
      "奈良市・奈良県全域で、心を込めたハウスクリーニングサービスを提供。お客様の笑顔とゆとりある暮らしを第一に考えています。",
    url: "https://ecoro-osouji.com/about",
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
  alternates: { canonical: "https://ecoro-osouji.com/about" },
};

export default function AboutPage() {
  return (
    <main className="px-4 py-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mt-3 text-center text-white/80 text-outline">
        私たちの想い
      </h1>
      <AboutClient />
    </main>
  );
}
