import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type {
  AnalyzeResponse,
  AnalyzeResponseData,
  AssetsResponse,
  AssetsResponseData,
  UserSettingsRequest,
} from "@/app/api/wallet/types";

// ============================================
// 캐시 시간 상수
// ============================================
const THIRTY_MINUTES = 30 * 60 * 1000; // 30분
const ONE_HOUR = 60 * 60 * 1000; // 1시간

// ============================================
// Query Keys
// ============================================
export const walletKeys = {
  all: ["wallet"] as const,
  analyze: () => [...walletKeys.all, "analyze"] as const,
  analyzeByAddress: (address: string, chainKey: string) =>
    [...walletKeys.analyze(), address.toLowerCase(), chainKey] as const,
  assets: () => [...walletKeys.all, "assets"] as const,
  assetsByAddress: (address: string, chainKey: string) =>
    [...walletKeys.assets(), address.toLowerCase(), chainKey] as const,
};

// ============================================
// API 요청 타입
// ============================================
export interface AnalyzeParams {
  walletAddress: string;
  chainKey: string;
  locale: string;
  userSettings: UserSettingsRequest;
}

export interface AssetsParams {
  walletAddress: string;
  chainKey: string;
}

// ============================================
// API 호출 함수
// ============================================
const fetchAnalyze = async (params: AnalyzeParams): Promise<AnalyzeResponseData> => {
  const response = await fetch("/api/wallet/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result: AnalyzeResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || "Failed to fetch wallet analysis");
  }

  return result.data;
};

const fetchAssets = async (params: AssetsParams): Promise<AssetsResponseData> => {
  const response = await fetch("/api/wallet/assets", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(params),
  });

  const result: AssetsResponse = await response.json();

  if (!result.success || !result.data) {
    throw new Error(result.error?.message || "Failed to fetch wallet assets");
  }

  return result.data;
};

// ============================================
// Query Hooks
// ============================================

/**
 * 지갑 분석 데이터를 가져오는 훅 (home 페이지용)
 * - staleTime: 30분
 * - gcTime: 1시간
 */
export function useWalletAnalysis(params: AnalyzeParams | null) {
  return useQuery({
    queryKey: params
      ? walletKeys.analyzeByAddress(params.walletAddress, params.chainKey)
      : ["wallet", "analyze", "disabled"],
    queryFn: () => fetchAnalyze(params!),
    enabled: !!params?.walletAddress,
    staleTime: THIRTY_MINUTES,
    gcTime: ONE_HOUR,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * 지갑 자산 데이터를 가져오는 훅 (asset 페이지용)
 * - staleTime: 30분
 * - gcTime: 1시간
 */
export function useWalletAssets(params: AssetsParams | null) {
  return useQuery({
    queryKey: params
      ? walletKeys.assetsByAddress(params.walletAddress, params.chainKey)
      : ["wallet", "assets", "disabled"],
    queryFn: () => fetchAssets(params!),
    enabled: !!params?.walletAddress,
    staleTime: THIRTY_MINUTES,
    gcTime: ONE_HOUR,
    refetchOnWindowFocus: false,
    retry: 2,
  });
}

/**
 * 검색용 지갑 분석 mutation (search 페이지용)
 * - mutation 성공 시 캐시에 저장하여 재검색 시 재사용
 */
export function useWalletSearchMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: fetchAnalyze,
    onSuccess: (data, variables) => {
      // 성공 시 캐시에 저장
      queryClient.setQueryData(
        walletKeys.analyzeByAddress(variables.walletAddress, variables.chainKey),
        data
      );
    },
  });
}

/**
 * 특정 지갑의 캐시된 분석 데이터 조회
 */
export function useCachedWalletAnalysis(address: string | null, chainKey: string) {
  const queryClient = useQueryClient();

  if (!address) return null;

  return queryClient.getQueryData<AnalyzeResponseData>(
    walletKeys.analyzeByAddress(address, chainKey)
  );
}

/**
 * 지갑 관련 캐시 무효화 함수들
 */
export function useInvalidateWalletCache() {
  const queryClient = useQueryClient();

  return {
    invalidateAnalysis: (address: string, chainKey: string) => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.analyzeByAddress(address, chainKey),
      });
    },
    invalidateAssets: (address: string, chainKey: string) => {
      queryClient.invalidateQueries({
        queryKey: walletKeys.assetsByAddress(address, chainKey),
      });
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: walletKeys.all });
    },
  };
}

