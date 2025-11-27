"use client";

import { useState, useRef, useMemo } from "react";
import { Search, Wallet, TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, PieChart, Activity, ChevronDown, ChevronUp } from "lucide-react";

// TODO: 검색 실패 toast 추가
// TODO: 검색 실패시 로직 추가 (실패 이유 toast 표시 및 검색 카드 재표시)

// 검색 결과 모의 데이터
const mockSearchResult = {
  address: "0x1234...5678",
  overallScore: 5.8,
  evaluation: "중간 수준의 위험 관리가 필요한 포트폴리오입니다.",
  recentTrades: [
    { id: 1, coin: "ETH", type: "buy", amount: 10, price: 3380, date: "2024-11-25", evaluation: "neutral", comment: "평균적인 진입" },
    { id: 2, coin: "BTC", type: "sell", amount: 0.1, price: 68000, date: "2024-11-24", evaluation: "good", comment: "적절한 타이밍" },
    { id: 3, coin: "PEPE", type: "buy", amount: 50000000, price: 0.000021, date: "2024-11-23", evaluation: "bad", comment: "고위험 밈코인" },
    { id: 4, coin: "SOL", type: "sell", amount: 20, price: 248, date: "2024-11-22", evaluation: "good", comment: "좋은 익절 타이밍" },
    { id: 5, coin: "DOGE", type: "buy", amount: 5000, price: 0.38, date: "2024-11-21", evaluation: "bad", comment: "밈코인 추가 매수" },
    { id: 6, coin: "ETH", type: "sell", amount: 5, price: 3450, date: "2024-11-20", evaluation: "neutral", comment: "부분 익절" },
  ],
  portfolio: [
    { coin: "ETH", amount: 25, value: 85500, allocation: 55, change24h: -1.5 },
    { coin: "BTC", amount: 0.5, value: 33625, allocation: 25, change24h: 2.1 },
    { coin: "PEPE", amount: 100000000, value: 2100, allocation: 15, change24h: -8.3 },
    { coin: "기타", amount: 0, value: 775, allocation: 5, change24h: 1.2 },
  ],
  investStyle: {
    riskLevel: "높음",
    tradingFrequency: "매일",
    preferredCoins: ["ETH", "PEPE", "DOGE"],
    avgHoldingPeriod: "1-3일",
  },
};

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

// 평가 텍스트
const getEvaluationText = (evaluation: string) => {
  switch (evaluation) {
    case "good":
      return "좋음";
    case "bad":
      return "주의";
    default:
      return "보통";
  }
};

const INITIAL_TRADES_COUNT = 4;

// 날짜를 간단한 형식으로 변환 (11/25)
const _formatDateShort = (dateStr: string) => {
  const parts = dateStr.split("-");
  return `${parseInt(parts[1])}/${parseInt(parts[2])}`;
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
  const [walletAddress, setWalletAddress] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchResult, setSearchResult] = useState<typeof mockSearchResult | null>(null);
  const [isTradesExpanded, setIsTradesExpanded] = useState(false);
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSearch = async () => {
    if (!walletAddress.trim()) return;

    setIsSearching(true);
    setIsLoading(true);
    setSearchResult(null);

    // 2초 로딩 시뮬레이션
    await new Promise((resolve) => setTimeout(resolve, 2000));

    setSearchResult(mockSearchResult);
    setIsLoading(false);
  };

  const handleReset = () => {
    setIsSearching(false);
    setSearchResult(null);
    setWalletAddress("");
    setIsTradesExpanded(false);
  };

  const totalValue = searchResult?.portfolio.reduce((sum, p) => sum + p.value, 0) || 0;

  const displayedTrades = searchResult
    ? (isTradesExpanded ? searchResult.recentTrades : searchResult.recentTrades.slice(0, INITIAL_TRADES_COUNT))
    : [];
  const hasMoreTrades = searchResult ? searchResult.recentTrades.length > INITIAL_TRADES_COUNT : false;

  // 날짜별 거래 횟수 계산
  const dateTradeCount = useMemo(() => {
    if (!searchResult) return {};
    return searchResult.recentTrades.reduce((acc, trade) => {
      acc[trade.date] = (acc[trade.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  }, [searchResult]);

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
            지갑 평가 검색
          </h2>

          {/* 설명 영역 */}
          <p className="text-sm text-base-content/70">
            다른 사용자의 지갑 주소를 입력하여 투자 성향과 포트폴리오를 분석해보세요.
          </p>

          {/* 입력 영역 */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text">지갑 주소</span>
            </label>
            <input
              type="text"
              placeholder="0x... 또는 ENS 주소 입력"
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
              검색하기
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
              다른 지갑 검색
            </button>
          </div>

          {isLoading ? (
            <SearchResultSkeleton />
          ) : (
            searchResult && (
              <div className="space-y-6">
                {/* 전체 평가 영역 */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <Activity className="w-5 h-5 text-primary" />
                      지갑 건강도
                    </h2>

                    {/* 점수 바와 숫자 표시 */}
                    <div className="flex items-center gap-4">
                      <div className="flex-1">
                        <div className="h-4 rounded-full overflow-hidden bg-linear-to-r from-error via-warning to-success">
                          <div
                            className="h-full bg-base-100 transition-all duration-500"
                            style={{
                              width: `${100 - searchResult.overallScore * 10}%`,
                              marginLeft: `${searchResult.overallScore * 10}%`,
                            }}
                          />
                        </div>
                        <div className="flex justify-between text-xs mt-1 text-base-content/60">
                          <span>위험</span>
                          <span>보통</span>
                          <span>양호</span>
                        </div>
                      </div>
                      <div className={`text-4xl font-bold ${getScoreColor(searchResult.overallScore)}`}>
                        {searchResult.overallScore.toFixed(1)}
                      </div>
                    </div>

                    {/* 이모티콘과 한 줄 평가 */}
                    <div className="flex items-center gap-3 mt-2 p-3 bg-base-100 rounded-lg">
                      <span className="text-3xl">{getScoreEmoji(searchResult.overallScore)}</span>
                      <p className="text-sm text-base-content/80">{searchResult.evaluation}</p>
                    </div>
                  </div>
                </div>

                {/* 거래 내역 평가 영역 */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <Wallet className="w-5 h-5 text-secondary" />
                      최근 거래 평가
                      <span className="text-xs text-base-content/60 font-normal">(최근 7일)</span>
                    </h2>

                    {/* 날짜별 거래 횟수 뱃지 - 월/일 2행 분리 */}
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

                    {/* Chat Bubbles 스타일 거래 내역 */}
                    <div className="space-y-1 mt-4">
                      {displayedTrades.map((trade, index) => {
                        const prevTrade = displayedTrades[index - 1];
                        const showDateDivider = !prevTrade || prevTrade.date !== trade.date;

                        return (
                          <div key={trade.id}>
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
                                    {trade.type === "buy" ? "매수" : "매도"}
                                  </span>
                                  <span className={`badge badge-xs ${getEvaluationBadge(trade.evaluation)}`}>
                                    {getEvaluationText(trade.evaluation)}
                                  </span>
                                </div>
                                <div className="text-xs text-base-content/70">
                                  {trade.amount.toLocaleString()} {trade.coin} @ ${trade.price.toLocaleString()}
                                </div>
                                <div className="text-xs mt-1 italic text-base-content/60">
                                  💡 {trade.comment}
                                </div>
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
                            접기
                          </>
                        ) : (
                          <>
                            <ChevronDown className="w-4 h-4" />
                            {searchResult.recentTrades.length - INITIAL_TRADES_COUNT}개 더보기
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

                {/* 투자 현황 평가 영역 */}
                <div className="card bg-base-200 shadow-lg">
                  <div className="card-body">
                    <h2 className="card-title text-lg flex items-center gap-2">
                      <PieChart className="w-5 h-5 text-accent" />
                      포트폴리오 현황
                    </h2>

                    {/* 총 자산 */}
                    <div className="stats bg-base-100 shadow">
                      <div className="stat">
                        <div className="stat-title">총 평가금액</div>
                        <div className="stat-value text-primary">${totalValue.toLocaleString()}</div>
                        <div className="stat-desc flex items-center gap-1 text-error">
                          <TrendingDown className="w-4 h-4" />
                          전일 대비 -1.8%
                        </div>
                      </div>
                    </div>

                    {/* 자산 배분 */}
                    <div className="space-y-3 mt-4">
                      {searchResult.portfolio.map((asset) => (
                        <div key={asset.coin} className="bg-base-100 p-3 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{asset.coin}</span>
                              <span className="text-xs text-base-content/60">
                                {asset.coin !== "기타" && `${asset.amount.toLocaleString()} ${asset.coin}`}
                              </span>
                            </div>
                            <div className="text-right">
                              <div className="font-semibold">${asset.value.toLocaleString()}</div>
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
                                {asset.change24h}%
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
                            <span className="text-xs text-base-content/60 w-10 text-right">{asset.allocation}%</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* 투자 성향 */}
                    <div className="divider">투자 성향 분석</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-base-100 p-3 rounded-lg text-center">
                        <div className="text-xs text-base-content/60 mb-1">위험도</div>
                        <div className="badge badge-error badge-lg">{searchResult.investStyle.riskLevel}</div>
                      </div>
                      <div className="bg-base-100 p-3 rounded-lg text-center">
                        <div className="text-xs text-base-content/60 mb-1">거래 빈도</div>
                        <div className="text-sm font-semibold">{searchResult.investStyle.tradingFrequency}</div>
                      </div>
                      <div className="bg-base-100 p-3 rounded-lg text-center">
                        <div className="text-xs text-base-content/60 mb-1">평균 보유기간</div>
                        <div className="text-sm font-semibold">{searchResult.investStyle.avgHoldingPeriod}</div>
                      </div>
                      <div className="bg-base-100 p-3 rounded-lg text-center">
                        <div className="text-xs text-base-content/60 mb-1">선호 코인</div>
                        <div className="flex gap-1 justify-center flex-wrap">
                          {searchResult.investStyle.preferredCoins.map((coin) => (
                            <span key={coin} className="badge badge-sm badge-outline">
                              {coin}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* 종합 평가 */}
                    <div className="alert alert-warning mt-4">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="stroke-current shrink-0 h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                        />
                      </svg>
                      <div>
                        <h3 className="font-bold text-sm">주의 필요</h3>
                        <div className="text-xs">
                          밈코인 비중이 높고 거래 빈도가 잦습니다. 안정적인 코인으로 포트폴리오 다변화를 권장합니다.
                        </div>
                      </div>
                    </div>
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
