/*
 * Refactored /config/site.ts
 * 目的：新規 Pageit 作成時に「最小の上書き」だけで全体が組み上がるようにする。
 * 使い方：
 *   1) SITE_BRAND / SITE_OVERRIDES の値だけを書き換える（店舗名・キャッチ・説明など）
 *   2) 必要なら copy, PAGES の文言や画像パスを調整
 *   3) それ以外は触らずに使い回し可能
 */

import type { Metadata } from "next";
import { SITE_KEY } from "@/lib/atoms/siteKeyAtom";
import { type AiSiteConfig } from "@/types/AiSite";
import { type FooterI18n } from "@/types/FooterI18n";
import { type FaqItem } from "@/types/FaqItem";
import { type PageDef } from "@/types/PageDef";

/* =========================
   URL / 環境ユーティリティ
========================= */
const ENV_BASE_URL_RAW =
  process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const BASE_URL = ENV_BASE_URL_RAW.replace(/\/$/, "");

function safeHost(input: string, fallback = "localhost:3000"): string {
  try {
    return new URL(input).host;
  } catch {
    return fallback;
  }
}

function safeMetadataBase(input: string): URL | undefined {
  try {
    return new URL(input);
  } catch {
    return undefined;
  }
}

const DOMAIN = safeHost(BASE_URL);
const METADATA_BASE_SAFE = safeMetadataBase(BASE_URL);

/* =========================
   サイト定義ファクトリ（単一情報源）
========================= */
export type SiteOverrides = {
  /** 店舗名（ブランド名） */
  name: string;
  /** キャッチコピー */
  tagline: string;
  /** サイト説明（OG/SEO 共通） */
  description: string;
  /** 検索キーワード */
  keywords: ReadonlyArray<string>;
  /** 代表TEL（任意） */
  tel?: string;
  /** ロゴ/OG既定パス */
  logoPath?: string;
  /** Google Site Verification（任意） */
  googleSiteVerification?: string;
  /** SNS（任意） */
  socials?: Partial<{
    instagram: string;
    line: string;
    x: string;
    facebook: string;
  }>;
  /** baseUrl を個別指定したい場合のみ */
  baseUrl?: string;
};

function createSite(overrides: SiteOverrides) {
  const baseUrl = (overrides.baseUrl ?? BASE_URL).replace(/\/$/, "");
  const domain = safeHost(baseUrl, DOMAIN);
  return {
    key: SITE_KEY,
    domain,
    baseUrl,
    name: overrides.name,
    tagline: overrides.tagline,
    description: overrides.description,
    keywords: overrides.keywords as readonly string[],
    tel: overrides.tel ?? "",
    logoPath: overrides.logoPath ?? "/images/ogpLogo.png",
    googleSiteVerification: overrides.googleSiteVerification ?? "",
    socials: {
      instagram: overrides.socials?.instagram ?? "",
      line: overrides.socials?.line ?? "",
      x: overrides.socials?.x ?? "",
      facebook: overrides.socials?.facebook ?? "",
    },
  } as const;
}

/* =========================
   ★ 店舗ごとの最小上書き（ここだけ編集）
========================= */
const SITE_BRAND = "HOUSE CLEAR"; // 表示用のフル表記（全角スペース等もOK）

const SITE_OVERRIDES: SiteOverrides = {
  name: "HOUSE CLEAR",
  tagline: "ハウスクリーニング（奈良市・奈良県）",
  description:
    "暮らしも、仕事場も。\n“使う人目線”で、空間を仕上げます。\n・住まいを整えるハウスクリーニング\n・新しい一歩を気持ちよく迎える引っ越し清掃\n・信頼を映すオフィス・作業場クリーニング\n・日常を底上げする定期・スポット清掃\n清掃は作業じゃない。\n価値を整える仕事です。",
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
  tel: "+817091793124",
  logoPath: "/images/ogpLogo.png",
  socials: {
    // 不明なため空（不要な推測で埋めない）
    instagram: "",
    line: "",
    x: "",
    facebook: "",
  },
  baseUrl: "https://ecoro-osouji.com",
};

/* =========================
   サイト定義（以降は原則編集不要）
========================= */
export const siteName = SITE_BRAND; // 互換：従来の siteName を残す
export const site = createSite(SITE_OVERRIDES);

/* =========================
   住所（公開用）←★追加
   ※ ownerAddress は公開しない。SEO/リッチリザルト用にこちらを使う。
========================= */
export type PublicAddress = {
  text: string; // 表示用
  postal: {
    "@type": "PostalAddress";
    addressCountry: "JP";
    addressRegion: string;
    addressLocality: string;
    streetAddress: string;
    postalCode?: string;
  };
  hasMap: string; // Google Maps 検索URL
};
function mapUrlFromText(text: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    text
  )}`;
}

/** 店舗の公開住所（必要に応じてこの値だけ編集） */
export const PUBLIC_ADDRESS: PublicAddress = {
  text: "奈良県奈良市出屋敷町17-152",
  postal: {
    "@type": "PostalAddress",
    addressCountry: "JP",
    addressRegion: "奈良県",
    addressLocality: "奈良市",
    streetAddress: "出屋敷町17-152",
    postalCode: "630-8423",
  },
  hasMap: mapUrlFromText("奈良県奈良市出屋敷町17-152"),
};

/* =========================
   便利ヘルパ
========================= */
export const pageUrl = (path = "/") =>
  `${site.baseUrl.replace(/\/$/, "")}${
    path.startsWith("/") ? path : `/${path}`
  }`;

const ogImage = (p?: string) => pageUrl(p ?? site.logoPath);

/* =========================
   コピー（集中管理）
========================= */
/* =========================
   コピー（集中管理）★多言語対応
   - copy[lang].home.headline のように参照
   - lang は "ja" | "en" | "zh" | "zh-TW" | ...
========================= */

export type CopyBundle = {
  home: {
    headline: string;
    description: string;
  };
  stores: {
    heroTitle: string;
    heroAreas: string;
    heroLead: string;
    heroTail: string;
    heroIntroLine: string;
  };
  areasLocal: {
    h1: string;
    lead: string;
    services: {
      title: string;
      bullets: string[];
    }[];
    coverageTitle: string;
    coverageBody: string;
    faq: {
      q: string;
      a: string;
    }[];
    contactTitle: string;
    contactText: string;
    toProductsText: string;
  };
};

/**
 * UI 言語ごとの文言。
 * 例：
 *   const t = copy[uiLang] ?? copy["ja"];
 *   t.home.headline
 */
export const copy: Record<string, CopyBundle> = {
  /* ========= 日本語 ========= */
  ja: {
    home: {
      headline: site.name,
      description:
        "暮らしも、仕事場も。\n“使う人目線”で、空間を仕上げます。\n・住まいを整えるハウスクリーニング\n・新しい一歩を気持ちよく迎える引っ越し清掃\n・信頼を映すオフィス・作業場クリーニング\n・日常を底上げする定期・スポット清掃\n清掃は作業じゃない。\n価値を整える仕事です。",
    },
    stores: {
      heroTitle: `${site.name} ─ 店舗一覧`,
      heroAreas: "奈良市・奈良県全域",
      heroLead:
        "ハウスクリーニングサービスを提供しています。",
      heroTail:
        "サービス対応エリアや詳細情報をこちらからご確認いただけます。",
      heroIntroLine: `${site.name}は奈良市を中心に奈良県全域対応のハウスクリーニングサービスを提供しています。`,
    },
    areasLocal: {
      h1: "奈良市のハウスクリーニング",
      lead: "奈良市を中心に奈良県全域に対応。まずはお気軽にご相談ください。",
      services: [
        {
          title: "ハウスクリーニング",
          bullets: [
            "水回り（キッチン・浴室・洗面・トイレ）",
            "リビング・居室の清掃",
            "窓・サッシ・ベランダ清掃（内容はご相談）",
          ],
        },
        {
          title: "エアコンクリーニング",
          bullets: [
            "家庭用エアコンの分解洗浄（内容は機種により異なります）",
            "ニオイ・カビ対策のご相談",
            "複数台のご依頼も対応",
          ],
        },
        {
          title: "引っ越し清掃／定期清掃",
          bullets: [
            "引っ越し前後の清掃（在宅・空室どちらもご相談）",
            "定期清掃（頻度・範囲はご相談）",
            "スポット清掃（必要な箇所だけ）",
          ],
        },
      ],
      coverageTitle: "対応エリア",
      coverageBody:
        "奈良市を中心に奈良県全域に対応しています。詳細な対応可否はお問い合わせ時にご案内します。",
      faq: [
        {
          q: "見積もりは無料ですか？",
          a: "はい、無料です。内容により事前確認が必要な場合がありますので、まずはご相談ください。",
        },
        {
          q: "当日予約は可能ですか？",
          a: "当日の空き状況によっては対応可能です。まずはお問い合わせください。",
        },
        {
          q: "不在時の清掃は可能ですか？",
          a: "条件を確認のうえ対応可能です。詳細は事前にご相談ください。",
        },
        {
          q: "追加のお願いは可能ですか？",
          a: "スケジュールに空きがあれば対応いたします。まずはご相談ください。",
        },
      ],
      contactTitle: "お問い合わせ",
      contactText:
        "予約状況の確認・見積りは、メールフォームからお気軽にどうぞ。",
      toProductsText: "トップページへ",
    },
  },

  /* ========= 英語 ========= */
  en: {
    home: {
      headline: site.name,
      description:
        "We provide professional house cleaning services across Nara City and the Nara Prefecture. From kitchens and bathrooms to living spaces, air-conditioner cleaning, and recurring plans, we offer solutions that fit your needs and budget.",
    },
    stores: {
      heroTitle: `${site.name} ─ Locations`,
      heroAreas: "Nara City & Nara Prefecture",
      heroLead:
        "We offer house cleaning services for homes and workplaces.",
      heroTail:
        "Check service areas and details from this page.",
      heroIntroLine: `${site.name} provides house cleaning services across Nara City and the Nara Prefecture.`,
    },
    areasLocal: {
      h1: "House cleaning in Nara City",
      lead: "We cover Nara City and can support the wider Nara Prefecture. Please feel free to contact us.",
      services: [
        {
          title: "House cleaning",
          bullets: [
            "Wet areas (kitchen, bathroom, washstand, toilet)",
            "Living rooms and bedrooms",
            "Windows and balconies (please ask for details)",
          ],
        },
        {
          title: "Air conditioner cleaning",
          bullets: [
            "Cleaning for home air conditioners (scope depends on the unit)",
            "Odor and mold consultations",
            "Multiple units are supported",
          ],
        },
        {
          title: "Move-in / recurring cleaning",
          bullets: [
            "Move-in / move-out cleaning (occupied or vacant)",
            "Recurring cleaning plans (frequency and scope available)",
            "Spot cleaning (specific areas only)",
          ],
        },
      ],
      coverageTitle: "Service area",
      coverageBody:
        "We primarily serve Nara City and can support the wider Nara Prefecture. Please contact us to confirm coverage details.",
      faq: [
        {
          q: "Is the estimate free?",
          a: "Yes. In some cases we may need to confirm details in advance. Please contact us first.",
        },
        {
          q: "Can I book for the same day?",
          a: "Depending on availability, same-day bookings may be possible. Please contact us.",
        },
        {
          q: "Can you clean while I am away?",
          a: "Yes, depending on conditions. Please consult us in advance.",
        },
        {
          q: "Can I add extra requests on the day?",
          a: "If there is room in the schedule, we can support additional requests. Please ask us first.",
        },
      ],
      contactTitle: "Contact",
      contactText:
        "To check availability or request an estimate, please contact us via the inquiry form.",
      toProductsText: "Back to the top page",
    },
  },

  /* ========= 簡体中文 ========= */
  zh: {
    home: {
      headline: site.name,
      description:
        "我们以奈良市为中心，覆盖奈良县全域，提供专业的居家清洁服务。包括厨房、浴室等水区清洁、客厅与居室清洁、空调清洗，以及定期与单次清洁方案，按需求灵活安排。",
    },
    stores: {
      heroTitle: `${site.name} ─ 门店一览`,
      heroAreas: "奈良市・奈良县全域",
      heroLead: "提供居家清洁服务。",
      heroTail: "服务范围与详细信息请在本页面查看。",
      heroIntroLine: `${site.name} 以奈良市为中心，覆盖奈良县全域提供居家清洁服务。`,
    },
    areasLocal: {
      h1: "奈良市的居家清洁",
      lead: "覆盖奈良市，并可支持奈良县全域。欢迎随时咨询。",
      services: [
        {
          title: "居家清洁",
          bullets: [
            "水区（厨房、浴室、洗手台、卫生间）清洁",
            "客厅与居室清洁",
            "窗户与阳台清洁（内容可咨询）",
          ],
        },
        {
          title: "空调清洗",
          bullets: [
            "家用空调清洗（范围因机型而异）",
            "异味与霉菌问题咨询",
            "支持多台清洗",
          ],
        },
        {
          title: "搬家清洁／定期清洁",
          bullets: [
            "搬入/搬出前后清洁（有人/空房均可咨询）",
            "定期清洁（频率与范围可咨询）",
            "单次清洁（仅清洁指定区域）",
          ],
        },
      ],
      coverageTitle: "服务范围",
      coverageBody:
        "以奈良市为中心，覆盖奈良县全域。具体是否可上门请在咨询时确认。",
      faq: [
        {
          q: "报价免费吗？",
          a: "是的，报价免费。部分情况可能需要事先确认详情，请先联系我们。",
        },
        {
          q: "可以当天预约吗？",
          a: "视当日空档情况而定，有时可以当天安排。请先联系确认。",
        },
        {
          q: "不在家也可以清洁吗？",
          a: "在事先确认条件的前提下可以。请提前咨询。",
        },
        {
          q: "当天可以追加项目吗？",
          a: "若时间允许可灵活安排。请先与我们沟通。",
        },
      ],
      contactTitle: "联系我们",
      contactText: "如需确认预约情况或索取报价，请通过网站表单联系我们。",
      toProductsText: "返回首页",
    },
  },

  /* ========= 繁體中文 ========= */
  "zh-TW": {
    home: {
      headline: site.name,
      description:
        "我們以奈良市為中心，服務範圍涵蓋奈良縣全域，提供專業居家清潔。包含廚房、浴室等濕區清潔、客廳與居室清潔、冷氣清洗，以及定期與單次方案，依需求彈性安排。",
    },
    stores: {
      heroTitle: `${site.name} ─ 店鋪一覽`,
      heroAreas: "奈良市・奈良縣全域",
      heroLead: "提供居家清潔服務。",
      heroTail: "服務範圍與詳細資訊請於本頁查看。",
      heroIntroLine: `${site.name} 以奈良市為中心，涵蓋奈良縣全域提供居家清潔服務。`,
    },
    areasLocal: {
      h1: "奈良市的居家清潔",
      lead: "涵蓋奈良市，並可支援奈良縣全域。歡迎洽詢。",
      services: [
        {
          title: "居家清潔",
          bullets: [
            "濕區（廚房、浴室、洗手台、廁所）清潔",
            "客廳與居室清潔",
            "窗戶與陽台清潔（內容可洽詢）",
          ],
        },
        {
          title: "冷氣清洗",
          bullets: [
            "家用冷氣清洗（範圍依機型而異）",
            "異味與霉菌問題洽詢",
            "可支援多台清洗",
          ],
        },
        {
          title: "搬家清潔／定期清潔",
          bullets: [
            "搬入／搬出前後清潔（在宅／空屋皆可洽詢）",
            "定期清潔（頻率與範圍可洽詢）",
            "單次清潔（僅指定區域）",
          ],
        },
      ],
      coverageTitle: "服務範圍",
      coverageBody:
        "以奈良市為中心，涵蓋奈良縣全域。是否可上門請於洽詢時確認。",
      faq: [
        {
          q: "報價免費嗎？",
          a: "是的，報價免費。部分情況可能需要事先確認細節，請先與我們聯繫。",
        },
        {
          q: "可以當天預約嗎？",
          a: "視當天空檔情況而定，有時可提供當日服務。請先聯繫確認。",
        },
        {
          q: "人不在家也可以清潔嗎？",
          a: "在事先確認條件後可以。請提前洽詢。",
        },
        {
          q: "當天可以追加項目嗎？",
          a: "若時間允許可彈性安排。請先與我們溝通。",
        },
      ],
      contactTitle: "聯絡我們",
      contactText: "如需確認預約或索取報價，請透過網站表單與我們聯絡。",
      toProductsText: "回到首頁",
    },
  },

  /* ========= 韓国語 ========= */
  ko: {
    home: {
      headline: site.name,
      description:
        "저희는 나라시를 중심으로 나라현 전역에서 하우스 클리닝 서비스를 제공합니다. 주방/욕실 등 물 사용 공간부터 거실 및 방, 에어컨 청소, 정기 및 단발 플랜까지 필요에 맞춰 안내해 드립니다.",
    },
    stores: {
      heroTitle: `${site.name} ─ 지점 목록`,
      heroAreas: "나라시・나라현 전역",
      heroLead: "하우스 클리닝 서비스를 제공합니다.",
      heroTail:
        "서비스 가능 지역과 자세한 내용은 이 페이지에서 확인하실 수 있습니다.",
      heroIntroLine: `${site.name}는 나라시를 중심으로 나라현 전역에서 하우스 클리닝 서비스를 제공합니다.`,
    },
    areasLocal: {
      h1: "나라시 하우스 클리닝",
      lead: "나라시를 중심으로 나라현 전역을 지원합니다. 편하게 문의해 주세요.",
      services: [
        {
          title: "하우스 클리닝",
          bullets: [
            "물 사용 공간(주방/욕실/세면대/화장실)",
            "거실 및 방 청소",
            "창문/베란다 청소(상세는 문의)",
          ],
        },
        {
          title: "에어컨 클리닝",
          bullets: [
            "가정용 에어컨 청소(범위는 기종에 따라 다름)",
            "냄새/곰팡이 상담",
            "복수 대수도 대응",
          ],
        },
        {
          title: "이사 청소/정기 청소",
          bullets: [
            "입주/퇴거 청소(거주/공실 모두 상담 가능)",
            "정기 청소(빈도/범위 상담 가능)",
            "스팟 청소(필요한 부분만)",
          ],
        },
      ],
      coverageTitle: "서비스 지역",
      coverageBody:
        "나라시를 중심으로 나라현 전역을 지원합니다. 자세한 범위는 문의 시 안내드립니다.",
      faq: [
        {
          q: "견적은 무료인가요?",
          a: "네, 무료입니다. 경우에 따라 사전 확인이 필요할 수 있으니 먼저 문의해 주세요.",
        },
        {
          q: "당일 예약이 가능한가요?",
          a: "당일 일정에 따라 가능할 수 있습니다. 먼저 문의해 주세요.",
        },
        {
          q: "부재중에도 청소가 가능한가요?",
          a: "조건 확인 후 가능할 수 있습니다. 사전에 상담해 주세요.",
        },
        {
          q: "당일 추가 요청이 가능한가요?",
          a: "시간 여유가 있으면 대응 가능합니다. 먼저 상담해 주세요.",
        },
      ],
      contactTitle: "문의하기",
      contactText:
        "예약 가능 여부 확인 및 견적 문의는 웹사이트 문의 폼을 통해 연락해 주세요.",
      toProductsText: "맨 위 페이지로",
    },
  },

  /* ========= フランス語 ========= */
  fr: {
    home: {
      headline: site.name,
      description:
        "Nous proposons des services de nettoyage à Nara (ville de Nara et dans toute la préfecture). Cuisine, salle de bain, pièces de vie, nettoyage de climatisation, ainsi que des formules ponctuelles ou régulières, selon vos besoins.",
    },
    stores: {
      heroTitle: `${site.name} ─ Liste des agences`,
      heroAreas: "Ville de Nara & Préfecture de Nara",
      heroLead: "Nous proposons des services de nettoyage à domicile.",
      heroTail:
        "Consultez ici les zones desservies et les informations détaillées.",
      heroIntroLine: `${site.name} propose des services de nettoyage à domicile dans la ville de Nara et la préfecture de Nara.`,
    },
    areasLocal: {
      h1: "Nettoyage à domicile à Nara",
      lead: "Nous intervenons principalement à Nara et dans l’ensemble de la préfecture de Nara. Contactez-nous pour confirmer.",
      services: [
        {
          title: "Nettoyage à domicile",
          bullets: [
            "Pièces d’eau (cuisine, salle de bain, lavabo, toilettes)",
            "Salon et chambres",
            "Fenêtres et balcons (sur demande)",
          ],
        },
        {
          title: "Nettoyage de climatisation",
          bullets: [
            "Nettoyage de climatiseurs domestiques (selon le modèle)",
            "Conseils odeurs et moisissures",
            "Plusieurs unités possibles",
          ],
        },
        {
          title: "Nettoyage déménagement / régulier",
          bullets: [
            "Avant/après déménagement (occupé ou vacant)",
            "Formules régulières (fréquence et périmètre sur demande)",
            "Nettoyage ponctuel ciblé",
          ],
        },
      ],
      coverageTitle: "Zone d’intervention",
      coverageBody:
        "Nous intervenons principalement à Nara et dans toute la préfecture de Nara. Merci de nous contacter pour confirmer la zone exacte.",
      faq: [
        {
          q: "Le devis est-il gratuit ?",
          a: "Oui. Selon le cas, une confirmation préalable peut être nécessaire. Contactez-nous d’abord.",
        },
        {
          q: "Une réservation le jour même est-elle possible ?",
          a: "Selon les disponibilités, cela peut être possible. Merci de nous contacter.",
        },
        {
          q: "Pouvez-vous intervenir en mon absence ?",
          a: "Oui, selon les conditions. Merci de nous consulter à l’avance.",
        },
        {
          q: "Puis-je ajouter des demandes le jour même ?",
          a: "Si le planning le permet, nous pouvons être flexibles. Merci de nous consulter.",
        },
      ],
      contactTitle: "Contact",
      contactText:
        "Pour vérifier nos disponibilités ou demander un devis, contactez-nous via le formulaire du site.",
      toProductsText: "Retour à la page d’accueil",
    },
  },

  /* ========= スペイン語 ========= */
  es: {
    home: {
      headline: site.name,
      description:
        "Ofrecemos servicios de limpieza del hogar en la ciudad de Nara y en toda la prefectura de Nara. Cocina, baño, estancias, limpieza de aire acondicionado y planes puntuales o regulares según sus necesidades.",
    },
    stores: {
      heroTitle: `${site.name} ─ Lista de sedes`,
      heroAreas: "Ciudad de Nara y Prefectura de Nara",
      heroLead: "Prestamos servicios de limpieza del hogar.",
      heroTail:
        "Consulte aquí el área de servicio y la información detallada.",
      heroIntroLine: `${site.name} ofrece servicios de limpieza del hogar en la ciudad de Nara y la prefectura de Nara.`,
    },
    areasLocal: {
      h1: "Limpieza del hogar en Nara",
      lead: "Cubrimos principalmente la ciudad de Nara y podemos atender toda la prefectura de Nara. Contáctenos para confirmar.",
      services: [
        {
          title: "Limpieza del hogar",
          bullets: [
            "Zonas de agua (cocina, baño, lavabo, aseo)",
            "Salón y habitaciones",
            "Ventanas y balcones (consulte detalles)",
          ],
        },
        {
          title: "Limpieza de aire acondicionado",
          bullets: [
            "Limpieza de A/C doméstico (según el modelo)",
            "Consultas por olor y moho",
            "Se admiten varias unidades",
          ],
        },
        {
          title: "Mudanza / limpieza periódica",
          bullets: [
            "Limpieza antes/después de mudanza (ocupado o vacío)",
            "Planes periódicos (frecuencia y alcance a consultar)",
            "Limpieza puntual por zonas",
          ],
        },
      ],
      coverageTitle: "Área de servicio",
      coverageBody:
        "Atendemos principalmente la ciudad de Nara y la prefectura de Nara. Consulte para confirmar cobertura.",
      faq: [
        {
          q: "¿El presupuesto es gratuito?",
          a: "Sí. En algunos casos puede requerirse confirmación previa. Contáctenos primero.",
        },
        {
          q: "¿Se puede reservar para el mismo día?",
          a: "Según disponibilidad, puede ser posible. Contáctenos.",
        },
        {
          q: "¿Pueden venir cuando no estoy en casa?",
          a: "Sí, según condiciones. Consulte con antelación.",
        },
        {
          q: "¿Puedo añadir tareas el mismo día?",
          a: "Si el horario lo permite, podemos ser flexibles. Consúltenos.",
        },
      ],
      contactTitle: "Contacto",
      contactText:
        "Para comprobar disponibilidad o solicitar presupuesto, contáctenos mediante el formulario del sitio.",
      toProductsText: "Volver a la página principal",
    },
  },

  /* ========= ドイツ語 ========= */
  de: {
    home: {
      headline: site.name,
      description:
        "Wir bieten Haushaltsreinigung in Nara (Stadt Nara und gesamte Präfektur Nara) an. Von Küche und Bad über Wohnräume bis hin zur Klimaanlagenreinigung sowie einmaligen oder regelmäßigen Plänen – passend zu Ihren Bedürfnissen.",
    },
    stores: {
      heroTitle: `${site.name} ─ Standorte`,
      heroAreas: "Stadt Nara & Präfektur Nara",
      heroLead: "Wir bieten professionelle Haushaltsreinigung an.",
      heroTail:
        "Hier finden Sie Informationen zu Einsatzgebiet und Details.",
      heroIntroLine: `${site.name} bietet Haushaltsreinigung in der Stadt Nara und der Präfektur Nara an.`,
    },
    areasLocal: {
      h1: "Haushaltsreinigung in Nara",
      lead: "Wir bedienen hauptsächlich Nara und können die gesamte Präfektur Nara unterstützen. Bitte kontaktieren Sie uns zur Bestätigung.",
      services: [
        {
          title: "Haushaltsreinigung",
          bullets: [
            "Nassbereiche (Küche, Bad, Waschbecken, WC)",
            "Wohnzimmer und Schlafzimmer",
            "Fenster und Balkone (Details auf Anfrage)",
          ],
        },
        {
          title: "Klimaanlagenreinigung",
          bullets: [
            "Reinigung von Haushalts-Klimaanlagen (je nach Modell)",
            "Beratung zu Gerüchen und Schimmel",
            "Mehrere Geräte möglich",
          ],
        },
        {
          title: "Umzug / regelmäßige Reinigung",
          bullets: [
            "Reinigung vor/nach Umzug (bewohnt oder leer)",
            "Regelmäßige Pläne (Frequenz/Umfang auf Anfrage)",
            "Gezielte Spot-Reinigung",
          ],
        },
      ],
      coverageTitle: "Einsatzgebiet",
      coverageBody:
        "Wir bedienen hauptsächlich die Stadt Nara und die Präfektur Nara. Bitte kontaktieren Sie uns zur Bestätigung.",
      faq: [
        {
          q: "Ist der Kostenvoranschlag kostenlos?",
          a: "Ja. Je nach Fall kann eine Vorabklärung erforderlich sein. Bitte kontaktieren Sie uns zuerst.",
        },
        {
          q: "Ist eine Buchung am selben Tag möglich?",
          a: "Je nach Verfügbarkeit kann dies möglich sein. Bitte kontaktieren Sie uns.",
        },
        {
          q: "Können Sie reinigen, wenn ich nicht zu Hause bin?",
          a: "Ja, je nach Bedingungen. Bitte vorher anfragen.",
        },
        {
          q: "Kann ich am selben Tag zusätzliche Arbeiten anfragen?",
          a: "Wenn der Zeitplan es erlaubt, sind wir flexibel. Bitte kontaktieren Sie uns.",
        },
      ],
      contactTitle: "Kontakt",
      contactText:
        "Für Verfügbarkeit oder Angebot nutzen Sie bitte das Kontaktformular auf der Website.",
      toProductsText: "Zur Startseite",
    },
  },

  /* ========= ポルトガル語 ========= */
  pt: {
    home: {
      headline: site.name,
      description:
        "Oferecemos serviços de limpeza residencial na cidade de Nara e em toda a província de Nara. Cozinha, banheiro, áreas comuns, limpeza de ar-condicionado e planos avulsos ou regulares conforme suas necessidades.",
    },
    stores: {
      heroTitle: `${site.name} ─ Unidades`,
      heroAreas: "Cidade de Nara & Província de Nara",
      heroLead: "Prestamos serviços de limpeza residencial.",
      heroTail:
        "Confira aqui as áreas atendidas e informações detalhadas.",
      heroIntroLine: `${site.name} oferece serviços de limpeza residencial na cidade de Nara e na província de Nara.`,
    },
    areasLocal: {
      h1: "Limpeza residencial em Nara",
      lead: "Atendemos principalmente a cidade de Nara e podemos apoiar toda a província de Nara. Entre em contato para confirmar.",
      services: [
        {
          title: "Limpeza residencial",
          bullets: [
            "Áreas molhadas (cozinha, banheiro, lavatório, toalete)",
            "Sala e quartos",
            "Janelas e varandas (consulte detalhes)",
          ],
        },
        {
          title: "Limpeza de ar-condicionado",
          bullets: [
            "Limpeza de A/C doméstico (varia por modelo)",
            "Consultas sobre odor e mofo",
            "Suporte para várias unidades",
          ],
        },
        {
          title: "Mudança / limpeza regular",
          bullets: [
            "Limpeza antes/depois de mudança (ocupado ou vazio)",
            "Planos regulares (frequência e escopo sob consulta)",
            "Limpeza pontual (áreas específicas)",
          ],
        },
      ],
      coverageTitle: "Área de atendimento",
      coverageBody:
        "Atendemos principalmente a cidade de Nara e a província de Nara. Consulte para confirmar a cobertura.",
      faq: [
        {
          q: "O orçamento é gratuito?",
          a: "Sim. Em alguns casos pode ser necessária confirmação prévia. Entre em contato primeiro.",
        },
        {
          q: "É possível agendar para o mesmo dia?",
          a: "Dependendo da disponibilidade, pode ser possível. Entre em contato.",
        },
        {
          q: "Vocês podem limpar enquanto eu não estiver em casa?",
          a: "Sim, dependendo das condições. Consulte com antecedência.",
        },
        {
          q: "Posso pedir tarefas extras no mesmo dia?",
          a: "Se o horário permitir, podemos ser flexíveis. Consulte-nos.",
        },
      ],
      contactTitle: "Fale conosco",
      contactText:
        "Para verificar disponibilidade ou solicitar orçamento, use o formulário de contato do site.",
      toProductsText: "Voltar à página inicial",
    },
  },

  /* ========= イタリア語 ========= */
  it: {
    home: {
      headline: site.name,
      description:
        "Offriamo servizi di pulizia domestica nella città di Nara e in tutta la prefettura di Nara. Cucina, bagno, ambienti living, pulizia del condizionatore e piani singoli o regolari in base alle esigenze.",
    },
    stores: {
      heroTitle: `${site.name} ─ Elenco sedi`,
      heroAreas: "Città di Nara & Prefettura di Nara",
      heroLead: "Forniamo servizi di pulizia domestica.",
      heroTail:
        "Qui puoi verificare le aree servite e i dettagli.",
      heroIntroLine: `${site.name} offre servizi di pulizia domestica nella città di Nara e nella prefettura di Nara.`,
    },
    areasLocal: {
      h1: "Pulizie domestiche a Nara",
      lead: "Serviamo principalmente la città di Nara e possiamo supportare l’intera prefettura di Nara. Contattaci per confermare.",
      services: [
        {
          title: "Pulizia della casa",
          bullets: [
            "Zone umide (cucina, bagno, lavabo, WC)",
            "Soggiorno e camere",
            "Finestre e balconi (dettagli su richiesta)",
          ],
        },
        {
          title: "Pulizia del climatizzatore",
          bullets: [
            "Pulizia A/C domestici (varia per modello)",
            "Consulenze su odori e muffe",
            "Supporto per più unità",
          ],
        },
        {
          title: "Trasloco / pulizia regolare",
          bullets: [
            "Pulizie prima/dopo il trasloco (abitato o vuoto)",
            "Piani regolari (frequenza e perimetro su richiesta)",
            "Pulizie spot (solo aree specifiche)",
          ],
        },
      ],
      coverageTitle: "Area di servizio",
      coverageBody:
        "Serviamo principalmente la città di Nara e la prefettura di Nara. Contattaci per confermare la copertura.",
      faq: [
        {
          q: "Il preventivo è gratuito?",
          a: "Sì. In alcuni casi può essere necessaria una verifica preliminare. Contattaci prima.",
        },
        {
          q: "È possibile prenotare per lo stesso giorno?",
          a: "A seconda della disponibilità può essere possibile. Contattaci.",
        },
        {
          q: "Potete intervenire quando non sono a casa?",
          a: "Sì, a seconda delle condizioni. Contattaci in anticipo.",
        },
        {
          q: "Posso aggiungere richieste lo stesso giorno?",
          a: "Se il programma lo consente, possiamo essere flessibili. Contattaci.",
        },
      ],
      contactTitle: "Contattaci",
      contactText:
        "Per verificare la disponibilità o richiedere un preventivo, usa il modulo di contatto del sito.",
      toProductsText: "Torna alla pagina iniziale",
    },
  },

  /* ========= ロシア語 ========= */
  ru: {
    home: {
      headline: site.name,
      description:
        "Мы предоставляем услуги по уборке в городе Нара и по всей префектуре Нара. Кухня, ванная, жилые комнаты, чистка кондиционеров, а также разовые и регулярные планы — под ваши задачи.",
    },
    stores: {
      heroTitle: `${site.name} ─ Список филиалов`,
      heroAreas: "Город Нара и префектура Нара",
      heroLead: "Мы предоставляем услуги по уборке.",
      heroTail:
        "Здесь вы можете узнать зоны обслуживания и подробности.",
      heroIntroLine: `${site.name} оказывает услуги по уборке в городе Нара и префектуре Нара.`,
    },
    areasLocal: {
      h1: "Уборка в городе Нара",
      lead: "Мы работаем главным образом в городе Нара и можем поддержать всю префектуру Нара. Свяжитесь с нами для уточнения.",
      services: [
        {
          title: "Уборка дома",
          bullets: [
            "Влажные зоны (кухня, ванная, умывальник, туалет)",
            "Гостиная и спальни",
            "Окна и балконы (уточняйте детали)",
          ],
        },
        {
          title: "Чистка кондиционеров",
          bullets: [
            "Чистка бытовых кондиционеров (зависит от модели)",
            "Консультации по запахам и плесени",
            "Поддержка нескольких устройств",
          ],
        },
        {
          title: "Переезд / регулярная уборка",
          bullets: [
            "Уборка до/после переезда (жилое/пустое помещение)",
            "Регулярные планы (частота и объем по запросу)",
            "Точечная уборка (отдельные зоны)",
          ],
        },
      ],
      coverageTitle: "Зона обслуживания",
      coverageBody:
        "Мы работаем главным образом в городе Нара и в префектуре Нара. Свяжитесь с нами, чтобы уточнить покрытие.",
      faq: [
        {
          q: "Смета бесплатна?",
          a: "Да. В некоторых случаях требуется предварительное уточнение. Свяжитесь с нами.",
        },
        {
          q: "Возможна ли запись на тот же день?",
          a: "В зависимости от загруженности может быть возможно. Пожалуйста, уточните.",
        },
        {
          q: "Можно ли провести уборку, если меня нет дома?",
          a: "Да, в зависимости от условий. Пожалуйста, обсудите заранее.",
        },
        {
          q: "Можно ли добавить задачи в день уборки?",
          a: "Если расписание позволяет, мы постараемся помочь. Свяжитесь с нами.",
        },
      ],
      contactTitle: "Связаться с нами",
      contactText:
        "Чтобы узнать о доступности или запросить стоимость, используйте форму на сайте.",
      toProductsText: "Вернуться на главную страницу",
    },
  },

  /* ========= タイ語 ========= */
  th: {
    home: {
      headline: site.name,
      description:
        "เราให้บริการทำความสะอาดบ้านในเมืองนาระและทั่วจังหวัดนาระ ตั้งแต่ห้องครัว ห้องน้ำ ไปจนถึงพื้นที่อยู่อาศัย รวมถึงทำความสะอาดแอร์ และแพ็กเกจรายครั้ง/รายเดือนตามความต้องการ.",
    },
    stores: {
      heroTitle: `${site.name} ─ รายชื่อสาขา`,
      heroAreas: "เมืองนาระ・จังหวัดนาระ",
      heroLead: "ให้บริการทำความสะอาดบ้าน.",
      heroTail:
        "ตรวจสอบพื้นที่ให้บริการและรายละเอียดได้จากหน้านี้.",
      heroIntroLine: `${site.name} ให้บริการทำความสะอาดบ้านในเมืองนาระและทั่วจังหวัดนาระ.`,
    },
    areasLocal: {
      h1: "ทำความสะอาดบ้านในเมืองนาระ",
      lead: "ให้บริการหลักในเมืองนาระ และสามารถรองรับทั่วจังหวัดนาระ โปรดติดต่อเพื่อยืนยันพื้นที่.",
      services: [
        {
          title: "ทำความสะอาดบ้าน",
          bullets: [
            "บริเวณเปียกน้ำ (ครัว ห้องน้ำ อ่างล้างหน้า ห้องสุขา)",
            "ห้องนั่งเล่นและห้องนอน",
            "หน้าต่างและระเบียง (โปรดสอบถามรายละเอียด)",
          ],
        },
        {
          title: "ทำความสะอาดเครื่องปรับอากาศ",
          bullets: [
            "ทำความสะอาดแอร์บ้าน (ขึ้นอยู่กับรุ่น)",
            "ปรึกษาเรื่องกลิ่นและเชื้อรา",
            "รองรับหลายเครื่อง",
          ],
        },
        {
          title: "ทำความสะอาดก่อน/หลังย้ายบ้าน & แบบประจำ",
          bullets: [
            "ก่อน/หลังย้ายบ้าน (มีคนอยู่หรือห้องว่าง)",
            "แพ็กเกจแบบประจำ (ความถี่และขอบเขตตามตกลง)",
            "ทำความสะอาดเฉพาะจุด",
          ],
        },
      ],
      coverageTitle: "พื้นที่ให้บริการ",
      coverageBody:
        "ให้บริการหลักในเมืองนาระ และทั่วจังหวัดนาระ โปรดติดต่อเพื่อยืนยันพื้นที่ให้บริการ.",
      faq: [
        {
          q: "ประเมินราคาฟรีไหม?",
          a: "ฟรี ในบางกรณีอาจต้องตรวจสอบรายละเอียดล่วงหน้า โปรดติดต่อเรา.",
        },
        {
          q: "จองงานวันเดียวกันได้ไหม?",
          a: "ขึ้นอยู่กับตารางงาน อาจเป็นไปได้ โปรดติดต่อเรา.",
        },
        {
          q: "ทำความสะอาดตอนที่ไม่อยู่บ้านได้ไหม?",
          a: "ได้ ขึ้นอยู่กับเงื่อนไข โปรดปรึกษาล่วงหน้า.",
        },
        {
          q: "ขอเพิ่มงานในวันเดียวกันได้ไหม?",
          a: "หากตารางเวลาว่าง เราจะพยายามช่วย โปรดติดต่อเรา.",
        },
      ],
      contactTitle: "ติดต่อเรา",
      contactText:
        "ตรวจสอบคิวว่างหรือขอใบเสนอราคาได้ผ่านแบบฟอร์มติดต่อบนเว็บไซต์.",
      toProductsText: "กลับไปหน้าหลัก",
    },
  },

  /* ========= ベトナム語 ========= */
  vi: {
    home: {
      headline: site.name,
      description:
        "Chúng tôi cung cấp dịch vụ vệ sinh nhà ở tại thành phố Nara và toàn tỉnh Nara. Từ bếp, phòng tắm đến không gian sinh hoạt, vệ sinh điều hòa và các gói lẻ/định kỳ theo nhu cầu.",
    },
    stores: {
      heroTitle: `${site.name} ─ Danh sách cơ sở`,
      heroAreas: "Thành phố Nara & Tỉnh Nara",
      heroLead: "Cung cấp dịch vụ vệ sinh nhà ở.",
      heroTail:
        "Xem khu vực phục vụ và thông tin chi tiết tại trang này.",
      heroIntroLine: `${site.name} cung cấp dịch vụ vệ sinh nhà ở tại thành phố Nara và tỉnh Nara.`,
    },
    areasLocal: {
      h1: "Vệ sinh nhà ở tại thành phố Nara",
      lead: "Chúng tôi phục vụ chủ yếu ở thành phố Nara và có thể hỗ trợ toàn tỉnh Nara. Vui lòng liên hệ để xác nhận.",
      services: [
        {
          title: "Vệ sinh nhà ở",
          bullets: [
            "Khu vực ướt (bếp, phòng tắm, bồn rửa, nhà vệ sinh)",
            "Phòng khách và phòng ngủ",
            "Cửa sổ và ban công (liên hệ để biết chi tiết)",
          ],
        },
        {
          title: "Vệ sinh điều hòa",
          bullets: [
            "Vệ sinh điều hòa gia đình (tùy theo mẫu máy)",
            "Tư vấn mùi và nấm mốc",
            "Hỗ trợ nhiều máy",
          ],
        },
        {
          title: "Chuyển nhà / vệ sinh định kỳ",
          bullets: [
            "Vệ sinh trước/sau chuyển nhà (có người ở hoặc nhà trống)",
            "Gói định kỳ (tần suất/phạm vi theo yêu cầu)",
            "Vệ sinh theo điểm (khu vực cụ thể)",
          ],
        },
      ],
      coverageTitle: "Khu vực phục vụ",
      coverageBody:
        "Chúng tôi phục vụ chủ yếu ở thành phố Nara và toàn tỉnh Nara. Vui lòng liên hệ để xác nhận khu vực.",
      faq: [
        {
          q: "Báo giá có miễn phí không?",
          a: "Có. Trong một số trường hợp cần xác nhận trước. Vui lòng liên hệ.",
        },
        {
          q: "Có thể đặt trong ngày không?",
          a: "Tùy lịch trống có thể được. Vui lòng liên hệ.",
        },
        {
          q: "Có thể dọn khi tôi không có ở nhà không?",
          a: "Có, tùy theo điều kiện. Vui lòng trao đổi trước.",
        },
        {
          q: "Có thể thêm việc trong ngày không?",
          a: "Nếu lịch cho phép, chúng tôi sẽ hỗ trợ. Vui lòng liên hệ.",
        },
      ],
      contactTitle: "Liên hệ",
      contactText:
        "Để kiểm tra lịch trống hoặc yêu cầu báo giá, hãy dùng mẫu liên hệ trên website.",
      toProductsText: "Quay lại trang chủ",
    },
  },

  /* ========= インドネシア語 ========= */
  id: {
    home: {
      headline: site.name,
      description:
        "Kami menyediakan layanan pembersihan rumah di Kota Nara dan seluruh Prefektur Nara. Mulai dari dapur, kamar mandi, ruang keluarga, pembersihan AC, hingga paket sekali atau rutin sesuai kebutuhan.",
    },
    stores: {
      heroTitle: `${site.name} ─ Daftar cabang`,
      heroAreas: "Kota Nara & Prefektur Nara",
      heroLead: "Menyediakan layanan pembersihan rumah.",
      heroTail:
        "Silakan cek area layanan dan detail di halaman ini.",
      heroIntroLine: `${site.name} menyediakan layanan pembersihan rumah di Kota Nara dan Prefektur Nara.`,
    },
    areasLocal: {
      h1: "Pembersihan rumah di Kota Nara",
      lead: "Kami melayani terutama di Kota Nara dan dapat mendukung seluruh Prefektur Nara. Hubungi kami untuk konfirmasi.",
      services: [
        {
          title: "Pembersihan rumah",
          bullets: [
            "Area basah (dapur, kamar mandi, wastafel, toilet)",
            "Ruang keluarga dan kamar tidur",
            "Jendela dan balkon (silakan tanyakan detail)",
          ],
        },
        {
          title: "Pembersihan AC",
          bullets: [
            "Pembersihan AC rumah (tergantung model)",
            "Konsultasi bau dan jamur",
            "Mendukung banyak unit",
          ],
        },
        {
          title: "Pindahan / pembersihan rutin",
          bullets: [
            "Pembersihan sebelum/sesudah pindahan (berpenghuni atau kosong)",
            "Paket rutin (frekuensi & cakupan sesuai permintaan)",
            "Pembersihan spot (area tertentu)",
          ],
        },
      ],
      coverageTitle: "Area layanan",
      coverageBody:
        "Kami melayani terutama Kota Nara dan Prefektur Nara. Silakan hubungi untuk konfirmasi cakupan.",
      faq: [
        {
          q: "Apakah estimasi gratis?",
          a: "Ya. Dalam beberapa kasus diperlukan konfirmasi sebelumnya. Silakan hubungi kami.",
        },
        {
          q: "Apakah bisa memesan di hari yang sama?",
          a: "Tergantung ketersediaan, bisa saja. Silakan hubungi kami.",
        },
        {
          q: "Apakah bisa dibersihkan saat saya tidak di rumah?",
          a: "Bisa, tergantung kondisi. Silakan konsultasikan terlebih dahulu.",
        },
        {
          q: "Apakah bisa menambah pekerjaan di hari yang sama?",
          a: "Jika jadwal memungkinkan, kami akan membantu. Silakan hubungi kami.",
        },
      ],
      contactTitle: "Hubungi kami",
      contactText:
        "Untuk mengecek ketersediaan atau meminta estimasi, gunakan formulir kontak di situs.",
      toProductsText: "Kembali ke halaman utama",
    },
  },

  /* ========= ヒンディー語 ========= */
  hi: {
    home: {
      headline: site.name,
      description:
        "हम नारा शहर और नारा प्रांत में हाउस क्लीनिंग सेवाएँ प्रदान करते हैं। किचन, बाथरूम, रहने की जगह, ए/सी क्लीनिंग तथा एक बार/नियमित प्लान—आपकी जरूरत के अनुसार।",
    },
    stores: {
      heroTitle: `${site.name} ─ शाखाओं की सूची`,
      heroAreas: "नारा शहर और नारा प्रांत",
      heroLead: "हम हाउस क्लीनिंग सेवाएँ प्रदान करते हैं।",
      heroTail:
        "सेवा क्षेत्र और विवरण आप इस पेज पर देख सकते हैं।",
      heroIntroLine: `${site.name} नारा शहर और नारा प्रांत में हाउस क्लीनिंग सेवाएँ प्रदान करता है।`,
    },
    areasLocal: {
      h1: "नारा शहर में हाउस क्लीनिंग",
      lead: "हम मुख्य रूप से नारा शहर में सेवा देते हैं और पूरे नारा प्रांत में समर्थन कर सकते हैं। कृपया संपर्क करें।",
      services: [
        {
          title: "हाउस क्लीनिंग",
          bullets: [
            "वेट एरिया (किचन, बाथरूम, वॉशबेसिन, टॉयलेट)",
            "लिविंग रूम और बेडरूम",
            "खिड़कियाँ और बालकनी (विवरण के लिए पूछें)",
          ],
        },
        {
          title: "ए/सी क्लीनिंग",
          bullets: [
            "घरेलू ए/सी क्लीनिंग (मॉडल के अनुसार)",
            "गंध/फफूंदी पर परामर्श",
            "एक से अधिक यूनिट संभव",
          ],
        },
        {
          title: "शिफ्टिंग / नियमित सफाई",
          bullets: [
            "शिफ्टिंग से पहले/बाद सफाई (रह रहा/खाली)",
            "नियमित प्लान (फ्रीक्वेंसी/स्कोप परामर्श)",
            "स्पॉट क्लीनिंग (निर्धारित हिस्से)",
          ],
        },
      ],
      coverageTitle: "सेवा क्षेत्र",
      coverageBody:
        "हम मुख्य रूप से नारा शहर और नारा प्रांत में सेवा देते हैं। कृपया कवरेज की पुष्टि के लिए संपर्क करें।",
      faq: [
        {
          q: "क्या अनुमान (कोट) मुफ्त है?",
          a: "हाँ। कुछ मामलों में पहले से पुष्टि आवश्यक हो सकती है। कृपया संपर्क करें।",
        },
        {
          q: "क्या उसी दिन बुकिंग संभव है?",
          a: "उपलब्धता पर निर्भर करता है। कृपया संपर्क करें।",
        },
        {
          q: "क्या मेरी गैर-मौजूदगी में सफाई संभव है?",
          a: "हाँ, शर्तों पर निर्भर करता है। कृपया पहले से सलाह करें।",
        },
        {
          q: "क्या उसी दिन अतिरिक्त काम जोड़ सकते हैं?",
          a: "यदि शेड्यूल अनुमति दे, तो हम मदद करेंगे। कृपया संपर्क करें।",
        },
      ],
      contactTitle: "संपर्क करें",
      contactText:
        "उपलब्धता जाँचने या कोट के लिए, वेबसाइट के संपर्क फॉर्म का उपयोग करें।",
      toProductsText: "टॉप पेज पर लौटें",
    },
  },

  /* ========= アラビア語 ========= */
  ar: {
    home: {
      headline: site.name,
      description:
        "نقدّم خدمات تنظيف المنازل في مدينة نارا وفي جميع أنحاء محافظة نارا. من المطبخ والحمّام إلى غرف المعيشة، إضافة إلى تنظيف المكيّف وخطط التنظيف لمرة واحدة أو بشكل دوري حسب احتياجاتك.",
    },
    stores: {
      heroTitle: `${site.name} ─ قائمة الفروع`,
      heroAreas: "مدينة نارا ومحافظة نارا",
      heroLead: "نقدّم خدمات تنظيف المنازل.",
      heroTail:
        "يمكنك الاطّلاع على منطقة الخدمة والتفاصيل هنا.",
      heroIntroLine: `${site.name} يقدّم خدمات تنظيف المنازل في مدينة نارا ومحافظة نارا.`,
    },
    areasLocal: {
      h1: "تنظيف المنازل في مدينة نارا",
      lead: "نخدم بشكل أساسي مدينة نارا ويمكننا دعم محافظة نارا بالكامل. تواصل معنا للتأكيد.",
      services: [
        {
          title: "تنظيف المنازل",
          bullets: [
            "المناطق الرطبة (المطبخ، الحمّام، حوض الغسيل، دورة المياه)",
            "غرفة المعيشة وغرف النوم",
            "النوافذ والشرفات (يرجى الاستفسار عن التفاصيل)",
          ],
        },
        {
          title: "تنظيف المكيّف",
          bullets: [
            "تنظيف مكيّفات منزلية (يختلف حسب الجهاز)",
            "استشارات الروائح والعفن",
            "دعم عدة أجهزة",
          ],
        },
        {
          title: "تنظيف الانتقال / تنظيف دوري",
          bullets: [
            "تنظيف قبل/بعد الانتقال (سكن/فارغ)",
            "خطط دورية (التكرار والنطاق حسب الطلب)",
            "تنظيف موضعي (مناطق محددة)",
          ],
        },
      ],
      coverageTitle: "منطقة الخدمة",
      coverageBody:
        "نخدم بشكل أساسي مدينة نارا ومحافظة نارا. يرجى التواصل لتأكيد التغطية.",
      faq: [
        {
          q: "هل التسعيرة مجانية؟",
          a: "نعم. قد نحتاج أحيانًا إلى تأكيد التفاصيل مسبقًا. تواصل معنا أولًا.",
        },
        {
          q: "هل يمكن الحجز في نفس اليوم؟",
          a: "حسب توفر الوقت قد يكون ممكنًا. تواصل معنا.",
        },
        {
          q: "هل يمكنكم التنظيف أثناء غيابي؟",
          a: "نعم حسب الشروط. يرجى الاستفسار مسبقًا.",
        },
        {
          q: "هل يمكن إضافة طلبات في نفس اليوم؟",
          a: "إذا سمح الجدول، سنحاول المساعدة. تواصل معنا.",
        },
      ],
      contactTitle: "اتصل بنا",
      contactText:
        "للتحقق من المواعيد أو طلب عرض سعر، استخدم نموذج التواصل على الموقع.",
      toProductsText: "العودة إلى الصفحة الرئيسية",
    },
  },
};

/* =========================
   Footer L10N（サイト名は自動追従）
========================= */
function footerAlt(name: string) {
  return name || "Official Website";
}

/** Footer の多言語テキスト */
export const FOOTER_STRINGS: Record<string, FooterI18n> = {
  ja: {
    cta: "無料相談・お問い合わせ",
    snsAria: "SNSリンク",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "公式サイト",
    siteAlt: site.name,
    areaLinkText: "奈良市のハウスクリーニング",
    rights: "All rights reserved.",
  },
  en: {
    cta: "Contact us",
    snsAria: "Social links",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Official website",
    siteAlt: footerAlt(site.name),
    areaLinkText: "House cleaning in Nara City",
    rights: "All rights reserved.",
  },
  zh: {
    cta: "免费咨询・联系",
    snsAria: "社交链接",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "官网",
    siteAlt: footerAlt(site.name),
    areaLinkText: "奈良市的居家清洁",
    rights: "版权所有。",
  },
  "zh-TW": {
    cta: "免費諮詢・聯絡我們",
    snsAria: "社群連結",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "官方網站",
    siteAlt: footerAlt(site.name),
    areaLinkText: "奈良市的居家清潔",
    rights: "版權所有。",
  },
  ko: {
    cta: "문의하기",
    snsAria: "SNS 링크",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "공식 사이트",
    siteAlt: footerAlt(site.name),
    areaLinkText: "나라시 하우스 클리닝",
    rights: "판권 소유.",
  },
  fr: {
    cta: "Nous contacter",
    snsAria: "Liens sociaux",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Site officiel",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Nettoyage à domicile à Nara",
    rights: "Tous droits réservés.",
  },
  es: {
    cta: "Contáctanos",
    snsAria: "Enlaces sociales",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Sitio oficial",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Limpieza del hogar en Nara",
    rights: "Todos los derechos reservados.",
  },
  de: {
    cta: "Kontakt",
    snsAria: "Soziale Links",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Offizielle Website",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Haushaltsreinigung in Nara",
    rights: "Alle Rechte vorbehalten.",
  },
  pt: {
    cta: "Fale conosco",
    snsAria: "Redes sociais",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Site oficial",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Limpeza residencial em Nara",
    rights: "Todos os direitos reservados.",
  },
  it: {
    cta: "Contattaci",
    snsAria: "Link social",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Sito ufficiale",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Pulizie domestiche a Nara",
    rights: "Tutti i diritti riservati.",
  },
  ru: {
    cta: "Связаться с нами",
    snsAria: "Ссылки на соцсети",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Официальный сайт",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Уборка в городе Нара",
    rights: "Все права защищены.",
  },
  th: {
    cta: "ติดต่อเรา",
    snsAria: "ลิงก์โซเชียล",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "เว็บไซต์ทางการ",
    siteAlt: footerAlt(site.name),
    areaLinkText: "ทำความสะอาดบ้านในเมืองนาระ",
    rights: "สงวนลิขสิทธิ์",
  },
  vi: {
    cta: "Liên hệ",
    snsAria: "Liên kết mạng xã hội",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Trang chính thức",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Vệ sinh nhà ở tại thành phố Nara",
    rights: "Mọi quyền được bảo lưu.",
  },
  id: {
    cta: "Hubungi kami",
    snsAria: "Tautan sosial",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "Situs resmi",
    siteAlt: footerAlt(site.name),
    areaLinkText: "Pembersihan rumah di Kota Nara",
    rights: "Hak cipta dilindungi.",
  },
  hi: {
    cta: "संपर्क करें",
    snsAria: "सोशल लिंक",
    instagramAlt: "Instagram",
    lineAlt: "LINE",
    siteAria: "आधिकारिक वेबसाइट",
    siteAlt: footerAlt(site.name),
    areaLinkText: "नारा शहर में हाउस क्लीनिंग",
    rights: "सर्वाधिकार सुरक्षित।",
  },
  ar: {
    cta: "اتصل بنا",
    snsAria: "روابط التواصل الاجتماعي",
    instagramAlt: "إنستغرام",
    lineAlt: "لاين",
    siteAria: "الموقع الرسمي",
    siteAlt: footerAlt(site.name) as unknown as string,
    areaLinkText: "تنظيف المنازل في مدينة نارا",
    rights: "جميع الحقوق محفوظة.",
  },
};

/* =========================
   FAQ データ（ここで集約管理）
========================= */
export const faqItems: FaqItem[] = [
  {
    question: "対応エリアはどこですか？",
    answer:
      "奈良市を中心に奈良県全域対応です。まずはお気軽にご相談ください。",
  },
  {
    question: "見積もりは無料ですか？",
    answer:
      "はい、無料です。内容により事前確認が必要な場合がありますので、まずはお問い合わせください。",
  },
  {
    question: "支払い方法は？",
    answer:
      "現金・銀行振込などに対応しています。詳細はご相談ください。",
  },
  {
    question: "当日の追加依頼や延長は可能ですか？",
    answer:
      "当日のスケジュール次第ですが、可能な限り柔軟に対応いたします。まずはご相談ください。",
  },
  {
    question: "キャンセル料はかかりますか？",
    answer:
      "キャンセル規定はご予約時にご案内します。日程変更も含め、まずはお早めにご連絡ください。",
  },
];

/* =========================
   ページ辞書（ogImage は任意）
========================= */
const PAGES = {
  home: {
    path: "/",
    title: `${site.name}｜ハウスクリーニング（奈良市・奈良県）`,
    description:
      "奈良市を中心に奈良県全域対応のハウスクリーニング。水回り・リビング・エアコン・定期清掃まで安心価格で丁寧に対応。まずはお気軽にご相談ください。",
    ogType: "website",
  },
  about: {
    path: "/about",
    title: `私たちの想い｜${site.name}`,
    description:
      "奈良市を中心に奈良県全域対応。丁寧さと分かりやすい提案で、快適で清潔な空間づくりをサポートします。",
    ogType: "website",
  },
  news: {
    path: "/news",
    title: `お知らせ｜${site.name}`,
    description: `${site.name} の最新情報・キャンペーン・営業時間などのお知らせ。`,
    ogType: "website",
  },
  areasLocal: {
    path: "/areas/local",
    title: `奈良市のハウスクリーニング｜${site.name}`,
    description:
      "奈良市でハウスクリーニング。キッチン/浴室/トイレ/エアコンから定期清掃まで、必要に合わせて丁寧に対応します。",
    ogType: "article",
  },
  products: {
    path: "/products",
    title: `サービス一覧｜${site.name}`,
    description: `${site.name}のサービス一覧。水回り清掃、エアコンクリーニング、定期・スポット清掃などを掲載。`,
    ogType: "website",
    ogImage: "/ogp-products.jpg",
  },
  productsEC: {
    path: "/products-ec",
    title: `サービス一覧（オンライン予約）｜${site.name}`,
    description: `${site.name}のサービス一覧（オンライン予約対応）。水回り・キッチン・浴室など、必要に合わせて丁寧に実施します。`,
    ogType: "website",
    ogImage: "/ogp-products.jpg",
  },
  projects: {
    path: "/projects",
    title: `サービス一覧｜${site.name}`,
    description: `${site.name}のサービス紹介ページ。水回り清掃、リビング清掃、エアコンクリーニングなどを掲載。`,
    ogType: "website",
  },
  stores: {
    path: "/stores",
    title: `店舗一覧｜${site.name}`,
    description: `${site.name}の店舗一覧ページ。奈良市を中心に奈良県全域対応の拠点情報をご紹介します。`,
    ogType: "website",
  },
  faq: {
    path: "/faq",
    title: `よくある質問（FAQ）｜${site.name}`,
    description: `料金・対応エリア・キャンセル・支払い方法など、${site.name}のハウスクリーニングに関するよくある質問。`,
    ogType: "article",
  },
} as const;

export type PageKey = keyof typeof PAGES;
const pages: Record<PageKey, PageDef> = PAGES as unknown as Record<
  PageKey,
  PageDef
>;

/* =========================
   SEO メタデータビルダー
========================= */
export const seo = {
  base: (): Metadata => ({
    title: `${site.name}｜${site.tagline}`,
    description: site.description,
    keywords: Array.from(site.keywords),
    authors: [{ name: site.name }],
    metadataBase: METADATA_BASE_SAFE,
    alternates: { canonical: pageUrl("/") },

    verification: site.googleSiteVerification
      ? { google: site.googleSiteVerification }
      : undefined,

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-snippet": -1,
        "max-image-preview": "large",
        "max-video-preview": -1,
      },
    },

    openGraph: {
      title: `${site.name}｜${site.tagline}`,
      description: site.description,
      url: pageUrl("/"),
      siteName: site.name,
      type: "website",
      images: [
        {
          url: pageUrl(site.logoPath),
          width: 1200,
          height: 630,
          alt: `${site.name} OGP`,
        },
      ],
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: `${site.name}｜${site.tagline}`,
      description: site.description,
      images: [pageUrl(site.logoPath)],
    },
    icons: {
      icon: [
        { url: "/favicon.ico?v=4" },
        { url: "/icon.png", type: "image/png", sizes: "any" },
      ],
      apple: "/icon.png",
      shortcut: "/favicon.ico?v=4",
    },
  }),

  page: (key: PageKey, extra?: Partial<Metadata>): Metadata => {
    const p = pages[key];
    return {
      title: p.title,
      description: p.description,
      keywords: Array.from(site.keywords),
      alternates: { canonical: pageUrl(p.path) },
      openGraph: {
        title: p.title,
        description: p.description,
        url: pageUrl(p.path),
        siteName: site.name,
        images: [
          {
            url: ogImage((p as any).ogImage),
            width: 1200,
            height: 630,
            alt: site.name,
          },
        ],
        locale: "ja_JP",
        type: p.ogType,
      },
      twitter: {
        card: "summary_large_image",
        title: p.title,
        description: p.description,
        images: [ogImage((p as any).ogImage)],
      },
      ...extra,
    };
  },
};

/* =========================
   FAQ → JSON-LD 変換
========================= */
export type QA = { q: string; a: string };
export function faqToJsonLd(faq: ReadonlyArray<QA>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };
}

/* =========================
   AI サイト設定（ブランド名/URLは site に追従）
========================= */
export const AI_SITE: AiSiteConfig = {
  brand: site.name,
  url: site.baseUrl,
  areasByLang: {
    ja: "奈良市・奈良県全域",
    en: "Nara City & Nara Prefecture",
  },
  servicesByLang: {
    ja: ["ハウスクリーニング", "エアコンクリーニング", "定期清掃", "スポット清掃"],
    en: ["house cleaning", "A/C cleaning", "recurring cleaning", "spot cleaning"],
  },
  retail: true,
  productPageRoute: "/products",
  languages: {
    default: "ja",
    allowed: [
      "ja",
      "en",
      "zh",
      "zh-TW",
      "ko",
      "fr",
      "es",
      "de",
      "pt",
      "it",
      "ru",
      "th",
      "vi",
      "id",
      "hi",
      "ar",
    ],
  },
  limits: {
    qaBase: 30,
    qaOwner: 40,
    qaLearned: 60,
    menuLines: 120,
    productLines: 120,
    keywords: 200,
  },
};
