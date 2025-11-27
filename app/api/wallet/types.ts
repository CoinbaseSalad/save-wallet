// app/api/wallet/types.ts
// 지갑 API 공통 타입 정의

// ============================================
// 공통 타입
// ============================================

// 위험도 레벨
export type RiskLevel = 'safe' | 'caution' | 'warning';

// 거래 평가
export type TradeEvaluation = 'good' | 'neutral' | 'bad';

// 중요도
export type Importance = 'high' | 'medium' | 'low';

// 지원 체인
export type SupportedChain = 'base' | 'ethereum' | 'polygon' | 'arbitrum';

// ============================================
// 에러 타입
// ============================================

export interface ApiError {
  code: string;
  message: string;
  details?: object;
}

// 에러 코드 상수
export const ERROR_CODES = {
  MISSING_ADDRESS: 'MISSING_ADDRESS',
  INVALID_ADDRESS: 'INVALID_ADDRESS',
  UNSUPPORTED_CHAIN: 'UNSUPPORTED_CHAIN',
  WALLET_NOT_FOUND: 'WALLET_NOT_FOUND',
  MORALIS_ERROR: 'MORALIS_ERROR',
  GOPLUS_ERROR: 'GOPLUS_ERROR',
  FLOCK_AI_ERROR: 'FLOCK_AI_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const;

// ============================================
// 요청 타입
// ============================================

// 사용자 설정 (클라이언트에서 보내는 형태)
export interface UserSettingsRequest {
  investmentStyle: number;      // 0: 안정형 ~ 4: 공격투자형
  livingExpenseRatio: number;   // 생활비 비율 (%)
  investmentRatio: number;      // 투자 비율 (%)
  roastLevel: number;           // 0: Kind ~ 4: Hot
}

// 지갑 분석 요청
export interface AnalyzeRequest {
  walletAddress: string;
  chainKey: string;
  userSettings: UserSettingsRequest;
}

// 자산 조회 요청
export interface AssetsRequest {
  walletAddress: string;
  chainKey: string;
}

// 검색 요청 (Search 화면용)
export interface SearchRequest {
  walletAddress: string;
  chainKey: string;
  viewerSettings: {
    roastLevel: number;
  };
}

// ============================================
// 응답 타입 - 공통
// ============================================

// 기본 응답 구조
export interface BaseResponse {
  success: boolean;
  error?: ApiError;
  timestamp: string;
}

// ============================================
// 응답 타입 - Analyze API
// ============================================

// AI 평가 결과
export interface AIEvaluation {
  overallScore: number;           // 0-10 지갑 건강도 점수
  evaluation: string;             // 한 줄 평가
  riskLevel: string;              // 위험도 레벨 (낮음/중간/높음)
  tradingFrequency: string;       // 거래 빈도 분석
  investmentStyleMatch: string;   // 투자 성향 일치도
  portfolioAdvice: string;        // 포트폴리오 조언
  riskWarnings: string[];         // 위험 경고
  improvementSuggestions: string[]; // 개선 제안
}

// 거래 내역 평가
export interface TradeEvaluationItem {
  hash: string;
  coin: string;
  coinLogo: string;
  type: 'buy' | 'sell';
  amount: string;
  price: number;
  valueUsd: number;
  date: string;
  evaluation: TradeEvaluation;
  comment: string;
}

// 포트폴리오 코인 요약
export interface PortfolioCoinSummary {
  symbol: string;
  name: string;
  logo: string;
  amount: string;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
}

// 포트폴리오 요약
export interface PortfolioSummary {
  totalValueUsd: number;
  totalChange24h: number;
  totalChangeValue: number;
  coins: PortfolioCoinSummary[];
}

// 투자 성향 분석
export interface InvestStyleAnalysis {
  riskLevel: string;
  tradingFrequency: string;
  preferredCoins: string[];
  avgHoldingPeriod: string;
  diversificationScore: number;
}

// Analyze API 응답 데이터
export interface AnalyzeResponseData {
  walletAddress: string;
  chainKey: string;
  aiEvaluation: AIEvaluation;
  recentTrades: TradeEvaluationItem[];
  portfolio: PortfolioSummary;
  investStyle: InvestStyleAnalysis;
}

// Analyze API 전체 응답
export interface AnalyzeResponse extends BaseResponse {
  data?: AnalyzeResponseData;
}

// ============================================
// 응답 타입 - Assets API
// ============================================

// 근거 링크
export interface RiskSource {
  title: string;
  url: string;
  importance: Importance;
  summary: string;
}

// 보안 정보
export interface SecurityInfo {
  isVerified: boolean;
  isHoneypot: boolean;
  buyTax: number;
  sellTax: number;
  riskScore: number;
  isProxy?: boolean;
  isMintable?: boolean;
  ownerChangeBalance?: boolean;
  hiddenOwner?: boolean;
}

// 코인 상세 정보
export interface CoinDetail {
  symbol: string;
  name: string;
  logo: string;
  contractAddress: string | null;
  amount: string;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
  riskLevel: RiskLevel;
  riskReason: string | null;
  riskSources: RiskSource[];
  securityInfo: SecurityInfo;
}

// 위험도 요약
export interface RiskSummary {
  warning: number;
  caution: number;
  safe: number;
}

// 자산 요약
export interface AssetsSummary {
  totalValueUsd: number;
  totalChange24h: number;
  totalChangeValue: number;
  totalCoins: number;
  riskSummary: RiskSummary;
}

// 배분 차트 아이템
export interface AllocationChartItem {
  symbol: string;
  percentage: number;
  riskLevel: RiskLevel;
}

// 포트폴리오 분석
export interface PortfolioAnalysis {
  summary: string[];
  allocationChart: AllocationChartItem[];
}

// Assets API 응답 데이터
export interface AssetsResponseData {
  walletAddress: string;
  chainKey: string;
  summary: AssetsSummary;
  coins: CoinDetail[];
  portfolioAnalysis: PortfolioAnalysis;
}

// Assets API 전체 응답
export interface AssetsResponse extends BaseResponse {
  data?: AssetsResponseData;
}

// ============================================
// 유틸리티 타입
// ============================================

// 지원 체인 배열
export const SUPPORTED_CHAINS: SupportedChain[] = ['base', 'ethereum', 'polygon', 'arbitrum'];

// 체인 ID 매핑
export const CHAIN_IDS: Record<SupportedChain, number> = {
  base: 8453,
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
};

// 체인별 탐색기 URL
export const CHAIN_EXPLORERS: Record<SupportedChain, string> = {
  base: 'https://basescan.org',
  ethereum: 'https://etherscan.io',
  polygon: 'https://polygonscan.com',
  arbitrum: 'https://arbiscan.io',
};

// 투자 성향 레이블
export const INVESTMENT_STYLE_LABELS = [
  { value: 0, label: '안정형', description: '원금 보존 최우선', emoji: '🛡️' },
  { value: 1, label: '안정추구형', description: '안정적 수익 추구', emoji: '🌿' },
  { value: 2, label: '위험중립형', description: '위험-수익 균형', emoji: '⚖️' },
  { value: 3, label: '적극투자형', description: '높은 수익 추구', emoji: '🚀' },
  { value: 4, label: '공격투자형', description: '최대 수익 추구', emoji: '🔥' },
] as const;

// Roast 레벨 레이블
export const ROAST_LEVEL_LABELS = [
  { value: 0, label: 'Kind', description: '부드럽고 격려하는 피드백', emoji: '😊' },
  { value: 1, label: 'Mild', description: '친절하지만 솔직한 피드백', emoji: '🙂' },
  { value: 2, label: 'Medium', description: '균형 잡힌 현실적인 피드백', emoji: '😐' },
  { value: 3, label: 'Spicy', description: '직설적이고 날카로운 피드백', emoji: '😤' },
  { value: 4, label: 'Hot', description: '매우 직설적인 피드백', emoji: '🔥' },
] as const;

