// components/common/Footer.tsx
import Image from "next/image";
import ScrollUpCTA from "@/components/ScrollUpCTA";

export default function Footer() {
  const iconSize = 48;
  return (
    <footer className="relative z-20 mt-10 border-t bg-white/30 text-sm text-white text-outline backdrop-blur supports-[backdrop-filter]:bg-white/40">
      <div className="mx-auto max-w-6xl px-4 py-10">
        {/* すべて中央寄せ */}
        <div className="flex flex-col items-center gap-6 text-center">
          {/* CTA */}
          <ScrollUpCTA
            href="/contact"
            label="無料相談・お問い合わせ"
            className="w-full max-w-xs sm:max-w-sm"
          />

          {/* SNSアイコン */}
          <nav
            className="flex items-center justify-center gap-5"
            aria-label="SNSリンク"
          >
            <a
              href="https://www.instagram.com/s.houseclear.nara?igsh=M2JjM3V4eXRjdHlv&utm_source=qr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="transition-opacity hover:opacity-80"
            >
              <Image
                src="/instagram-logo.png"
                alt="Instagram"
                width={iconSize}
                height={iconSize}
                className="object-contain"
              />
            </a>

          </nav>

          {/* エリアリンク（SEO強化） */}
          <div className="space-y-1 text-xs leading-tight">
            <p>
              <a href="/areas/local" className="hover:underline">
                奈良のハウスクリーニング
              </a>{" "}
            </p>
          </div>

          {/* コピーライト */}
          <div className="space-y-1">
            <p className="font-semibold leading-tight">HOUSE CLEAR</p>
            <p className="text-xs leading-tight">
              © {new Date().getFullYear()} HOUSE CLEAR. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
