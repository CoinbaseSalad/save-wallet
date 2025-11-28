"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { Search, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, PieChart, Activity, ChevronDown, ChevronUp, RefreshCw } from "lucide-react";
import { useTranslations } from "next-intl";
import { useUserSettings } from "@/app/hooks/useUserSettings";
import { useLocaleSettings } from "@/app/hooks/useLocaleSettings";
import type { AnalyzeResponse, AnalyzeResponseData } from "@/app/api/wallet/types";

// 점수에 따른 색상 계산 (0-10)
const getScoreColor = (score: number) => {
  if (score < 4) return "text-error";
  if (score < 6) return "text-warning";
  return "text-success";
};

// 점수에 따른 이모지 반환
const getScoreEmoji = (score: number) => {
  if (score < 3) return "😰";
  if (score < 5) return "😟";
  if (score < 6) return "😐";
  if (score < 8) return "😊";
  return "🎉";
};

// 평가에 따른 배지 스타일
const getEvaluationBadge = (evaluation: string) => {
  switch (evaluation) {
    case "good":
      return "badge-success";
    case "bad":
      return "badge-error";
    default:
      return "badge-warning";
  }
};

const INITIAL_TRADES_COUNT = 4;
const INITIAL_COINS_COUNT = 5;

// 숫자를 소수점 2자리까지 포맷팅 (불필요한 0 제거)
const formatNumber = (num: number | string): string => {
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (isNaN(n)) return '0';
  // 정수인 경우 그대로 반환
  if (Number.isInteger(n)) return n.toLocaleString();
  // 소수점 2자리까지 반올림 후 불필요한 0 제거
  return parseFloat(n.toFixed(2)).toLocaleString();
};

// 스켈레톤 로딩 컴포넌트
const SearchResultSkeleton = () => (
  <div className="p-4 space-y-6 max-w-lg mx-auto animate-pulse">
    {/* 지갑 건강도 스켈레톤 */}
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <div className="skeleton h-6 w-32 mb-4"></div>
        <div className="flex items-center gap-4">
          <div className="skeleton h-4 flex-1 rounded-full"></div>
          <div className="skeleton h-10 w-16"></div>
        </div>
        <div className="skeleton h-16 w-full mt-4 rounded-lg"></div>
      </div>
    </div>

    {/* 거래 내역 스켈레톤 */}
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <div className="skeleton h-6 w-32 mb-4"></div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4">
              <div className="skeleton h-12 w-20"></div>
              <div className="skeleton h-12 flex-1 rounded-lg"></div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* 포트폴리오 스켈레톤 */}
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <div className="skeleton h-6 w-32 mb-4"></div>
        <div className="skeleton h-20 w-full mb-4"></div>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton h-16 w-full rounded-lg"></div>
          ))}
        </div>
      </div>
    </div>
  </div>
);

export default function SearchPage() {
  const { settings } = useUserSettings();
  const { locale } = useLocaleSettings();
  const t = useTranslations("search");
  const tHome = useTranslations("home");
  const tError = useTranslations("error");
  const tCommon = useTranslations("common");
  
  // 검색 상태
  const [walletAddress, setWalletAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // API 데이터 상태
  const [searchResult, setSearchResult] = useState<AnalyzeResponseData | null>(null);
  
  // UI 상태
  const [isTradesExpanded, setIsTradesExpanded] = useState(false);
  const [isCoinsExpanded, setIsCoinsExpanded] = useState(false);
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // 평가 텍스트 (번역)
  const getEvaluationText = (evaluation: string) => {
    switch (evaluation) {
      case "good":
        return tHome("evaluationGood");
      case "bad":
        return tHome("evaluationBad");
      default:
        return tHome("evaluationNormal");
    }
  };

  // 검색 API 호출
  const handleSearch = useCallback(async () => {
    if (!walletAddress.trim()) return;

    setIsSearching(true);
    setIsLoading(true);
    setSearchResult(null);
    setError(null);

    try {
      const response = await fetch('/api/wallet/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          walletAddress: walletAddress.trim(),
          chainKey: 'base',
          locale: locale,
          userSettings: settings ? {
            investmentStyle: settings.investment_style,
            livingExpenseRatio: settings.living_expense_ratio,
            investmentRatio: settings.investment_ratio,
            roastLevel: settings.roast_level,
          } : {
            investmentStyle: 2,
            livingExpenseRatio: 50,
            investmentRatio: 30,
            roastLevel: 2,
          },
        }),
      });

      const result: AnalyzeResponse = await response.json();

      if (result.success && result.data) {
        setSearchResult(result.data);
      } else {
        setError(result.error?.message || t("searchFailed"));
      }
    } catch (err) {
      console.error('API 호출 오류:', err);
      setError(tError("serverConnection"));
    } finally {
      setIsLoading(false);
    }
  }, [walletAddress, settings, locale, t, tError]);

  const handleReset = () => {
    setIsSearching(false);
    setSearchResult(null);
    setWalletAddress("");
    setIsTradesExpanded(false);
    setError(null);
  };

  // 데이터 추출
  const aiEvaluation = searchResult?.aiEvaluation;
  const recentTrades = searchResult?.recentTrades || [];
  const portfolio = searchResult?.portfolio;
  const investStyle = searchResult?.investStyle;

  const totalValue = portfolio?.totalValueUsd || 0;
  const totalChange24h = portfolio?.totalChange24h || 0;

  const displayedTrades = isTradesExpanded 
    ? recentTrades 
    : recentTrades.slice(0, INITIAL_TRADES_COUNT);
  const hasMoreTrades = recentTrades.length > INITIAL_TRADES_COUNT;

  // 날짜별 거래 횟수 계산
  const dateTradeCount = useMemo(() => {
    return recentTrades.reduce((acc, trade) => {
      acc[trade.date] = (acc[trade.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [recentTrades]);

  // 월별로 날짜 그룹화
  const datesByMonth = useMemo(() => {
    const grouped: Record<string, { date: string; day: number; count: number }[]> = {};
    Object.entries(dateTradeCount).forEach(([date, count]) => {
      const parts = date.split("-");
      const month = parseInt(parts[1]);
      const day = parseInt(parts[2]);
      if (!grouped[month]) grouped[month] = [];
      grouped[month].push({ date, day, count });
    });
    // 각 월 내에서 일자 내림차순 정렬
    Object.values(grouped).forEach(dates => dates.sort((a, b) => b.day - a.day));
    return grouped;
  }, [dateTradeCount]);

  // 날짜 클릭 시 해당 위치로 스크롤
  const scrollToDate = (date: string) => {
    if (!isTradesExpanded) {
      setIsTradesExpanded(true);
      setTimeout(() => {
        dateRefs.current[date]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      dateRefs.current[date]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className={`p-4 max-w-lg mx-auto ${!isSearching ? "min-h-[calc(100vh-200px)] flex items-center justify-center" : "space-y-6"}`}>
      {/* 지갑 주소 입력 영역 */}
      <div
        className={`card bg-base-200 shadow-lg transition-all duration-500 ease-out w-full max-w-md ${isSearching ? "transform -translate-y-2 scale-95 opacity-0 h-0 overflow-hidden p-0 m-0" : ""
          }`}
      >
        <div className="card-body">
          {/* 제목 영역 */}
          <h2 className="card-title text-lg flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            {t("title")}
          </h2>

          {/* 설명 영역 */}
          <p className="text-sm text-base-content/70">
            {t("description")}
          </p>

          {/* 입력 영역 */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">{t("walletAddress")}</span>
            </label>
            <input
              type="text"
              placeholder={t("placeholder")}
              className="input input-bordered w-full"
              value={walletAddress}
              onChange={(e) => setWalletAddress(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
          </div>

          {/* 버튼 영역 */}
          <div className="card-actions justify-end mt-4">
            <button
              className="btn btn-primary w-full"
              onClick={handleSearch}
              disabled={!walletAddress.trim()}
            >
              <Search className="w-4 h-4" />
              {t("searchButton")}
            </button>
          </div>
        </div>
      </div>

      {/* 검색 결과 영역 */}
      {isSearching && (
        <div className="animate-fade-in">
          {/* 검색된 지갑 주소 표시 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-primary" />
              <span className="font-mono text-sm bg-base-200 px-3 py-1 rounded-lg">
                {walletAddress.length > 20 ? `${walletAddress.slice(0, 10)}...${walletAddress.slice(-8)}` : walletAddress}
              </span>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={handleReset}>
              {t("searchOther")}
            </button>
          </div>

          {/* 에러 표시 */}
          {error && (
            <div className="card bg-base-200 shadow-lg mb-6">
              <div className="card-body text-center">
                <div className="text-error text-4xl mb-4">⚠️</div>
                <h2 className="card-title justify-center">{tError("title")}</h2>
                <p className="text-sm text-base-content/70">{error}</p>
                <button className="btn btn-primary mt-4" onClick={handleSearch}>
                  <RefreshCw className="w-4 h-4" />
                  {tCommon("retry")}
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <SearchResultSkeleton />
          ) : (
            searchResult && aiEvaluation && (
              <div className="space-y-6">
                {/* 전체 평가 영역 */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      {tHome("walletHealth")}
                    </h2>

                    {/* 점수 바와 숫자 표시 */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-4 rounded-full overflow-hidden bg-linear-to-r from-error via-warning to-success">
                          <div
                            className="h-full bg-base-100 transition-all duration-500"
                            style={{
                              width: `${100 - aiEvaluation.overallScore * 10}%`,
                              marginLeft: `${aiEvaluation.overallScore * 10}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-base-content/60">
                          <span>{tHome("risk")}</span>
                          <span>{tHome("normal")}</span>
                          <span>{tHome("good")}</span>
                        </div>
                      </div>
                      <div className={`text-4xl font-bold ${getScoreColor(aiEvaluation.overallScore)}`}>
                        {aiEvaluation.overallScore.toFixed(1)}
                      </div>
                    </div>

                    {/* 이모티콘과 한 줄 평가 */}
                    <div className="flex items-center gap-3 mt-2 p-3 bg-base-100 rounded-lg">
                      <span className="text-3xl">{getScoreEmoji(aiEvaluation.overallScore)}</span>
                      <p className="text-sm text-base-content/80">{aiEvaluation.evaluation}</p>
                    </div>

                    {/* 위험 경고 */}
                    {aiEvaluation.riskWarnings && aiEvaluation.riskWarnings.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {aiEvaluation.riskWarnings.map((warning, idx) => (
                          <div key={idx} className="alert alert-warning py-2">
                            <span className="text-xs">{warning}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* 거래 내역 평가 영역 */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-secondary" />
                      {tHome("recentTrades")}
                      <span className="text-xs text-base-content/60 font-normal">({tHome("last7Days")})</span>
                    </h2>

                    {/* 거래 내역이 없는 경우 */}
                    {recentTrades.length === 0 ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center mb-4">
                          <Wallet className="w-8 h-8 text-base-content/30" />
                        </div>
                        <p className="text-base-content/60 text-sm">{tHome("noTrades")}</p>
                        <p className="text-base-content/40 text-xs mt-1">{tHome("tradesWillShow")}</p>
                      </div>
                    ) : (
                      <>

                      {/* 날짜별 거래 횟수 뱃지 - 월/일 2행 분리 */}
                      {Object.keys(datesByMonth).length > 0 && (
                        <div className="w-full mt-2 flex divide-x divide-base-content/20">
                          {Object.entries(datesByMonth).map(([month, dates]) => (
                            <div key={month} className="flex-1 flex flex-col items-center gap-1 px-2">
                              {/* 월 라벨 */}
                              <span className="text-xs text-base-content/60 font-medium">{month}월</span>
                              {/* 일자 버튼 */}
                              <div className="flex gap-1 justify-center flex-wrap">
                                {dates.map(({ date, day, count }) => (
                                  <button
                                    key={date}
                                    className="btn btn-xs btn-ghost gap-0.5 px-2 hover:btn-primary transition-colors"
                                    onClick={() => scrollToDate(date)}
                                  >
                                    {day}
                                    <span className="badge badge-xs badge-primary">{count}</span>
                                  </button>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Chat Bubbles 스타일 거래 내역 */}
                      <div className="space-y-1 mt-4">
                        {displayedTrades.map((trade, index) => {
                          const prevTrade = displayedTrades[index - 1];
                          const showDateDivider = !prevTrade || prevTrade.date !== trade.date;

                          return (
                            <div key={trade.hash}>
                              {/* 날짜 구분선 */}
                              {showDateDivider && (
                                <div
                                  ref={(el) => { dateRefs.current[trade.date] = el; }}
                                  className="divider text-xs text-base-content/50 my-3"
                                >
                                  {trade.date}
                                </div>
                              )}

                              {/* 채팅 버블 스타일 거래 카드 */}
                              <div className={`chat ${trade.type === "buy" ? "chat-start" : "chat-end"}`}>
                                <div className="chat-image">
                                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${trade.type === "buy" ? "bg-success/20" : "bg-error/20"
                                    }`}>
                                    {trade.type === "buy" ? (
                                      <ArrowUpRight className="w-4 h-4 text-success" />
                                    ) : (
                                      <ArrowDownRight className="w-4 h-4 text-error" />
                                    )}
                                  </div>
                                </div>
                                <div className={`chat-bubble ${trade.type === "buy" ? "bg-success/10" : "bg-error/10"
                                  } text-base-content`}>
                                  <div className="flex items-center gap-2 mb-1">
                                    <span className="font-bold">{trade.coin}</span>
                                    <span className={`badge badge-xs ${trade.type === "buy" ? "badge-success" : "badge-error"}`}>
                                      {trade.type === "buy" ? tHome("buy") : tHome("sell")}
                                    </span>
                                    <span className={`badge badge-xs ${getEvaluationBadge(trade.evaluation)}`}>
                                      {getEvaluationText(trade.evaluation)}
                                    </span>
                                  </div>
                                  <div className="text-xs text-base-content/70">
                                    {formatNumber(trade.amount)} {trade.coin} @ ${formatNumber(trade.price)}
                                  </div>
                                  {trade.comment && (
                                    <div className="text-xs mt-1 italic text-base-content/60">
                                      💡 {trade.comment}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* 확장/축소 버튼 */}
                      {hasMoreTrades && (
                        <button
                          className="btn btn-ghost btn-sm w-full mt-2"
                          onClick={() => setIsTradesExpanded(!isTradesExpanded)}
                        >
                          {isTradesExpanded ? (
                            <>
                              <ChevronUp className="w-4 h-4" />
                              {tHome("collapse")}
                            </>
                          ) : (
                            <>
                              <ChevronDown className="w-4 h-4" />
                              {recentTrades.length - INITIAL_TRADES_COUNT}{tHome("showMore")}
                            </>
                          )}
                        </button>
                      )}
                      </>
                    )}
                  </div>
                </div>

                {/* 투자 현황 평가 영역 */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-accent" />
                      {tHome("portfolio")}
                    </h2>

                    {/* 총 자산 */}
                    <div className="stats bg-base-100 shadow">
                      <div className="stat">
                        <div className="stat-title">{tHome("totalValue")}</div>
                        <div className="stat-value text-primary">${totalValue.toLocaleString()}</div>
                        <div className={`stat-desc flex items-center gap-1 ${totalChange24h >= 0 ? "text-success" : "text-error"}`}>
                          {totalChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                          {tHome("dayChange")} {totalChange24h >= 0 ? "+" : ""}{totalChange24h.toFixed(1)}%
                        </div>
                      </div>
                    </div>

                    {/* 포트폴리오가 비어있는 경우 */}
                    {(!portfolio || portfolio.coins.length === 0) ? (
                      <div className="flex flex-col items-center justify-center py-8 text-center">
                        <div className="w-16 h-16 rounded-full bg-base-100 flex items-center justify-center mb-4">
                          <PieChart className="w-8 h-8 text-base-content/30" />
                        </div>
                        <p className="text-base-content/60 text-sm">{tHome("noAssets")}</p>
                        <p className="text-base-content/40 text-xs mt-1">{tHome("assetsWillShow")}</p>
                      </div>
                    ) : (
                      <>
                      {/* 자산 배분 */}
                      <div className="space-y-3 mt-4">
                        {(isCoinsExpanded ? portfolio.coins : portfolio.coins.slice(0, INITIAL_COINS_COUNT)).map((asset) => (
                          <div key={asset.symbol} className="bg-base-100 p-3 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                {asset.logo && (
                                  <img 
                                    src={asset.logo} 
                                    alt={asset.symbol} 
                                    className="w-6 h-6 rounded-full"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none';
                                    }}
                                  />
                                )}
                                <span className="font-bold">{asset.symbol}</span>
                                <span className="text-xs text-base-content/60">
                                  {formatNumber(asset.amount)} {asset.symbol}
                                </span>
                              </div>
                              <div className="text-right">
                                <div className="font-semibold">${formatNumber(asset.value)}</div>
                                <div
                                  className={`text-xs flex items-center gap-1 ${asset.change24h >= 0 ? "text-success" : "text-error"
                                    }`}
                                >
                                  {asset.change24h >= 0 ? (
                                    <TrendingUp className="w-3 h-3" />
                                  ) : (
                                    <TrendingDown className="w-3 h-3" />
                                  )}
                                  {asset.change24h >= 0 ? "+" : ""}
                                  {formatNumber(asset.change24h)}%
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <progress
                                className={`progress ${asset.allocation >= 40
                                  ? "progress-primary"
                                  : asset.allocation >= 20
                                    ? "progress-secondary"
                                    : "progress-accent"
                                  } flex-1`}
                                value={asset.allocation}
                                max="100"
                              />
                              <span className="text-xs text-base-content/60 w-10 text-right">{formatNumber(asset.allocation)}%</span>
                            </div>
                          </div>
                        ))}
                        
                        {/* 확장/축소 버튼 */}
                        {portfolio.coins.length > INITIAL_COINS_COUNT && (
                          <button
                            className="btn btn-ghost btn-sm w-full"
                            onClick={() => setIsCoinsExpanded(!isCoinsExpanded)}
                          >
                            {isCoinsExpanded ? (
                              <>
                                <ChevronUp className="w-4 h-4" />
                                {tHome("collapse")}
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-4 h-4" />
                                {portfolio.coins.length - INITIAL_COINS_COUNT}{tHome("showMore")}
                              </>
                            )}
                          </button>
                        )}
                        
                        {/* 코인 개수 표시 */}
                        <div className="text-right">
                          <span className="text-xs text-base-content/50">{tHome("totalCoins", { count: portfolio.coins.length })}</span>
                        </div>
                      </div>

                      {/* 투자 성향 */}
                      {investStyle && (
                        <>
                          <div className="divider">{tHome("investStyleAnalysis")}</div>
                          <div className="grid grid-cols-2 gap-3">
                            <div className="bg-base-100 p-3 rounded-lg text-center">
                              <div className="text-xs text-base-content/60 mb-1">{tHome("riskLevel")}</div>
                              <div className={`badge badge-lg ${
                                investStyle.riskLevel === '높음' ? 'badge-error' : 
                                investStyle.riskLevel === '중간' ? 'badge-warning' : 'badge-success'
                              }`}>
                                {investStyle.riskLevel}
                              </div>
                            </div>
                            <div className="bg-base-100 p-3 rounded-lg text-center">
                              <div className="text-xs text-base-content/60 mb-1">{tHome("tradingFrequency")}</div>
                              <div className="text-sm font-semibold">{investStyle.tradingFrequency}</div>
                            </div>
                            <div className="bg-base-100 p-3 rounded-lg text-center">
                              <div className="text-xs text-base-content/60 mb-1">{tHome("avgHoldingPeriod")}</div>
                              <div className="text-sm font-semibold">{investStyle.avgHoldingPeriod}</div>
                            </div>
                            <div className="bg-base-100 p-3 rounded-lg text-center">
                              <div className="text-xs text-base-content/60 mb-1">{tHome("preferredCoins")}</div>
                              <div className="flex gap-1 justify-center flex-wrap">
                                {investStyle.preferredCoins && investStyle.preferredCoins.length > 0 ? (
                                  investStyle.preferredCoins.slice(0, 3).map((coin) => (
                                    <span key={coin} className="badge badge-sm badge-outline">
                                      {coin}
                                    </span>
                                  ))
                                ) : (
                                  <span className="text-xs text-base-content/40">{tHome("noDataAvailable")}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        </>
                      )}

                      {/* 종합 평가 */}
                      {aiEvaluation.portfolioAdvice && (
                        <div className={`alert mt-4 ${
                          investStyle?.riskLevel === '높음' ? 'alert-warning' : ''
                        }`}>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="stroke-current shrink-0 h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            {investStyle?.riskLevel === '높음' ? (
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                              />
                            ) : (
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            )}
                          </svg>
                          <div>
                            <h3 className="font-bold text-sm">
                              {investStyle?.riskLevel === '높음' ? tHome("attentionNeeded") : tHome("investmentAdvice")}
                            </h3>
                            <div className="text-xs">
                              {aiEvaluation.portfolioAdvice}
                            </div>
                          </div>
                        </div>
                      )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
}
