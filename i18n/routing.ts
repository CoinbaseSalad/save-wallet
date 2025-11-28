import { defineRouting } from 'next-intl/routing';

export const locales = ['ko', 'en', 'zh', 'ja'] as const;
export type Locale = (typeof locales)[number];

export const routing = defineRouting({
  // 지원하는 언어 목록
  locales,
  // 기본 언어
  defaultLocale: 'ko',
  // URL에 locale prefix를 표시하지 않음 (쿠키 기반 언어 설정)
  localePrefix: 'never',
  // 자동 언어 감지 비활성화 (사용자 설정 우선)
  localeDetection: false,
  // 쿠키 설정
  localeCookie: {
    name: 'NEXT_LOCALE',
    maxAge: 31536000, // 1년
    sameSite: 'lax',
  },
});

// 언어 이름 매핑 (UI 표시용)
export const localeNames: Record<Locale, string> = {
  ko: '한국어',
  en: 'English',
  zh: '中文',
  ja: '日本語',
};

// 언어 플래그 이모지 매핑
export const localeFlags: Record<Locale, string> = {
  ko: '🇰🇷',
  en: '🇺🇸',
  zh: '🇨🇳',
  ja: '🇯🇵',
};

// 언어별 통화 설정
export interface CurrencyConfig {
  currency: string;
  symbol: string;
  locale: string;
}

export const localeCurrencies: Record<Locale, CurrencyConfig> = {
  ko: { currency: 'KRW', symbol: '₩', locale: 'ko-KR' },
  en: { currency: 'USD', symbol: '$', locale: 'en-US' },
  zh: { currency: 'CNY', symbol: '¥', locale: 'zh-CN' },
  ja: { currency: 'JPY', symbol: '¥', locale: 'ja-JP' },
};

// 기본 환율 (USD 기준) - API 실패 시 폴백용
// 실시간 환율은 useExchangeRate 훅을 통해 가져옵니다.
// @see app/hooks/useExchangeRate.ts
export const defaultExchangeRates: Record<string, number> = {
  USD: 1,
  KRW: 1380,
  CNY: 7.25,
  JPY: 155,
};

// 하위 호환성을 위해 exchangeRates도 export (deprecated)
/** @deprecated useExchangeRate 훅을 사용하세요 */
export const exchangeRates = defaultExchangeRates;

