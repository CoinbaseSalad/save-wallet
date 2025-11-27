// app/api/wallet/assets/route.ts
// 자산 상세 정보 API - Asset 화면에서 사용

import { NextRequest, NextResponse } from 'next/server';
import {
  getWalletPortfolio,
  checkMultipleTokensSecurity,
  GoPlusTokenSecurity,
  PortfolioCoin,
} from '@/lib/moralis';

// Node.js Runtime 사용 (Moralis SDK가 Edge Runtime과 호환되지 않음)
export const runtime = 'nodejs';

// 위험도 타입
type RiskLevel = 'safe' | 'caution' | 'warning';

// 중요도 타입
type Importance = 'high' | 'medium' | 'low';

// API 요청 타입
interface AssetsRequest {
  walletAddress: string;
  chainKey: string;
}

// 근거 링크 타입
interface RiskSource {
  title: string;
  url: string;
  importance: Importance;
  summary: string;
}

// 보안 정보 타입
interface SecurityInfo {
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

// 코인 상세 정보 타입
interface CoinDetail {
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

// API 응답 타입
interface AssetsResponse {
  success: boolean;
  data?: {
    walletAddress: string;
    chainKey: string;
    summary: {
      totalValueUsd: number;
      totalChange24h: number;
      totalChangeValue: number;
      totalCoins: number;
      riskSummary: {
        warning: number;
        caution: number;
        safe: number;
      };
    };
    coins: CoinDetail[];
    portfolioAnalysis: {
      summary: string[];
      allocationChart: Array<{
        symbol: string;
        percentage: number;
        riskLevel: RiskLevel;
      }>;
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

// 체인별 탐색기 URL
const CHAIN_EXPLORERS: Record<string, string> = {
  base: 'https://basescan.org',
  ethereum: 'https://etherscan.io',
  polygon: 'https://polygonscan.com',
  arbitrum: 'https://arbiscan.io',
};

// 네이티브 토큰 심볼
const NATIVE_TOKENS = ['ETH', 'MATIC'];

// GoPlus 보안 데이터를 기반으로 위험 근거 생성
function generateRiskSources(
  coin: PortfolioCoin,
  security: GoPlusTokenSecurity | undefined,
  chainKey: string
): RiskSource[] {
  const sources: RiskSource[] = [];
  const explorer = CHAIN_EXPLORERS[chainKey] || CHAIN_EXPLORERS.ethereum;

  // 네이티브 토큰은 위험 소스 없음
  if (NATIVE_TOKENS.includes(coin.symbol.toUpperCase())) {
    return [];
  }

  if (!security) {
    // 보안 데이터 없는 경우
    if (coin.riskLevel !== 'safe') {
      sources.push({
        title: `${coin.symbol} - 보안 분석 데이터 미확인`,
        url: `https://gopluslabs.io/token-security`,
        importance: 'medium',
        summary: '보안 데이터를 확인할 수 없습니다. 거래 시 주의하세요.',
      });
    }
    return sources;
  }

  // 치명적 위험 요소
  if (security.isHoneypot) {
    sources.push({
      title: `⚠️ 허니팟 경고 - 판매 불가능 토큰`,
      url: `https://gopluslabs.io/token-security/${chainKey}/${security.contractAddress}`,
      importance: 'high',
      summary: '이 토큰은 허니팟으로 분류됩니다. 구매 후 판매가 불가능할 수 있습니다.',
    });
  }

  if (security.cannotSellAll) {
    sources.push({
      title: `⚠️ 전량 판매 제한`,
      url: `https://gopluslabs.io/token-security/${chainKey}/${security.contractAddress}`,
      importance: 'high',
      summary: '보유 토큰의 전량 판매가 제한될 수 있습니다.',
    });
  }

  // 높은 세금
  if (security.buyTax > 5 || security.sellTax > 5) {
    sources.push({
      title: `거래세 분석 - 구매세: ${security.buyTax}%, 판매세: ${security.sellTax}%`,
      url: `https://gopluslabs.io/token-security/${chainKey}/${security.contractAddress}`,
      importance: security.sellTax > 10 ? 'high' : 'medium',
      summary: `거래 시 ${Math.max(security.buyTax, security.sellTax)}%의 세금이 부과됩니다.`,
    });
  }

  // 소유자 위험
  if (security.ownerChangeBalance) {
    sources.push({
      title: `🟠 소유자 권한 경고 - 잔액 변경 가능`,
      url: `${explorer}/address/${security.contractAddress}`,
      importance: 'high',
      summary: '컨트랙트 소유자가 사용자의 잔액을 변경할 수 있는 권한을 가집니다.',
    });
  }

  if (security.hiddenOwner) {
    sources.push({
      title: `🟠 숨겨진 소유자 감지`,
      url: `${explorer}/address/${security.contractAddress}`,
      importance: 'high',
      summary: '컨트랙트에 숨겨진 소유자 패턴이 감지되었습니다.',
    });
  }

  // 중간 위험
  if (security.isProxy) {
    sources.push({
      title: `프록시 컨트랙트 - 업그레이드 가능`,
      url: `${explorer}/address/${security.contractAddress}`,
      importance: 'medium',
      summary: '이 토큰은 프록시 컨트랙트로, 로직이 변경될 수 있습니다.',
    });
  }

  if (security.isMintable) {
    sources.push({
      title: `민트 가능 토큰 - 추가 발행 가능`,
      url: `${explorer}/address/${security.contractAddress}`,
      importance: 'medium',
      summary: '토큰이 추가 발행될 수 있어 가치 희석 가능성이 있습니다.',
    });
  }

  if (security.transferPausable) {
    sources.push({
      title: `전송 일시정지 기능`,
      url: `${explorer}/address/${security.contractAddress}`,
      importance: 'medium',
      summary: '토큰 전송이 일시적으로 중단될 수 있습니다.',
    });
  }

  // 기타 정보
  if (security.isBlacklisted) {
    sources.push({
      title: `블랙리스트 기능 존재`,
      url: `${explorer}/address/${security.contractAddress}`,
      importance: 'low',
      summary: '특정 주소가 거래에서 차단될 수 있습니다.',
    });
  }

  // 24시간 가격 변동
  if (Math.abs(coin.change24h) > 15) {
    sources.push({
      title: `24시간 급격한 가격 변동: ${coin.change24h > 0 ? '+' : ''}${coin.change24h.toFixed(1)}%`,
      url: `https://www.coingecko.com/search?query=${coin.symbol}`,
      importance: coin.change24h > 30 || coin.change24h < -30 ? 'high' : 'medium',
      summary: `최근 24시간 동안 ${Math.abs(coin.change24h).toFixed(1)}%의 큰 가격 변동이 있었습니다.`,
    });
  }

  return sources;
}

// 위험 이유 생성
function generateRiskReason(
  coin: PortfolioCoin,
  security: GoPlusTokenSecurity | undefined
): string | null {
  if (coin.riskLevel === 'safe') return null;

  const reasons: string[] = [];

  if (security?.isHoneypot) {
    reasons.push('허니팟 토큰 (판매 불가)');
  }
  if (security && security.sellTax > 10) {
    reasons.push(`높은 판매세 (${security.sellTax}%)`);
  }
  if (security?.ownerChangeBalance) {
    reasons.push('소유자 권한 위험');
  }
  if (Math.abs(coin.change24h) > 20) {
    reasons.push('극심한 가격 변동성');
  }

  // 밈코인 체크
  const memeCoins = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'WOJAK', 'MEME'];
  if (memeCoins.includes(coin.symbol.toUpperCase())) {
    reasons.push('밈코인 특성상 높은 변동성');
  }

  return reasons.length > 0 ? reasons.join(', ') : '보안 검사 결과 주의 필요';
}

// 보안 정보 포맷
function formatSecurityInfo(security: GoPlusTokenSecurity | undefined): SecurityInfo {
  if (!security) {
    return {
      isVerified: false,
      isHoneypot: false,
      buyTax: 0,
      sellTax: 0,
      riskScore: 0,
    };
  }

  return {
    isVerified: !security.hiddenOwner && !security.isProxy,
    isHoneypot: security.isHoneypot,
    buyTax: security.buyTax,
    sellTax: security.sellTax,
    riskScore: security.riskScore,
    isProxy: security.isProxy,
    isMintable: security.isMintable,
    ownerChangeBalance: security.ownerChangeBalance,
    hiddenOwner: security.hiddenOwner,
  };
}

// 포트폴리오 분석 요약 생성
function generatePortfolioSummary(
  coins: CoinDetail[],
  totalValue: number
): string[] {
  const summaries: string[] = [];

  // 대형 코인 비중 계산
  const majorCoins = ['BTC', 'WBTC', 'ETH', 'WETH'];
  const majorAllocation = coins
    .filter((c) => majorCoins.includes(c.symbol.toUpperCase()))
    .reduce((sum, c) => sum + c.allocation, 0);

  if (majorAllocation >= 50) {
    summaries.push(`BTC/ETH 비중 ${majorAllocation.toFixed(0)}% - 안정적인 대형 코인 중심`);
  } else if (majorAllocation >= 20) {
    summaries.push(`대형 코인 비중 ${majorAllocation.toFixed(0)}% - 중간 수준의 안정성`);
  } else {
    summaries.push(`대형 코인 비중 ${majorAllocation.toFixed(0)}% - 고위험 포트폴리오`);
  }

  // 위험 토큰 체크
  const warningCoins = coins.filter((c) => c.riskLevel === 'warning');
  const cautionCoins = coins.filter((c) => c.riskLevel === 'caution');

  if (warningCoins.length > 0) {
    summaries.push(
      `${warningCoins.map((c) => c.symbol).join(', ')}는 높은 변동성 주의 필요`
    );
  }

  // 전체 위험도 평가
  if (warningCoins.length >= 3) {
    summaries.push('전체 위험도: 높음 - 포트폴리오 재조정 권장');
  } else if (warningCoins.length + cautionCoins.length >= 3) {
    summaries.push('전체 위험도: 중간');
  } else {
    summaries.push('전체 위험도: 낮음');
  }

  return summaries;
}

export async function POST(request: NextRequest): Promise<NextResponse<AssetsResponse>> {
  const timestamp = new Date().toISOString();

  try {
    // 요청 본문 파싱
    const body: AssetsRequest = await request.json();
    const { walletAddress, chainKey } = body;

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

    // 포트폴리오 데이터 조회
    const portfolio = await getWalletPortfolio(walletAddress, chain);

    // ERC20 토큰들의 컨트랙트 주소 수집
    const contractAddresses = portfolio.tokenBalances
      .map((t) => t.contractAddress)
      .filter((addr) => addr && addr.startsWith('0x'));

    // GoPlus 보안 정보 조회
    const securityData = await checkMultipleTokensSecurity(contractAddresses, chain);

    // 24시간 변동 계산
    let totalChange = 0;
    portfolio.portfolioCoins.forEach((coin) => {
      totalChange += coin.value * (coin.change24h / 100);
    });
    const totalChange24hPercent =
      portfolio.totalValueUsd > 0 ? (totalChange / portfolio.totalValueUsd) * 100 : 0;

    // 코인 상세 정보 구성
    const coins: CoinDetail[] = portfolio.portfolioCoins.map((coin) => {
      // 네이티브 토큰은 별도 처리
      const isNative = NATIVE_TOKENS.includes(coin.symbol.toUpperCase());
      const tokenBalance = portfolio.tokenBalances.find(
        (t) => t.symbol.toUpperCase() === coin.symbol.toUpperCase()
      );
      const contractAddress = isNative ? null : tokenBalance?.contractAddress || null;
      const security = contractAddress
        ? securityData.get(contractAddress.toLowerCase())
        : undefined;

      // 위험도 결정 (보안 데이터 기반)
      let riskLevel: RiskLevel = coin.riskLevel;
      if (security) {
        if (security.riskLevel === 'warning' || security.isHoneypot || security.sellTax > 10) {
          riskLevel = 'warning';
        } else if (security.riskLevel === 'caution' || security.sellTax > 5) {
          riskLevel = 'caution';
        }
      }

      return {
        symbol: coin.symbol,
        name: coin.name,
        logo: coin.logo,
        contractAddress,
        amount: coin.amount,
        value: coin.value,
        price: coin.price,
        change24h: coin.change24h,
        allocation: coin.allocation,
        riskLevel,
        riskReason: generateRiskReason({ ...coin, riskLevel }, security),
        riskSources: generateRiskSources({ ...coin, riskLevel }, security, chain),
        securityInfo: formatSecurityInfo(security),
      };
    });

    // 위험도 요약
    const riskSummary = {
      warning: coins.filter((c) => c.riskLevel === 'warning').length,
      caution: coins.filter((c) => c.riskLevel === 'caution').length,
      safe: coins.filter((c) => c.riskLevel === 'safe').length,
    };

    // 응답 구성
    const response: AssetsResponse = {
      success: true,
      data: {
        walletAddress,
        chainKey: chain,
        summary: {
          totalValueUsd: portfolio.totalValueUsd,
          totalChange24h: totalChange24hPercent,
          totalChangeValue: totalChange,
          totalCoins: coins.length,
          riskSummary,
        },
        coins,
        portfolioAnalysis: {
          summary: generatePortfolioSummary(coins, portfolio.totalValueUsd),
          allocationChart: coins.map((coin) => ({
            symbol: coin.symbol,
            percentage: coin.allocation,
            riskLevel: coin.riskLevel,
          })),
        },
      },
      timestamp,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    console.error('자산 조회 API 오류:', error);

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

    // GoPlus API 오류 체크
    if (errorMessage.includes('GoPlus') || errorMessage.includes('GOPLUS')) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'GOPLUS_ERROR',
            message: 'GoPlus API 오류가 발생했습니다.',
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

