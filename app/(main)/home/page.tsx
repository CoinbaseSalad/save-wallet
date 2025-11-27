"use client";

import { useState, useRef, useMemo } from "react";
import { TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight, Wallet, PieChart, Activity, ChevronDown, ChevronUp } from "lucide-react";

// 모의 데이터
const mockData = {
  overallScore: 7.2,
  evaluation: "전반적으로 안정적인 투자 패턴을 보이고 있습니다.",
  recentTrades: [
    { id: 1, coin: "BTC", type: "buy", amount: 0.05, price: 67250, date: "2024-11-25", evaluation: "good", comment: "좋은 진입점" },
    { id: 2, coin: "ETH", type: "sell", amount: 2.5, price: 3420, date: "2024-11-24", evaluation: "neutral", comment: "적절한 익절" },
    { id: 3, coin: "SOL", type: "buy", amount: 15, price: 245, date: "2024-11-23", evaluation: "bad", comment: "고점 매수 주의" },
    { id: 4, coin: "DOGE", type: "buy", amount: 1000, price: 0.42, date: "2024-11-22", evaluation: "neutral", comment: "변동성 큰 종목" },
    { id: 5, coin: "BTC", type: "sell", amount: 0.02, price: 68100, date: "2024-11-21", evaluation: "good", comment: "적절한 차익 실현" },
    { id: 6, coin: "ETH", type: "buy", amount: 1.5, price: 3280, date: "2024-11-20", evaluation: "good", comment: "저점 매수" },
    { id: 7, coin: "AVAX", type: "buy", amount: 50, price: 38, date: "2024-11-19", evaluation: "neutral", comment: "분산 투자" },
  ],
  portfolio: [
    { coin: "BTC", amount: 0.15, value: 10087.5, allocation: 45, change24h: 2.3 },
    { coin: "ETH", amount: 5.2, value: 17784, allocation: 35, change24h: -1.2 },
    { coin: "SOL", amount: 20, value: 4900, allocation: 15, change24h: 5.7 },
    { coin: "기타", amount: 0, value: 1228.5, allocation: 5, change24h: 0.5 },
  ],
  investStyle: {
    riskLevel: "중간",
    tradingFrequency: "주 3-5회",
    preferredCoins: ["BTC", "ETH", "SOL"],
    avgHoldingPeriod: "2-5일",
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

export default function HomePage() {
  const { overallScore, evaluation, recentTrades, portfolio, investStyle } = mockData;
  const totalValue = portfolio.reduce((sum, p) => sum + p.value, 0);
  const [isExpanded, setIsExpanded] = useState(false);
  const dateRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const displayedTrades = isExpanded ? recentTrades : recentTrades.slice(0, INITIAL_TRADES_COUNT);
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
    // 먼저 확장
    if (!isExpanded) {
      setIsExpanded(true);
      // 약간의 딜레이 후 스크롤 (확장 애니메이션 완료 후)
      setTimeout(() => {
        dateRefs.current[date]?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 100);
    } else {
      dateRefs.current[date]?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
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
                    width: `${100 - overallScore * 10}%`,
                    marginLeft: `${overallScore * 10}%`,
                  }}
                />
              </div>
              <div className="flex justify-between text-xs mt-1 text-base-content/60">
                <span>위험</span>
                <span>보통</span>
                <span>양호</span>
              </div>
            </div>
            <div className={`text-4xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore.toFixed(1)}
            </div>
          </div>

          {/* 이모티콘과 한 줄 평가 */}
          <div className="flex items-center gap-3 mt-2 p-3 bg-base-100 rounded-lg">
            <span className="text-3xl">{getScoreEmoji(overallScore)}</span>
            <p className="text-sm text-base-content/80">{evaluation}</p>
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
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <>
                  <ChevronUp className="w-4 h-4" />
                  접기
                </>
              ) : (
                <>
                  <ChevronDown className="w-4 h-4" />
                  {recentTrades.length - INITIAL_TRADES_COUNT}개 더보기
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
              <div className="stat-desc flex items-center gap-1 text-success">
                <TrendingUp className="w-4 h-4" />
                전일 대비 +2.1%
              </div>
            </div>
          </div>

          {/* 자산 배분 */}
          <div className="space-y-3 mt-4">
            {portfolio.map((asset) => (
              <div key={asset.coin} className="bg-base-100 p-3 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{asset.coin}</span>
                    <span className="text-xs text-base-content/60">
                      {asset.coin !== "기타" && `${asset.amount} ${asset.coin}`}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold">${asset.value.toLocaleString()}</div>
                    <div className={`text-xs flex items-center gap-1 ${asset.change24h >= 0 ? "text-success" : "text-error"}`}>
                      {asset.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      {asset.change24h >= 0 ? "+" : ""}{asset.change24h}%
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <progress
                    className={`progress ${asset.allocation >= 40 ? "progress-primary" : asset.allocation >= 20 ? "progress-secondary" : "progress-accent"} flex-1`}
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
              <div className="badge badge-warning badge-lg">{investStyle.riskLevel}</div>
            </div>
            <div className="bg-base-100 p-3 rounded-lg text-center">
              <div className="text-xs text-base-content/60 mb-1">거래 빈도</div>
              <div className="text-sm font-semibold">{investStyle.tradingFrequency}</div>
            </div>
            <div className="bg-base-100 p-3 rounded-lg text-center">
              <div className="text-xs text-base-content/60 mb-1">평균 보유기간</div>
              <div className="text-sm font-semibold">{investStyle.avgHoldingPeriod}</div>
            </div>
            <div className="bg-base-100 p-3 rounded-lg text-center">
              <div className="text-xs text-base-content/60 mb-1">선호 코인</div>
              <div className="flex gap-1 justify-center flex-wrap">
                {investStyle.preferredCoins.map((coin) => (
                  <span key={coin} className="badge badge-sm badge-outline">{coin}</span>
                ))}
              </div>
            </div>
          </div>

          {/* 종합 평가 */}
          <div className="alert mt-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-info shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h3 className="font-bold text-sm">투자 조언</h3>
              <div className="text-xs">BTC 비중이 높은 안정적인 포트폴리오입니다. SOL 고점 매수에 주의하세요.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
