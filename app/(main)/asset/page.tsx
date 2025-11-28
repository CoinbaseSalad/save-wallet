"use client";

import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle, ExternalLink, Wallet, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
import { useTranslations } from "next-intl";
import { useLocaleSettings } from "@/app/hooks/useLocaleSettings";
import { useWalletAssets, useInvalidateWalletCache } from "@/app/hooks/useWalletQuery";
import { formatCurrency, formatNumber, formatPercent } from "@/app/utils/currency";
import AnalyzingModal from "@/app/components/AnalyzingModal";
import type { RiskSource, RiskLevel, Importance } from "@/app/api/wallet/types";
import type { Locale } from "@/i18n/routing";

// 위험도에 따른 아이콘 및 색상
const getRiskIcon = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "warning":
      return <AlertTriangle className="w-5 h-5 text-error" />;
    case "caution":
      return <AlertCircle className="w-5 h-5 text-warning" />;
    default:
      return null;
  }
};

// 중요도에 따른 점 색상 (Theme Colors - 위험도와 구분)
const getImportanceDotColor = (importance: Importance) => {
  switch (importance) {
    case "high":
      return "bg-primary";
    case "medium":
      return "bg-secondary";
    case "low":
      return "bg-accent";
  }
};

// 중요도 텍스트
const getImportanceText = (importance: Importance, tAsset: ReturnType<typeof useTranslations>) => {
  switch (importance) {
    case "high":
      return tAsset("importanceHigh");
    case "medium":
      return tAsset("importanceMedium");
    case "low":
      return tAsset("importanceLow");
  }
};

// 근거 링크 아이템 컴포넌트
const SourceItem = ({ source, tAsset }: { source: RiskSource; tAsset: ReturnType<typeof useTranslations> }) => (
  <a
    href={source.url}
    target="_blank"
    rel="noopener noreferrer"
    className="flex items-center gap-2 p-2 rounded-lg bg-base-100 hover:bg-base-200 transition-colors group"
  >
    <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${getImportanceDotColor(source.importance)}`} />
    <span className="flex-1 text-xs text-base-content/80 group-hover:text-primary truncate">
      {source.title}
    </span>
    <span className="text-[10px] text-base-content/50 shrink-0">
      {getImportanceText(source.importance, tAsset)}
    </span>
    <ExternalLink className="w-3 h-3 text-base-content/40 shrink-0" />
  </a>
);

// 스켈레톤 로딩 컴포넌트
const AssetPageSkeleton = () => (
  <div className="p-4 space-y-6 max-w-lg mx-auto animate-pulse">
    {/* 전체 자산 현황 스켈레톤 */}
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <div className="skeleton h-6 w-32 mb-4"></div>
        <div className="skeleton h-24 w-full mb-4"></div>
        <div className="flex gap-2">
          <div className="skeleton h-6 w-20"></div>
          <div className="skeleton h-6 w-20"></div>
          <div className="skeleton h-6 w-20"></div>
        </div>
      </div>
    </div>

    {/* 코인 카드 스켈레톤 */}
    <div className="space-y-4">
      <div className="skeleton h-6 w-24"></div>
      {[1, 2, 3].map((i) => (
        <div key={i} className="card bg-base-200 shadow-lg">
          <div className="card-body p-4">
            <div className="flex items-start gap-4">
              <div className="skeleton h-14 w-14 rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="skeleton h-5 w-24"></div>
                <div className="skeleton h-4 w-32"></div>
                <div className="skeleton h-16 w-full rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const INITIAL_SOURCES_COUNT = 3;

export default function AssetPage() {
  const { address, isConnected } = useAccount();
  const { locale } = useLocaleSettings();
  const tAsset = useTranslations("asset");
  const tWallet = useTranslations("wallet");
  const tError = useTranslations("error");
  const tCommon = useTranslations("common");

  // React Query params
  const assetsParams = useMemo(() => {
    if (!address) return null;
    return {
      walletAddress: address,
      chainKey: "base",
    };
  }, [address]);

  // React Query 훅 사용
  const { data, isLoading, error, refetch, isFetching } = useWalletAssets(assetsParams);
  const { invalidateAssets } = useInvalidateWalletCache();

  // 새로고침 핸들러
  const handleRefresh = () => {
    if (address) {
      invalidateAssets(address, "base");
      refetch();
    }
  };

  // 근거 더보기 상태 (코인 symbol별로 관리)
  const [expandedSources, setExpandedSources] = useState<Set<string>>(new Set());

  // 근거 더보기 토글 함수
  const toggleSourceExpand = (symbol: string) => {
    setExpandedSources(prev => {
      const newSet = new Set(prev);
      if (newSet.has(symbol)) {
        newSet.delete(symbol);
      } else {
        newSet.add(symbol);
      }
      return newSet;
    });
  };

  // 데이터 추출
  const summary = data?.summary;
  const coins = data?.coins || [];
  const portfolioAnalysis = data?.portfolioAnalysis;

  // 지갑 미연결 상태
  if (!isConnected) {
    return (
      <div className="p-4 max-w-lg mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center">
            <Wallet className="w-16 h-16 mx-auto text-primary mb-4" />
            <h2 className="card-title justify-center">{tWallet("connect")}</h2>
            <p className="text-sm text-base-content/70">
              {tWallet("connectDescription")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태 - 스켈레톤과 모달 함께 표시
  if (isLoading) {
    return (
      <>
        <AnalyzingModal isOpen={true} />
        <AssetPageSkeleton />
      </>
    );
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-4 max-w-lg mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center">
            <div className="text-error text-4xl mb-4">⚠️</div>
            <h2 className="card-title justify-center">{tError("title")}</h2>
            <p className="text-sm text-base-content/70">{error.message}</p>
            <button className="btn btn-primary mt-4" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              {tCommon("retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data || !summary) {
    return (
      <div className="p-4 max-w-lg mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center">
            <div className="text-4xl mb-4">📊</div>
            <h2 className="card-title justify-center">{tError("noData")}</h2>
            <p className="text-sm text-base-content/70">
              {tError("noDataDescription")}
            </p>
            <button className="btn btn-primary mt-4" onClick={handleRefresh}>
              <RefreshCw className="w-4 h-4" />
              {tCommon("retry")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      {/* 전체 자산 현황 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <div className="flex items-center justify-between">
            <h2 className="card-title text-lg flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              {tAsset("totalAssets")}
            </h2>
            <button
              className="btn btn-ghost btn-sm btn-circle"
              onClick={handleRefresh}
              disabled={isFetching}
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="stats bg-base-100 shadow w-full">
            <div className="stat">
              <div className="stat-title">{tAsset("totalValue")}</div>
              <div className="stat-value text-primary">{formatCurrency(summary.totalValueUsd, locale as Locale)}</div>
              <div className={`stat-desc flex items-center gap-1 ${summary.totalChange24h >= 0 ? "text-success" : "text-error"}`}>
                {summary.totalChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {formatPercent(summary.totalChange24h, locale as Locale)} ({formatCurrency(Math.abs(summary.totalChangeValue), locale as Locale)})
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">{tAsset("holdingCoins")}</div>
              <div className="stat-value">{summary.totalCoins}</div>
              <div className="stat-desc">{tAsset("coins")}</div>
            </div>
          </div>

          {/* 위험 요약 */}
          <div className="flex gap-2 mt-2">
            <div className="badge badge-error gap-1">
              <AlertTriangle className="w-3 h-3" />
              {tAsset("warning")} {summary.riskSummary.warning}
            </div>
            <div className="badge badge-warning gap-1">
              <AlertCircle className="w-3 h-3" />
              {tAsset("caution")} {summary.riskSummary.caution}
            </div>
            <div className="badge badge-success gap-1">
              {tAsset("safe")} {summary.riskSummary.safe}
            </div>
          </div>

          {/* 중요도 범례 */}
          <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
            <span className="font-medium">{tAsset("importance")}:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-primary" />
              <span>{tAsset("importanceHigh")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-secondary" />
              <span>{tAsset("importanceMedium")}</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-accent" />
              <span>{tAsset("importanceLow")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 코인 별 카드 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold px-1">{tAsset("holdingAssets")}</h3>

        {/* 보유 자산이 없는 경우 */}
        {coins.length === 0 ? (
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-20 h-20 rounded-full bg-base-100 flex items-center justify-center mb-4">
                  <Wallet className="w-10 h-10 text-base-content/30" />
                </div>
                <p className="text-base-content/60 text-sm font-medium">{tAsset("noAssets")}</p>
                <p className="text-base-content/40 text-xs mt-2 max-w-xs">
                  {tAsset("noAssetsDescription")}
                </p>
              </div>
            </div>
          </div>
        ) : (
          coins.map((coin) => (
            <div key={coin.symbol} className="card bg-base-200 shadow-lg">
              <div className="card-body p-4">
                <div className="flex items-center gap-4">
                  {/* 코인 썸네일 with 위험도 indicator */}
                  <div className="indicator">
                    {coin.riskLevel !== "safe" && (
                      <span className={`indicator-item indicator-start`}>
                        {getRiskIcon(coin.riskLevel)}
                      </span>
                    )}
                    <div className="avatar avatar-placeholder">
                      <div className="bg-white w-14 h-14 rounded-full ring ring-base-300 ring-offset-base-100 ring-offset-2">
                        {coin.logo ? (
                          <img
                            src={coin.logo}
                            alt={coin.symbol}
                            className="p-2"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                              e.currentTarget.parentElement!.innerHTML = `<span class="text-lg font-bold">${coin.symbol.slice(0, 2)}</span>`;
                            }}
                          />
                        ) : (
                          <span className="text-lg font-bold">{coin.symbol.slice(0, 2)}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 코인 정보 */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-lg">{coin.symbol}</h4>
                        <p className="text-xs text-base-content/60">{coin.name}</p>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg">{formatCurrency(coin.value, locale as Locale)}</div>
                        <div className={`text-xs flex items-center justify-end gap-1 ${coin.change24h >= 0 ? "text-success" : "text-error"}`}>
                          {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {formatPercent(coin.change24h, locale as Locale)}
                        </div>
                      </div>
                    </div>

                    {/* 보유량 및 가격 */}
                    <div className="flex items-center justify-between mt-2 text-sm text-base-content/70">
                      <span>{tAsset("amount")}: {formatNumber(coin.amount, locale as Locale, 6)} {coin.symbol}</span>
                      <span>{formatCurrency(coin.price, locale as Locale)}</span>
                    </div>
                  </div>
                </div>

                {/* 위험도 이유 표시 (양호가 아닌 경우) - 전체 너비 */}
                {coin.riskLevel !== "safe" && coin.riskReason && (
                  <div className={`mt-3 p-3 rounded-lg text-sm ${coin.riskLevel === "warning" ? "bg-error/10" : "bg-warning/10"}`}>
                    <div className="flex items-start gap-2">
                      {getRiskIcon(coin.riskLevel)}
                      <div className="flex-1">
                        <span className={`font-semibold ${coin.riskLevel === "warning" ? "text-error" : "text-warning"}`}>
                          {coin.riskLevel === "warning" ? tAsset("warning") : tAsset("caution")}:
                        </span>
                        <span className="ml-1 text-base-content/80">{coin.riskReason}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 근거 링크 */}
                {coin.riskSources.length > 0 && (
                  <div className="mt-3">
                    {/* 근거 목록 표시 */}
                    <div className="space-y-1.5">
                      {(expandedSources.has(coin.symbol)
                        ? coin.riskSources.slice(0, 10)
                        : coin.riskSources.slice(0, INITIAL_SOURCES_COUNT)
                      ).map((source, idx) => (
                        <SourceItem key={idx} source={source} tAsset={tAsset} />
                      ))}
                    </div>

                    {/* 확장/축소 버튼 */}
                    {coin.riskSources.length > INITIAL_SOURCES_COUNT && (
                      <button
                        className="btn btn-ghost btn-sm w-full mt-2"
                        onClick={() => toggleSourceExpand(coin.symbol)}
                      >
                        {expandedSources.has(coin.symbol) ? (
                          <>
                            <ChevronUp className="w-4 h-4" />
                            {tAsset("collapse")}
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            {tAsset("showMoreSources", { count: Math.min(coin.riskSources.length - INITIAL_SOURCES_COUNT, 7) })}
                          </>
                        )}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* 전체 포트폴리오 분석 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-lg">{tAsset("portfolioAnalysis")}</h3>

          {portfolioAnalysis && portfolioAnalysis.summary.length > 0 ? (
            <>
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h4 className="font-bold text-sm">{tAsset("portfolioSummary")}</h4>
                  <ul className="text-xs mt-1 space-y-1">
                    {portfolioAnalysis.summary.map((item, idx) => (
                      <li key={idx}>• {item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* 자산 배분 차트 (간단한 bar) */}
              {portfolioAnalysis.allocationChart.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="text-sm font-semibold mb-2">{tAsset("assetAllocation")}</div>
                  {portfolioAnalysis.allocationChart.map((item) => (
                    <div key={item.symbol} className="flex items-center gap-2">
                      <span className="w-12 text-xs font-medium">{item.symbol}</span>
                      <progress
                        className={`progress flex-1 ${item.riskLevel === "warning"
                          ? "progress-error"
                          : item.riskLevel === "caution"
                            ? "progress-warning"
                            : "progress-success"
                          }`}
                        value={item.percentage}
                        max="100"
                      />
                      <span className="w-12 text-xs text-right">{formatPercent(item.percentage, locale as Locale, false)}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <div className="w-14 h-14 rounded-full bg-base-100 flex items-center justify-center mb-3">
                <AlertCircle className="w-7 h-7 text-base-content/30" />
              </div>
              <p className="text-base-content/60 text-sm">{tAsset("insufficientData")}</p>
              <p className="text-base-content/40 text-xs mt-1">{tAsset("insufficientDataDescription")}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
