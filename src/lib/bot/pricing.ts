import type { Lang } from "./i18n";
import { t } from "./i18n";

export const PRICES = {
  courseworkBase: 30000,
  courseworkExtraPage: 1200,
  courseworkThreshold: 30,
  slides: 20000,
  thesisPerPage: 5000,
  articlePerPage: 7000,
  web: 20000,
  bot: 15000,
};

export function calcPrice(service: string, pages?: number | null): number {
  const p = pages && pages > 0 ? pages : 0;
  switch (service) {
    case "coursework":
      return p > PRICES.courseworkThreshold
        ? PRICES.courseworkBase +
            (p - PRICES.courseworkThreshold) * PRICES.courseworkExtraPage
        : PRICES.courseworkBase;
    case "slides":
      return PRICES.slides;
    case "thesis":
      return PRICES.thesisPerPage * Math.max(p, 1);
    case "article":
      return PRICES.articlePerPage * Math.max(p, 1);
    case "web":
      return PRICES.web;
    case "bot":
      return PRICES.bot;
    default:
      return 0;
  }
}

export function fmtNum(n: number): string {
  return n
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0");
}

export function fmtSum(n: number, lang: Lang | string): string {
  return `${fmtNum(n)} ${t(lang).currency}`;
}

export function fmtCard(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  return digits.replace(/(\d{4})(?=\d)/g, "$1\u2009");
}
