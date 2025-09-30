// app/areas/nara/page.tsx
import Link from "next/link"; // ← lucide-reactではなくnext/linkを使用
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "奈良市のハウスクリーニング｜HOUSE CLEAR",
  description:
    "奈良市のハウスクリーニングは「HOUSE CLEAR」へ。水回り（キッチン・浴室・トイレ）からリビング定期清掃、エアコンクリーニングまで、丁寧で安心のサービスをご提供します。",
  alternates: { canonical: "https://ecoro-osouji.com/areas/nara" },
  openGraph: {
    title: "奈良市のハウスクリーニング｜HOUSE CLEAR",
    description:
      "奈良市全域でハウスクリーニング。水回り清掃、エアコン、引越し前後の空室清掃など定期/スポット対応します。",
    url: "https://ecoro-osouji.com/areas/nara",
    type: "article",
    images: [
      {
        url: "https://ecoro-osouji.com/ogpLogo.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  twitter: { card: "summary_large_image" },
};

export default function Page() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-10 space-y-10">
      <header className="space-y-2">
        <h1 className="text-2xl font-bold">奈良市のハウスクリーニング</h1>
        <p className="text-sm text-muted-foreground">
          奈良市全域（水間町・富雄・学園前・西大寺・高畑・大安寺 ほか）に対応しています。
        </p>
      </header>

      <section className="grid gap-6 md:grid-cols-2">
        <article className="rounded-xl border bg-white/70 p-5">
          <h2 className="font-semibold mb-2">ハウスクリーニング</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>水回り（キッチン・浴室・洗面・トイレ）</li>
            <li>エアコンクリーニング</li>
            <li>引越し前後・空室クリーニング</li>
          </ul>
        </article>
        <article className="rounded-xl border bg-white/70 p-5">
          <h2 className="font-semibold mb-2">その他対応</h2>
          <ul className="list-disc pl-5 text-sm space-y-1">
            <li>整理収納のお手伝い</li>
            <li>スポット・定期清掃</li>
            <li>女性スタッフ対応可</li>
          </ul>
        </article>
      </section>

      <section className="rounded-xl border bg-white/70 p-5">
        <h2 className="font-semibold mb-2">対応エリア（奈良市）</h2>
        <p className="text-sm">
          富雄・学園前・西大寺・あやめ池・高畑・大安寺・京終・帯解・尼ヶ辻・平城・佐保・登美ヶ丘 ほか
        </p>
      </section>

      {/* <section className="rounded-xl border bg-white/70 p-5">
        <h2 className="font-semibold mb-2">よくある質問</h2>
        <details className="mb-2">
          <summary className="cursor-pointer font-medium">当日のお願いは可能ですか？</summary>
          <p className="text-sm mt-2">
            スケジュールに空きがあれば対応いたします。まずはお問い合わせください。
          </p>
        </details>
        <details>
          <summary className="cursor-pointer font-medium">鍵預かりや不在時対応はできますか？</summary>
          <p className="text-sm mt-2">
            条件を確認のうえ、適切に管理して対応可能です。事前にご相談ください。
          </p>
        </details>
      </section> */}

      <section className="rounded-xl border bg-white/70 p-5">
        <h2 className="font-semibold mb-2">お問い合わせ</h2>
        <p className="text-sm">
          予約状況の確認・見積りは、LINE／メールフォームからお気軽にどうぞ。
        </p>
      </section>

      {/* 内部リンク */}
      <nav className="text-sm underline">
        <Link href="/">トップ画面へ</Link>
      </nav>

      {/* FAQ構造化データ */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: [
              {
                "@type": "Question",
                name: "奈良市で当日予約は可能ですか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "当日の空き状況によっては対応可能です。まずはお問い合わせください。",
                },
              },
              {
                "@type": "Question",
                name: "鍵預かりでの不在クリーニングは対応していますか？",
                acceptedAnswer: {
                  "@type": "Answer",
                  text: "条件を確認のうえ、鍵管理のルールに基づいて対応します。詳細は事前にご相談ください。",
                },
              },
            ],
          }),
        }}
      />
    </main>
  );
}
