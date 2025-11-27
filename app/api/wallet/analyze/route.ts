// app/api/wallet/analyze/route.ts
// 지갑 종합 분석 API - Home 및 Search 화면에서 사용

import { NextRequest, NextResponse } from 'next/server';
import {
  performWalletAnalysis,
  UserSettings,
  GoPlusTokenSecurity,
  PortfolioCoin,
  TokenTransfer,
} from '@/lib/moralis';

// Node.js Runtime 사용 (Moralis SDK가 Edge Runtime과 호환되지 않음)
export const runtime = 'nodejs';

// 목업 모드 환경 변수 (true면 실제 API 호출 대신 목업 데이터 반환)
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

// API 요청 타입
interface AnalyzeRequest {
  walletAddress: string;
  chainKey: string;
  userSettings: {
    investmentStyle: number;
    livingExpenseRatio: number;
    investmentRatio: number;
    roastLevel: number;
  };
}

// 거래 평가 타입
interface TradeEvaluationResponse {
  hash: string;
  coin: string;
  coinLogo: string;
  type: 'buy' | 'sell';
  amount: string;
  price: number;
  valueUsd: number;
  date: string;
  evaluation: 'good' | 'neutral' | 'bad';
  comment: string;
}

// API 응답 타입
interface AnalyzeResponse {
  success: boolean;
  data?: {
    walletAddress: string;
    chainKey: string;
    aiEvaluation: {
      overallScore: number;
      evaluation: string;
      riskLevel: string;
      tradingFrequency: string;
      investmentStyleMatch: string;
      portfolioAdvice: string;
      riskWarnings: string[];
      improvementSuggestions: string[];
    };
    recentTrades: TradeEvaluationResponse[];
    portfolio: {
      totalValueUsd: number;
      totalChange24h: number;
      totalChangeValue: number;
      coins: Array<{
        symbol: string;
        name: string;
        logo: string;
        amount: string;
        value: number;
        price: number;
        change24h: number;
        allocation: number;
      }>;
    };
    investStyle: {
      riskLevel: string;
      tradingFrequency: string;
      preferredCoins: string[];
      avgHoldingPeriod: string;
      diversificationScore: number;
    };
  };
  error?: {
    code: string;
    message: string;
    details?: object;
  };
  timestamp: string;
}

// 지갑 주소 유효성 검사
function isValidAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// 지원 체인 목록
const SUPPORTED_CHAINS = ['base', 'ethereum', 'polygon', 'arbitrum'];

// ============================================
// 목업 데이터 (flock API 비용 절감용)
// ============================================
const MOCK_RESPONSE: AnalyzeResponse = {
  success: true,
  data: {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    chainKey: 'base',
    aiEvaluation: {
      overallScore: 7.2,
      evaluation: '전반적으로 안정적인 투자 패턴을 보이고 있습니다. BTC/ETH 중심의 포트폴리오로 리스크 관리가 잘 되어 있습니다.',
      riskLevel: '중간',
      tradingFrequency: '주 3-5회',
      investmentStyleMatch: '사용자의 투자 성향과 82% 일치합니다.',
      portfolioAdvice: 'BTC 비중이 높은 안정적인 포트폴리오입니다. SOL 고점 매수에 주의하세요. 밈코인 비중을 줄이고 스테이블코인 비중을 늘리는 것을 권장합니다.',
      riskWarnings: [
        'SOL 단기 급등으로 조정 가능성 있음',
        'DOGE는 높은 변동성 주의 필요',
      ],
      improvementSuggestions: [
        '스테이블코인(USDC, USDT) 10-15% 비중 추가 권장',
        '밈코인 비중을 5% 이하로 줄이기',
        '분산투자를 위해 DeFi 토큰 검토',
      ],
    },
    recentTrades: [
      {
        hash: '0xabc123...',
        coin: 'BTC',
        coinLogo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        type: 'buy',
        amount: '0.05',
        price: 67250,
        valueUsd: 3362.5,
        date: '2024-11-25',
        evaluation: 'good',
        comment: '좋은 진입점입니다. 지지선 근처에서 매수했습니다.',
      },
      {
        hash: '0xdef456...',
        coin: 'ETH',
        coinLogo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        type: 'sell',
        amount: '2.5',
        price: 3420,
        valueUsd: 8550,
        date: '2024-11-24',
        evaluation: 'neutral',
        comment: '적절한 익절입니다. 다만 조금 더 기다렸으면 좋았을 수 있습니다.',
      },
      {
        hash: '0xghi789...',
        coin: 'SOL',
        coinLogo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        type: 'buy',
        amount: '15',
        price: 245,
        valueUsd: 3675,
        date: '2024-11-23',
        evaluation: 'bad',
        comment: '고점 매수 주의! RSI가 과매수 구간입니다.',
      },
      {
        hash: '0xjkl012...',
        coin: 'DOGE',
        coinLogo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
        type: 'buy',
        amount: '1000',
        price: 0.42,
        valueUsd: 420,
        date: '2024-11-22',
        evaluation: 'neutral',
        comment: '밈코인 투자는 변동성이 큽니다. 비중 관리에 주의하세요.',
      },
      {
        hash: '0xmno345...',
        coin: 'BTC',
        coinLogo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        type: 'sell',
        amount: '0.02',
        price: 68100,
        valueUsd: 1362,
        date: '2024-11-21',
        evaluation: 'good',
        comment: '적절한 차익 실현입니다.',
      },
      {
        hash: '0xpqr678...',
        coin: 'ETH',
        coinLogo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        type: 'buy',
        amount: '1.5',
        price: 3280,
        valueUsd: 4920,
        date: '2024-11-20',
        evaluation: 'good',
        comment: '저점 매수! 좋은 타이밍입니다.',
      },
      {
        hash: '0xstu901...',
        coin: 'AVAX',
        coinLogo: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
        type: 'buy',
        amount: '50',
        price: 38,
        valueUsd: 1900,
        date: '2024-11-19',
        evaluation: 'neutral',
        comment: '분산 투자 차원에서 좋은 선택입니다.',
      },
    ],
    portfolio: {
      totalValueUsd: 34000,
      totalChange24h: 2.1,
      totalChangeValue: 714,
      coins: [
        {
          symbol: 'BTC',
          name: 'Bitcoin',
          logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
          amount: '0.15',
          value: 10087.5,
          price: 67250,
          change24h: 2.3,
          allocation: 45,
        },
        {
          symbol: 'ETH',
          name: 'Ethereum',
          logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
          amount: '5.2',
          value: 17784,
          price: 3420,
          change24h: -1.2,
          allocation: 35,
        },
        {
          symbol: 'SOL',
          name: 'Solana',
          logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
          amount: '20',
          value: 4900,
          price: 245,
          change24h: 5.7,
          allocation: 15,
        },
        {
          symbol: 'DOGE',
          name: 'Dogecoin',
          logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
          amount: '1000',
          value: 420,
          price: 0.42,
          change24h: -3.5,
          allocation: 3,
        },
        {
          symbol: 'USDC',
          name: 'USD Coin',
          logo: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
          amount: '808.5',
          value: 808.5,
          price: 1,
          change24h: 0,
          allocation: 2,
        },
      ],
    },
    investStyle: {
      riskLevel: '중간',
      tradingFrequency: '주 3-5회',
      preferredCoins: ['BTC', 'ETH', 'SOL'],
      avgHoldingPeriod: '2-5일',
      diversificationScore: 65,
    },
  },
  timestamp: new Date().toISOString(),
};

// 평균 보유 기간 계산
function calculateAvgHoldingPeriod(transfers: TokenTransfer[]): string {
  if (transfers.length === 0) return '데이터 없음';
  if (transfers.length < 5) return '1주일 이상';
  if (transfers.length < 15) return '2-5일';
  if (transfers.length < 30) return '1-2일';
  return '24시간 미만';
}

// 24시간 변동률 합계 계산
function calculateTotalChange24h(coins: PortfolioCoin[]): { percent: number; value: number } {
  if (coins.length === 0) return { percent: 0, value: 0 };

  let totalChange = 0;
  let totalValue = 0;

  coins.forEach((coin) => {
    totalValue += coin.value;
    totalChange += coin.value * (coin.change24h / 100);
  });

  return {
    percent: totalValue > 0 ? (totalChange / totalValue) * 100 : 0,
    value: totalChange,
  };
}

// 거래 내역을 API 응답 형식으로 변환
function formatTrades(
  transfers: TokenTransfer[],
  walletAddress: string,
  aiEvaluations?: Array<{ hash: string; evaluation: string; comment: string }>
): TradeEvaluationResponse[] {
  return transfers.slice(0, 15).map((transfer) => {
    const isIncoming = transfer.to.toLowerCase() === walletAddress.toLowerCase();
    const aiEval = aiEvaluations?.find(
      (e) => e.hash === transfer.hash.slice(0, 10) || e.hash === transfer.hash
    );

    return {
      hash: transfer.hash,
      coin: transfer.tokenSymbol,
      coinLogo: transfer.tokenLogo,
      type: isIncoming ? 'buy' : 'sell',
      amount: transfer.valueFormatted,
      price: 0, // 실시간 가격은 별도 조회 필요
      valueUsd: 0, // USD 가치는 별도 계산 필요
      date: transfer.blockTimestamp?.split('T')[0] || '',
      evaluation: (aiEval?.evaluation as 'good' | 'neutral' | 'bad') || 'neutral',
      comment: aiEval?.comment || '',
    };
  });
}

// 위험도에 따른 보안 정보 요약
function formatSecuritySummary(securityData: Map<string, GoPlusTokenSecurity>): string[] {
  const warnings: string[] = [];

  securityData.forEach((security, address) => {
    if (security.isHoneypot) {
      warnings.push(`허니팟 토큰 감지: ${address.slice(0, 10)}...`);
    }
    if (security.sellTax > 10) {
      warnings.push(`높은 판매세 (${security.sellTax}%): ${address.slice(0, 10)}...`);
    }
    if (security.cannotSellAll) {
      warnings.push(`전량 판매 불가 토큰: ${address.slice(0, 10)}...`);
    }
    if (security.ownerChangeBalance) {
      warnings.push(`소유자 잔액 변경 가능: ${address.slice(0, 10)}...`);
    }
  });

  return warnings;
}

export async function POST(request: NextRequest): Promise<NextResponse<AnalyzeResponse>> {
  const timestamp = new Date().toISOString();

  try {
    // 요청 본문 파싱
    const body: AnalyzeRequest = await request.json();
    const { walletAddress, chainKey, userSettings } = body;

    // 목업 모드: 실제 API 호출 없이 목업 데이터 반환
    if (USE_MOCK_DATA) {
      console.log('[analyze] 목업 모드 활성화 - 목업 데이터 반환');
      // 요청된 지갑 주소로 목업 데이터 업데이트
      const mockResponse = {
        ...MOCK_RESPONSE,
        data: MOCK_RESPONSE.data ? {
          ...MOCK_RESPONSE.data,
          walletAddress: walletAddress || MOCK_RESPONSE.data.walletAddress,
          chainKey: chainKey || MOCK_RESPONSE.data.chainKey,
        } : undefined,
        timestamp,
      };
      return NextResponse.json(mockResponse, { status: 200 });
    }

    // 필수 파라미터 검증
    if (!walletAddress) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ADDRESS',
            message: '지갑 주소가 필요합니다.',
          },
          timestamp,
        },
        { status: 400 }
      );
    }

    // 지갑 주소 형식 검증
    if (!isValidAddress(walletAddress)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ADDRESS',
            message: '유효하지 않은 지갑 주소입니다.',
            details: { walletAddress },
          },
          timestamp,
        },
        { status: 400 }
      );
    }

    // 체인 검증
    const chain = (chainKey || 'base').toLowerCase();
    if (!SUPPORTED_CHAINS.includes(chain)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNSUPPORTED_CHAIN',
            message: '지원하지 않는 체인입니다.',
            details: { chainKey: chain, supported: SUPPORTED_CHAINS },
          },
          timestamp,
        },
        { status: 400 }
      );
    }

    // 사용자 설정 변환 (snake_case -> camelCase)
    const settings: UserSettings = {
      investmentStyle: userSettings?.investmentStyle ?? 2,
      livingExpenseRatio: userSettings?.livingExpenseRatio ?? 50,
      investmentRatio: userSettings?.investmentRatio ?? 30,
      roastLevel: userSettings?.roastLevel ?? 2,
    };

    // 지갑 분석 수행
    const analysisResult = await performWalletAnalysis(walletAddress, chain, settings);

    const { walletData, securityData, aiAnalysis } = analysisResult;

    // 24시간 변동률 계산
    const change24h = calculateTotalChange24h(walletData.portfolio.portfolioCoins);

    // 보안 경고 생성
    const securityWarnings = formatSecuritySummary(securityData);

    // AI 분석 결과가 있으면 사용, 없으면 기본값 사용
    const aiEvaluation = aiAnalysis
      ? {
        overallScore: aiAnalysis.overallScore,
        evaluation: aiAnalysis.evaluation,
        riskLevel: aiAnalysis.riskLevel,
        tradingFrequency: aiAnalysis.tradingFrequency,
        investmentStyleMatch: aiAnalysis.investmentStyleMatch,
        portfolioAdvice: aiAnalysis.portfolioAdvice,
        riskWarnings: [...(aiAnalysis.riskWarnings || []), ...securityWarnings],
        improvementSuggestions: aiAnalysis.improvementSuggestions || [],
      }
      : {
        overallScore: 5.0,
        evaluation: '지갑 분석을 완료했습니다. AI 분석은 현재 사용할 수 없습니다.',
        riskLevel: walletData.investmentMetrics.riskLevel,
        tradingFrequency: walletData.investmentMetrics.tradingFrequency,
        investmentStyleMatch: '분석 중...',
        portfolioAdvice: '포트폴리오 데이터를 확인하세요.',
        riskWarnings: securityWarnings,
        improvementSuggestions: [],
      };

    // 거래 내역 포맷
    const recentTrades = formatTrades(
      walletData.recentTransfers,
      walletAddress,
      aiAnalysis?.tradeEvaluations
    );

    // 응답 데이터 구성
    const response: AnalyzeResponse = {
      success: true,
      data: {
        walletAddress,
        chainKey: chain,
        aiEvaluation,
        recentTrades,
        portfolio: {
          totalValueUsd: walletData.portfolio.totalValueUsd,
          totalChange24h: change24h.percent,
          totalChangeValue: change24h.value,
          coins: walletData.portfolio.portfolioCoins.map((coin) => ({
            symbol: coin.symbol,
            name: coin.name,
            logo: coin.logo,
            amount: coin.amount,
            value: coin.value,
            price: coin.price,
            change24h: coin.change24h,
            allocation: coin.allocation,
          })),
        },
        investStyle: {
          riskLevel: walletData.investmentMetrics.riskLevel,
          tradingFrequency: walletData.investmentMetrics.tradingFrequency,
          preferredCoins: walletData.investmentMetrics.preferredCoins,
          avgHoldingPeriod: calculateAvgHoldingPeriod(walletData.recentTransfers),
          diversificationScore: walletData.investmentMetrics.diversificationScore,
        },
      },
      timestamp,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('지갑 분석 API 오류:', error);

    // 에러 타입에 따른 응답
    const errorMessage = error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.';

    // Moralis API 오류 체크
    if (errorMessage.includes('MORALIS')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MORALIS_ERROR',
            message: 'Moralis API 오류가 발생했습니다.',
            details: { originalError: errorMessage },
          },
          timestamp,
        },
        { status: 502 }
      );
    }

    // flock.io API 오류 체크
    if (errorMessage.includes('flock') || errorMessage.includes('FLOCK')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'FLOCK_AI_ERROR',
            message: 'AI 분석 서비스 오류가 발생했습니다.',
            details: { originalError: errorMessage },
          },
          timestamp,
        },
        { status: 502 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERNAL_ERROR',
          message: '서버 내부 오류가 발생했습니다.',
          details: { originalError: errorMessage },
        },
        timestamp,
      },
      { status: 500 }
    );
  }
}

