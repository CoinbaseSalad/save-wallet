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

