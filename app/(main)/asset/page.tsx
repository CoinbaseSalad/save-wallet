"use client";

import { useState, useEffect, useCallback } from "react";
import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle, ExternalLink, Wallet, ChevronDown, RefreshCw } from "lucide-react";
import { useAccount } from "wagmi";
import type { AssetsResponse, AssetsResponseData, CoinDetail, RiskSource, RiskLevel, Importance } from "@/app/api/wallet/types";

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

// 위험도에 따른 indicator 색상
const getRiskIndicatorColor = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "warning":
      return "badge-error";
    case "caution":
      return "badge-warning";
    default:
      return "";
  }
};

// 위험도 텍스트
const getRiskText = (riskLevel: RiskLevel) => {
  switch (riskLevel) {
    case "warning":
      return "경고";
    case "caution":
      return "주의";
    default:
      return "";
  }
};

// 중요도에 따른 점 색상
const getImportanceDotColor = (importance: Importance) => {
  switch (importance) {
    case "high":
      return "bg-error";
    case "medium":
      return "bg-warning";
    case "low":
      return "bg-success";
  }
};

// 중요도 텍스트
const getImportanceText = (importance: Importance) => {
  switch (importance) {
    case "high":
      return "상";
    case "medium":
      return "중";
    case "low":
      return "하";
  }
};

// 숫자를 소수점 2자리까지 포맷팅 (불필요한 0 제거)
const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  // 정수인 경우 그대로 반환
  if (Number.isInteger(n)) return n.toLocaleString();
  // 소수점 2자리까지 반올림 후 불필요한 0 제거
  return parseFloat(n.toFixed(2)).toLocaleString();
};

// 근거 링크 아이템 컴포넌트
const SourceItem = ({ source }: { source: RiskSource }) => (
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
      {getImportanceText(source.importance)}
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

export default function AssetPage() {
  const { address, isConnected } = useAccount();
  
  // API 데이터 상태
  const [data, setData] = useState<AssetsResponseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // API 호출 함수
  const fetchAssets = useCallback(async () => {
    if (!address) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/wallet/assets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: address,
          chainKey: 'base',
        }),
      });

      const result: AssetsResponse = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error?.message || '자산 데이터를 가져오는데 실패했습니다.');
      }
    } catch (err) {
      console.error('API 호출 오류:', err);
      setError('서버 연결에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // 지갑 연결 시 데이터 로드
  useEffect(() => {
    if (isConnected && address) {
      fetchAssets();
    }
  }, [isConnected, address, fetchAssets]);

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
            <h2 className="card-title justify-center">지갑을 연결해주세요</h2>
            <p className="text-sm text-base-content/70">
              자산 현황을 확인하려면 먼저 지갑을 연결해주세요.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // 로딩 상태
  if (isLoading) {
    return <AssetPageSkeleton />;
  }

  // 에러 상태
  if (error) {
    return (
      <div className="p-4 max-w-lg mx-auto min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="card bg-base-200 shadow-lg">
          <div className="card-body text-center">
            <div className="text-error text-4xl mb-4">⚠️</div>
            <h2 className="card-title justify-center">오류가 발생했습니다</h2>
            <p className="text-sm text-base-content/70">{error}</p>
            <button className="btn btn-primary mt-4" onClick={fetchAssets}>
              <RefreshCw className="w-4 h-4" />
              다시 시도
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
            <h2 className="card-title justify-center">데이터가 없습니다</h2>
            <p className="text-sm text-base-content/70">
              자산 데이터를 가져올 수 없습니다.
            </p>
            <button className="btn btn-primary mt-4" onClick={fetchAssets}>
              <RefreshCw className="w-4 h-4" />
              다시 시도
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
              전체 자산 현황
            </h2>
            <button 
              className="btn btn-ghost btn-sm btn-circle"
              onClick={fetchAssets}
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>

          <div className="stats bg-base-100 shadow w-full">
            <div className="stat">
              <div className="stat-title">총 자산</div>
              <div className="stat-value text-primary">${formatNumber(summary.totalValueUsd)}</div>
              <div className={`stat-desc flex items-center gap-1 ${summary.totalChange24h >= 0 ? "text-success" : "text-error"}`}>
                {summary.totalChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {summary.totalChange24h >= 0 ? "+" : ""}{formatNumber(summary.totalChange24h)}% (${formatNumber(Math.abs(summary.totalChangeValue))})
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">보유 코인</div>
              <div className="stat-value">{summary.totalCoins}</div>
              <div className="stat-desc">종목</div>
            </div>
          </div>

          {/* 위험 요약 */}
          <div className="flex gap-2 mt-2">
            <div className="badge badge-error gap-1">
              <AlertTriangle className="w-3 h-3" />
              경고 {summary.riskSummary.warning}
            </div>
            <div className="badge badge-warning gap-1">
              <AlertCircle className="w-3 h-3" />
              주의 {summary.riskSummary.caution}
            </div>
            <div className="badge badge-success gap-1">
              양호 {summary.riskSummary.safe}
            </div>
          </div>

          {/* 중요도 범례 */}
          <div className="flex items-center gap-4 mt-2 text-xs text-base-content/60">
            <span className="font-medium">중요도:</span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-error" />
              <span>상</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-warning" />
              <span>중</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-success" />
              <span>하</span>
            </div>
          </div>
        </div>
      </div>

      {/* 코인 별 카드 */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold px-1">보유 자산</h3>

        {/* 보유 자산이 없는 경우 */}
        {coins.length === 0 ? (
          <div className="card bg-base-200 shadow-lg">
            <div className="card-body">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-20 h-20 rounded-full bg-base-100 flex items-center justify-center mb-4">
                  <Wallet className="w-10 h-10 text-base-content/30" />
                </div>
                <p className="text-base-content/60 text-sm font-medium">보유 중인 자산이 없습니다</p>
                <p className="text-base-content/40 text-xs mt-2 max-w-xs">
                  이 지갑에는 현재 토큰이 없습니다. 토큰을 보유하면 상세한 위험도 분석과 함께 여기에 표시됩니다.
                </p>
              </div>
            </div>
          </div>
        ) : (
          coins.map((coin) => (
          <div key={coin.symbol} className="card bg-base-200 shadow-lg">
            <div className="card-body p-4">
              <div className="flex items-start gap-4">
                {/* 코인 썸네일 with 위험도 indicator */}
                <div className="indicator">
                  {coin.riskLevel !== "safe" && (
                    <span className={`indicator-item indicator-start badge ${getRiskIndicatorColor(coin.riskLevel)} badge-sm`}>
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
                      <div className="font-bold text-lg">${formatNumber(coin.value)}</div>
                      <div className={`text-xs flex items-center justify-end gap-1 ${coin.change24h >= 0 ? "text-success" : "text-error"}`}>
                        {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {coin.change24h >= 0 ? "+" : ""}{formatNumber(coin.change24h)}%
                      </div>
                    </div>
                  </div>

                  {/* 보유량 및 가격 */}
                  <div className="flex items-center justify-between mt-2 text-sm text-base-content/70">
                    <span>보유량: {formatNumber(coin.amount)} {coin.symbol}</span>
                    <span>@${formatNumber(coin.price)}</span>
                  </div>

                  {/* 위험도 이유 표시 (양호가 아닌 경우) */}
                  {coin.riskLevel !== "safe" && coin.riskReason && (
                    <div className={`mt-3 p-2 rounded-lg text-sm ${coin.riskLevel === "warning" ? "bg-error/10" : "bg-warning/10"}`}>
                      <div className="flex items-start gap-2">
                        {getRiskIcon(coin.riskLevel)}
                        <div className="flex-1">
                          <span className={`font-semibold ${coin.riskLevel === "warning" ? "text-error" : "text-warning"}`}>
                            {getRiskText(coin.riskLevel)}:
                          </span>
                          <span className="ml-1 text-base-content/80">{coin.riskReason}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 근거 링크 - Collapse 형태 */}
              {coin.riskSources.length > 0 && (
                <div className="mt-3">
                  {/* 초기 표시 (최대 3개) */}
                  <div className="space-y-1.5">
                    {coin.riskSources.slice(0, 3).map((source, idx) => (
                      <SourceItem key={idx} source={source} />
                    ))}
                  </div>

                  {/* 3개 초과 시 Collapse로 나머지 표시 */}
                  {coin.riskSources.length > 3 && (
                    <div className="collapse collapse-arrow bg-base-100 mt-2 rounded-lg">
                      <input type="checkbox" />
                      <div className="collapse-title text-xs py-2 min-h-0 flex items-center gap-2">
                        <ChevronDown className="w-3 h-3" />
                        <span className="text-base-content/60">
                          {Math.min(coin.riskSources.length - 3, 7)}개 근거 더보기
                        </span>
                      </div>
                      <div className="collapse-content px-2 pb-2">
                        <div className="space-y-1.5 pt-1">
                          {coin.riskSources.slice(3, 10).map((source, idx) => (
                            <SourceItem key={idx + 3} source={source} />
                          ))}
                        </div>
                      </div>
                    </div>
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
          <h3 className="card-title text-lg">포트폴리오 분석</h3>

          {portfolioAnalysis && portfolioAnalysis.summary.length > 0 ? (
            <>
              <div className="alert alert-info">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <div>
                  <h4 className="font-bold text-sm">포트폴리오 요약</h4>
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
                  <div className="text-sm font-semibold mb-2">자산 배분</div>
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
                      <span className="w-12 text-xs text-right">{item.percentage.toFixed(1)}%</span>
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
              <p className="text-base-content/60 text-sm">분석할 데이터가 부족합니다</p>
              <p className="text-base-content/40 text-xs mt-1">자산을 보유하면 상세 분석이 제공됩니다</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
