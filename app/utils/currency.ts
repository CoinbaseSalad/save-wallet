'use client';

import { type Locale, localeCurrencies, exchangeRates } from '@/i18n/routing';

/**
 * USD 금액을 현재 로케일의 통화로 변환하여 포맷팅합니다.
 * @param amountUsd - USD 금액
 * @param locale - 현재 로케일
 * @param options - 포맷팅 옵션
 * @returns 포맷팅된 통화 문자열
 */
export function formatCurrency(
  amountUsd: number | string,
  locale: Locale,
  options?: {
    showSymbol?: boolean;
    minimumFractionDigits?: number;
    maximumFractionDigits?: number;
    compact?: boolean;
  }
): string {
  const amount = typeof amountUsd === 'string' ? parseFloat(amountUsd) : amountUsd;
  if (isNaN(amount)) return '0';

  const currencyConfig = localeCurrencies[locale];
  const exchangeRate = exchangeRates[currencyConfig.currency];
  const convertedAmount = amount * exchangeRate;

  const {
    showSymbol = true,
    minimumFractionDigits,
    maximumFractionDigits,
    compact = false,
  } = options || {};

  // 소수점 자릿수 결정 (JPY, KRW는 소수점 없음)
  const noDecimalCurrencies = ['JPY', 'KRW'];
  const defaultMinFraction = noDecimalCurrencies.includes(currencyConfig.currency) ? 0 : 2;
  const defaultMaxFraction = noDecimalCurrencies.includes(currencyConfig.currency) ? 0 : 2;

  try {
    const formatter = new Intl.NumberFormat(currencyConfig.locale, {
      style: showSymbol ? 'currency' : 'decimal',
      currency: showSymbol ? currencyConfig.currency : undefined,
      minimumFractionDigits: minimumFractionDigits ?? defaultMinFraction,
      maximumFractionDigits: maximumFractionDigits ?? defaultMaxFraction,
      notation: compact ? 'compact' : 'standard',
      compactDisplay: compact ? 'short' : undefined,
    });

    return formatter.format(convertedAmount);
  } catch {
    // 폴백: 기본 포맷팅
    const formatted = convertedAmount.toLocaleString(currencyConfig.locale, {
      minimumFractionDigits: minimumFractionDigits ?? defaultMinFraction,
      maximumFractionDigits: maximumFractionDigits ?? defaultMaxFraction,
    });
    return showSymbol ? `${currencyConfig.symbol}${formatted}` : formatted;
  }
}

/**
 * 숫자를 소수점 지정 자릿수까지 포맷팅합니다 (불필요한 0 제거).
 * @param num - 포맷팅할 숫자
 * @param locale - 현재 로케일
 * @param decimals - 소수점 자릿수 (기본값: 2)
 * @returns 포맷팅된 숫자 문자열
 */
export function formatNumber(
  num: number | string,
  locale?: Locale,
  decimals: number = 2
): string {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';

  const localeString = locale ? localeCurrencies[locale].locale : undefined;

  // 정수인 경우 그대로 반환
  if (Number.isInteger(n)) {
    return n.toLocaleString(localeString);
  }

  // 소수점 자릿수까지 반올림 후 불필요한 0 제거
  return parseFloat(n.toFixed(decimals)).toLocaleString(localeString);
}

/**
 * 퍼센트 값을 포맷팅합니다.
 * @param value - 퍼센트 값
 * @param locale - 현재 로케일
 * @param showSign - 양수일 때 + 기호 표시 여부
 * @returns 포맷팅된 퍼센트 문자열
 */
export function formatPercent(
  value: number | string,
  locale?: Locale,
  showSign: boolean = true
): string {
  const n = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(n)) return '0%';

  const localeString = locale ? localeCurrencies[locale].locale : undefined;
  const formatted = parseFloat(n.toFixed(2)).toLocaleString(localeString);
  const sign = showSign && n > 0 ? '+' : '';

  return `${sign}${formatted}%`;
}

/**
 * 통화 기호만 반환합니다.
 * @param locale - 현재 로케일
 * @returns 통화 기호
 */
export function getCurrencySymbol(locale: Locale): string {
  return localeCurrencies[locale].symbol;
}

/**
 * 통화 코드를 반환합니다.
 * @param locale - 현재 로케일
 * @returns 통화 코드 (예: USD, KRW)
 */
export function getCurrencyCode(locale: Locale): string {
  return localeCurrencies[locale].currency;
}

