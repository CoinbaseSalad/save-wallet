'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import {
  getExchangeRates,
  getCachedRatesSync,
  isCacheValid,
  clearExchangeRateCache,
  DEFAULT_EXCHANGE_RATES,
} from '@/app/utils/exchangeRate';

interface UseExchangeRateReturn {
  /** 현재 환율 데이터 */
  rates: Record<string, number>;
  /** 환율 로딩 중 여부 */
  isLoading: boolean;
  /** 에러 발생 여부 */
  error: Error | null;
  /** 환율 강제 새로고침 */
  refresh: () => Promise<void>;
  /** 캐시 초기화 */
  clearCache: () => void;
}

/**
 * 환율 데이터를 관리하는 훅
 * 
 * - 컴포넌트 마운트 시 캐시 확인 후 필요하면 API 호출
 * - localStorage에 캐싱하여 같은 날 재방문 시 API 호출 없이 사용
 * - 앱 접속 시 한 번만 환율을 가져옴 (날짜가 변경된 경우에만 새로 요청)
 * 
 * @example
 * ```tsx
 * const { rates, isLoading } = useExchangeRate();
 * const krwRate = rates.KRW; // 1 USD = ? KRW
 * ```
 */
export function useExchangeRate(): UseExchangeRateReturn {
  // 초기값은 동기적으로 캐시에서 가져옴 (있으면 캐시, 없으면 기본값)
  const [rates, setRates] = useState<Record<string, number>>(() => {
    if (typeof window === 'undefined') return DEFAULT_EXCHANGE_RATES;
    return getCachedRatesSync();
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  // 초기 로드 여부를 추적 (한 번만 실행하기 위함)
  const hasInitialized = useRef(false);

  // 환율 가져오기 함수
  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const newRates = await getExchangeRates();
      setRates(newRates);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch exchange rates'));
      console.error('Failed to fetch exchange rates:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 강제 새로고침 함수
  const refresh = useCallback(async () => {
    clearExchangeRateCache();
    await fetchRates();
  }, [fetchRates]);

  // 캐시 초기화 함수
  const clearCache = useCallback(() => {
    clearExchangeRateCache();
    setRates(DEFAULT_EXCHANGE_RATES);
  }, []);

  // 컴포넌트 마운트 시 한 번만 캐시 유효성 확인 후 필요하면 API 호출
  useEffect(() => {
    // 이미 초기화되었으면 스킵
    if (hasInitialized.current) return;
    hasInitialized.current = true;

    // 캐시가 유효하지 않으면 새로 가져옴 (날짜가 변경된 경우 포함)
    if (!isCacheValid()) {
      console.log('[ExchangeRate] Cache invalid or date changed, fetching new rates...');
      fetchRates();
    } else {
      console.log('[ExchangeRate] Using valid cached rates');
    }
  }, [fetchRates]);

  return {
    rates,
    isLoading,
    error,
    refresh,
    clearCache,
  };
}

export default useExchangeRate;
