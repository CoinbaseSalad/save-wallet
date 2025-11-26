"use client";

import { TrendingUp, TrendingDown, AlertTriangle, AlertCircle, ExternalLink, Wallet, ChevronDown } from "lucide-react";

// 코인 이미지 URL (실제 서비스에서는 API에서 가져옴)
const coinImages: Record<string, string> = {
  BTC: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
  ETH: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  SOL: "https://cryptologos.cc/logos/solana-sol-logo.png",
  DOGE: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
  PEPE: "https://cryptologos.cc/logos/pepe-pepe-logo.png",
  XRP: "https://cryptologos.cc/logos/xrp-xrp-logo.png",
};

// 위험도 타입
type RiskLevel = "safe" | "caution" | "warning";

// 중요도 타입
type Importance = "high" | "medium" | "low";

// 근거 링크 타입
interface RiskSource {
  title: string;
  url: string;
  importance: Importance;
}

// 모의 데이터
const mockPortfolio = {
  totalValue: 34000,
  totalChange24h: 2.5,
  totalChangeValue: 850,
  coins: [
    {
      symbol: "BTC",
      name: "Bitcoin",
      amount: 0.15,
      value: 10087.5,
      price: 67250,
      change24h: 2.3,
      riskLevel: "safe" as RiskLevel,
      riskReason: null,
      riskSources: [] as RiskSource[],
    },
    {
      symbol: "ETH",
      name: "Ethereum",
      amount: 5.2,
      value: 17784,
      price: 3420,
      change24h: -1.2,
      riskLevel: "caution" as RiskLevel,
      riskReason: "최근 네트워크 혼잡으로 가스비 급등",
      riskSources: [
        { title: "Etherscan Gas Tracker - 현재 가스비 급등 확인", url: "https://etherscan.io/gastracker", importance: "high" as Importance },
        { title: "ETH 네트워크 혼잡도 분석 리포트", url: "https://etherscan.io/chart/networkutilization", importance: "high" as Importance },
        { title: "이더리움 재단 공식 블로그", url: "https://blog.ethereum.org", importance: "medium" as Importance },
        { title: "DeFi 프로토콜 TVL 현황", url: "https://defillama.com", importance: "medium" as Importance },
        { title: "ETH 가격 변동 히스토리", url: "https://coingecko.com/eth", importance: "low" as Importance },
      ] as RiskSource[],
    },
    {
      symbol: "SOL",
      name: "Solana",
      amount: 20,
      value: 4900,
      price: 245,
      change24h: 5.7,
      riskLevel: "warning" as RiskLevel,
      riskReason: "단기 급등으로 조정 가능성 높음",
      riskSources: [
        { title: "SOL 7일 급등률 47% - 과매수 구간 진입", url: "https://solscan.io", importance: "high" as Importance },
        { title: "RSI 지표 80 이상 - 기술적 조정 신호", url: "https://tradingview.com/sol", importance: "high" as Importance },
        { title: "솔라나 네트워크 장애 이력 분석", url: "https://status.solana.com", importance: "high" as Importance },
        { title: "SOL 생태계 TVL 급증 현황", url: "https://defillama.com/chain/solana", importance: "medium" as Importance },
        { title: "주요 거래소 SOL 거래량 분석", url: "https://coinmarketcap.com/sol", importance: "medium" as Importance },
        { title: "솔라나 밈코인 열풍 관련 뉴스", url: "https://decrypt.co/solana", importance: "low" as Importance },
        { title: "SOL 스테이킹 수익률 변화", url: "https://solanabeach.io/validators", importance: "low" as Importance },
      ] as RiskSource[],
    },
    {
      symbol: "DOGE",
      name: "Dogecoin",
      amount: 1000,
      value: 420,
      price: 0.42,
      change24h: -3.5,
      riskLevel: "warning" as RiskLevel,
      riskReason: "높은 변동성, 밈코인 특성상 급락 위험",
      riskSources: [
        { title: "밈코인 시장 변동성 경고 - 블룸버그", url: "https://bloomberg.com/crypto", importance: "high" as Importance },
        { title: "DOGE 30일 변동성 분석 (±40%)", url: "https://dogechain.info", importance: "high" as Importance },
        { title: "일론 머스크 트윗 영향도 분석", url: "https://twitter.com/elonmusk", importance: "medium" as Importance },
        { title: "DOGE 고래 지갑 이동 모니터링", url: "https://bitinfocharts.com/doge", importance: "medium" as Importance },
        { title: "밈코인 투자 리스크 가이드", url: "https://investopedia.com/memecoins", importance: "low" as Importance },
      ] as RiskSource[],
    },
    {
      symbol: "XRP",
      name: "Ripple",
      amount: 500,
      value: 808.5,
      price: 1.617,
      change24h: 1.8,
      riskLevel: "caution" as RiskLevel,
      riskReason: "SEC 소송 관련 불확실성 존재",
      riskSources: [
        { title: "SEC vs Ripple 소송 진행 현황", url: "https://xrpscan.com", importance: "high" as Importance },
        { title: "리플 법률팀 공식 성명", url: "https://ripple.com/insights", importance: "high" as Importance },
        { title: "XRP 규제 리스크 분석 리포트", url: "https://messari.io/xrp", importance: "medium" as Importance },
        { title: "미국 암호화폐 규제 동향", url: "https://sec.gov/crypto", importance: "medium" as Importance },
        { title: "XRP 레저 네트워크 현황", url: "https://xrpl.org", importance: "low" as Importance },
        { title: "리플넷 파트너십 현황", url: "https://ripple.com/ripplenet", importance: "low" as Importance },
      ] as RiskSource[],
    },
  ],
};

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

export default function ReportPage() {
  const { totalValue, totalChange24h, totalChangeValue, coins } = mockPortfolio;

  return (
    <div className="p-4 space-y-6">
      {/* 전체 자산 현황 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Wallet className="w-5 h-5 text-primary" />
            전체 자산 현황
          </h2>

          <div className="stats bg-base-100 shadow w-full">
            <div className="stat">
              <div className="stat-title">총 자산</div>
              <div className="stat-value text-primary">${totalValue.toLocaleString()}</div>
              <div className={`stat-desc flex items-center gap-1 ${totalChange24h >= 0 ? "text-success" : "text-error"}`}>
                {totalChange24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                {totalChange24h >= 0 ? "+" : ""}{totalChange24h}% (${totalChangeValue.toLocaleString()})
              </div>
            </div>
            <div className="stat">
              <div className="stat-title">보유 코인</div>
              <div className="stat-value">{coins.length}</div>
              <div className="stat-desc">종목</div>
            </div>
          </div>

          {/* 위험 요약 */}
          <div className="flex gap-2 mt-2">
            <div className="badge badge-error gap-1">
              <AlertTriangle className="w-3 h-3" />
              경고 {coins.filter((c) => c.riskLevel === "warning").length}
            </div>
            <div className="badge badge-warning gap-1">
              <AlertCircle className="w-3 h-3" />
              주의 {coins.filter((c) => c.riskLevel === "caution").length}
            </div>
            <div className="badge badge-success gap-1">
              양호 {coins.filter((c) => c.riskLevel === "safe").length}
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

        {coins.map((coin) => (
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
                      {coinImages[coin.symbol] ? (
                        <img
                          src={coinImages[coin.symbol]}
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
                      <div className="font-bold text-lg">${coin.value.toLocaleString()}</div>
                      <div className={`text-xs flex items-center justify-end gap-1 ${coin.change24h >= 0 ? "text-success" : "text-error"}`}>
                        {coin.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                        {coin.change24h >= 0 ? "+" : ""}{coin.change24h}%
                      </div>
                    </div>
                  </div>

                  {/* 보유량 및 가격 */}
                  <div className="flex items-center justify-between mt-2 text-sm text-base-content/70">
                    <span>보유량: {coin.amount.toLocaleString()} {coin.symbol}</span>
                    <span>@${coin.price.toLocaleString()}</span>
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
        ))}
      </div>

      {/* 전체 포트폴리오 분석 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h3 className="card-title text-lg">포트폴리오 분석</h3>

          <div className="alert alert-info">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <div>
              <h4 className="font-bold text-sm">포트폴리오 요약</h4>
              <ul className="text-xs mt-1 space-y-1">
                <li>• BTC/ETH 비중 82% - 안정적인 대형 코인 중심</li>
                <li>• SOL, DOGE는 높은 변동성 주의 필요</li>
                <li>• 전체 위험도: 중간</li>
              </ul>
            </div>
          </div>

          {/* 자산 배분 차트 (간단한 bar) */}
          <div className="mt-4 space-y-2">
            <div className="text-sm font-semibold mb-2">자산 배분</div>
            {coins.map((coin) => {
              const percentage = (coin.value / totalValue) * 100;
              return (
                <div key={coin.symbol} className="flex items-center gap-2">
                  <span className="w-12 text-xs font-medium">{coin.symbol}</span>
                  <progress
                    className={`progress flex-1 ${coin.riskLevel === "warning"
                      ? "progress-error"
                      : coin.riskLevel === "caution"
                        ? "progress-warning"
                        : "progress-success"
                      }`}
                    value={percentage}
                    max="100"
                  />
                  <span className="w-12 text-xs text-right">{percentage.toFixed(1)}%</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
