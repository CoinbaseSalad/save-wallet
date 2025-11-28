'use client';

/**
 * 환율 API 유틸리티
 * fawazahmed0/exchange-api를 사용하여 일일 환율을 가져오고 localStorage에 캐싱합니다.
 * @see https://github.com/fawazahmed0/exchange-api
 */

// API URL 구조
const PRIMARY_API_URL = 'https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json';
const FALLBACK_API_URL = 'https://latest.currency-api.pages.dev/v1/currencies/usd.json';

// localStorage 키
const EXCHANGE_RATE_KEY = 'exchange_rates';
const EXCHANGE_RATE_DATE_KEY = 'exchange_rates_date';

// 기본 환율 (API 실패 시 폴백용)
export const DEFAULT_EXCHANGE_RATES: Record<string, number> = {
  USD: 1,
  KRW: 1380,
  CNY: 7.25,
  JPY: 155,
};

// 지원하는 통화 목록
export const SUPPORTED_CURRENCIES = ['USD', 'KRW', 'CNY', 'JPY'] as const;
export type SupportedCurrency = typeof SUPPORTED_CURRENCIES[number];

interface ExchangeRateResponse {
  date: string;
  usd: Record<string, number>;
}

interface CachedExchangeRates {
  rates: Record<string, number>;
  date: string;
  fetchedAt: number;
}

/**
 * 오늘 날짜를 YYYY-MM-DD 형식으로 반환
 */
function getTodayDateString(): string {
  const now = new Date();
  return now.toISOString().split('T')[0];
}

/**
 * localStorage에서 캐시된 환율 데이터를 가져옵니다.
 */
function getCachedRates(): CachedExchangeRates | null {
  if (typeof window === 'undefined') return null;

  try {
    const cached = localStorage.getItem(EXCHANGE_RATE_KEY);
    const cachedDate = localStorage.getItem(EXCHANGE_RATE_DATE_KEY);

    if (!cached || !cachedDate) return null;

    const rates = JSON.parse(cached) as Record<string, number>;
    const data = JSON.parse(cachedDate) as { date: string; fetchedAt: number };

    return {
      rates,
      date: data.date,
      fetchedAt: data.fetchedAt,
    };
  } catch {
    return null;
  }
}

/**
 * 환율 데이터를 localStorage에 저장합니다.
 */
function setCachedRates(rates: Record<string, number>, date: string): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(EXCHANGE_RATE_KEY, JSON.stringify(rates));
    localStorage.setItem(
      EXCHANGE_RATE_DATE_KEY,
      JSON.stringify({ date, fetchedAt: Date.now() })
    );
  } catch (error) {
    console.warn('Failed to cache exchange rates:', error);
  }
}

/**
 * API에서 환율 데이터를 가져옵니다.
 * Primary URL 실패 시 Fallback URL을 사용합니다.
 */
async function fetchExchangeRates(): Promise<ExchangeRateResponse | null> {
  // Primary URL 시도
  try {
    const response = await fetch(PRIMARY_API_URL, {
      cache: 'no-store', // 항상 최신 데이터 가져오기
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.warn('Primary API failed, trying fallback:', error);
  }

  // Fallback URL 시도
  try {
    const response = await fetch(FALLBACK_API_URL, {
      cache: 'no-store',
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.error('Fallback API also failed:', error);
  }

  return null;
}

/**
 * API 응답에서 지원하는 통화의 환율만 추출합니다.
 */
function extractSupportedRates(response: ExchangeRateResponse): Record<string, number> {
  const rates: Record<string, number> = { USD: 1 };

  for (const currency of SUPPORTED_CURRENCIES) {
    if (currency === 'USD') continue;

    const lowerCurrency = currency.toLowerCase();
    if (response.usd[lowerCurrency]) {
      rates[currency] = response.usd[lowerCurrency];
    } else {
      // API에 없는 통화는 기본값 사용
      rates[currency] = DEFAULT_EXCHANGE_RATES[currency];
    }
  }

  return rates;
}

/**
 * 환율 데이터를 가져옵니다.
 * - localStorage에 오늘 날짜의 캐시가 있으면 캐시 사용
 * - 없으면 API에서 가져와서 캐시
 * - API 실패 시 기본값 반환
 */
export async function getExchangeRates(): Promise<Record<string, number>> {
  const today = getTodayDateString();
  const cached = getCachedRates();

  // 오늘 날짜의 캐시가 있으면 사용
  if (cached && cached.date === today) {
    console.log('[ExchangeRate] Using cached rates from:', cached.date);
    return cached.rates;
  }

  // API에서 새로운 환율 가져오기
  console.log('[ExchangeRate] Fetching new rates...');
  const response = await fetchExchangeRates();

  if (response) {
    const rates = extractSupportedRates(response);
    setCachedRates(rates, today);
    console.log('[ExchangeRate] Fetched and cached rates:', rates);
    return rates;
  }

  // API 실패 시, 이전 캐시가 있으면 사용 (날짜가 다르더라도)
  if (cached) {
    console.warn('[ExchangeRate] API failed, using stale cache from:', cached.date);
    return cached.rates;
  }

  // 모든 것이 실패하면 기본값 사용
  console.warn('[ExchangeRate] All failed, using default rates');
  return DEFAULT_EXCHANGE_RATES;
}

/**
 * 캐시가 오늘 날짜인지 확인합니다.
 */
export function isCacheValid(): boolean {
  const cached = getCachedRates();
  if (!cached) return false;

  const today = getTodayDateString();
  return cached.date === today;
}

/**
 * 캐시된 환율 데이터를 동기적으로 반환합니다.
 * 캐시가 없으면 기본값을 반환합니다.
 */
export function getCachedRatesSync(): Record<string, number> {
  const cached = getCachedRates();
  return cached?.rates || DEFAULT_EXCHANGE_RATES;
}

/**
 * 환율 캐시를 강제로 초기화합니다.
 */
export function clearExchangeRateCache(): void {
  if (typeof window === 'undefined') return;

  try {
    localStorage.removeItem(EXCHANGE_RATE_KEY);
    localStorage.removeItem(EXCHANGE_RATE_DATE_KEY);
    console.log('[ExchangeRate] Cache cleared');
  } catch (error) {
    console.warn('Failed to clear exchange rate cache:', error);
  }
}

