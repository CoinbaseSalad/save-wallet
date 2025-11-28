'use client';

import { useCallback, useEffect, useState, useTransition } from 'react';
import { useLocale } from 'next-intl';
import { locales, type Locale, localeNames, localeFlags } from '@/i18n/routing';

const LOCALE_COOKIE_NAME = 'NEXT_LOCALE';

// 브라우저/Base 앱 언어 감지
function detectBrowserLocale(): Locale {
  if (typeof window === 'undefined') return 'ko';

  // navigator.language에서 언어 코드 추출
  const browserLang = navigator.language.split('-')[0].toLowerCase();

  // 지원하는 언어인지 확인
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }

  // 중국어 특별 처리 (zh-CN, zh-TW 등)
  if (browserLang === 'zh') {
    return 'zh';
  }

  // 기본값
  return 'ko';
}

// 쿠키에서 언어 가져오기
function getLocaleFromCookie(): Locale | null {
  if (typeof document === 'undefined') return null;

  const cookies = document.cookie.split(';');
  for (const cookie of cookies) {
    const [name, value] = cookie.trim().split('=');
    if (name === LOCALE_COOKIE_NAME && locales.includes(value as Locale)) {
      return value as Locale;
    }
  }
  return null;
}

// 쿠키에 언어 저장
function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return;

  const maxAge = 31536000; // 1년
  document.cookie = `${LOCALE_COOKIE_NAME}=${locale};path=/;max-age=${maxAge};samesite=lax`;
}

export function useLocaleSettings() {
  const currentLocale = useLocale() as Locale;
  const [isPending, startTransition] = useTransition();
  const [isInitialized, setIsInitialized] = useState(false);

  // 초기 언어 감지 및 설정
  useEffect(() => {
    const savedLocale = getLocaleFromCookie();

    // 저장된 언어가 없으면 브라우저 언어 감지하여 저장
    if (!savedLocale) {
      const detectedLocale = detectBrowserLocale();
      setLocaleCookie(detectedLocale);

      // 감지된 언어가 현재 언어와 다르면 페이지 새로고침
      if (detectedLocale !== currentLocale) {
        window.location.reload();
      }
    }

    setIsInitialized(true);
  }, [currentLocale]);

  // 언어 변경 함수
  const changeLocale = useCallback((newLocale: Locale) => {
    startTransition(() => {
      setLocaleCookie(newLocale);
      // 페이지 새로고침하여 새 언어 적용
      window.location.reload();
    });
  }, []);

  // 저장된 언어 가져오기 (없으면 브라우저 언어)
  const getSavedLocale = useCallback((): Locale => {
    const saved = getLocaleFromCookie();
    return saved || detectBrowserLocale();
  }, []);

  // 언어가 이미 설정되어 있는지 확인
  const hasLocaleSet = useCallback((): boolean => {
    return getLocaleFromCookie() !== null;
  }, []);

  return {
    locale: currentLocale,
    locales,
    localeNames,
    localeFlags,
    changeLocale,
    getSavedLocale,
    hasLocaleSet,
    isPending,
    isInitialized,
  };
}

