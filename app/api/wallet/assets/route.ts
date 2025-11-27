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

// 목업 모드 환경 변수 (true면 실제 API 호출 대신 목업 데이터 반환)
const USE_MOCK_DATA = process.env.USE_MOCK_DATA === 'true';

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

// ============================================
// 목업 데이터 (flock API 비용 절감용)
// ============================================
const MOCK_RESPONSE: AssetsResponse = {
  success: true,
  data: {
    walletAddress: '0x1234567890abcdef1234567890abcdef12345678',
    chainKey: 'base',
    summary: {
      totalValueUsd: 34000,
      totalChange24h: 2.5,
      totalChangeValue: 850,
      totalCoins: 5,
      riskSummary: {
        warning: 2,
        caution: 2,
        safe: 1,
      },
    },
    coins: [
      {
        symbol: 'BTC',
        name: 'Bitcoin',
        logo: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
        contractAddress: null,
        amount: '0.15',
        value: 10087.5,
        price: 67250,
        change24h: 2.3,
        allocation: 29.7,
        riskLevel: 'safe',
        riskReason: null,
        riskSources: [],
        securityInfo: {
          isVerified: true,
          isHoneypot: false,
          buyTax: 0,
          sellTax: 0,
          riskScore: 0,
        },
      },
      {
        symbol: 'ETH',
        name: 'Ethereum',
        logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
        contractAddress: null,
        amount: '5.2',
        value: 17784,
        price: 3420,
        change24h: -1.2,
        allocation: 52.3,
        riskLevel: 'caution',
        riskReason: '최근 네트워크 혼잡으로 가스비 급등',
        riskSources: [
          {
            title: 'Etherscan Gas Tracker - 현재 가스비 급등 확인',
            url: 'https://etherscan.io/gastracker',
            importance: 'high',
            summary: '현재 가스비가 평균보다 200% 높습니다.',
          },
          {
            title: 'ETH 네트워크 혼잡도 분석 리포트',
            url: 'https://etherscan.io/chart/networkutilization',
            importance: 'high',
            summary: '네트워크 사용률이 95%를 초과했습니다.',
          },
          {
            title: '이더리움 재단 공식 블로그',
            url: 'https://blog.ethereum.org',
            importance: 'medium',
            summary: '다음 업그레이드 일정 확인',
          },
        ],
        securityInfo: {
          isVerified: true,
          isHoneypot: false,
          buyTax: 0,
          sellTax: 0,
          riskScore: 10,
        },
      },
      {
        symbol: 'SOL',
        name: 'Solana',
        logo: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
        contractAddress: '0x570A5D26f7765Ecb712C0924E4De545B89fD43dF',
        amount: '20',
        value: 4900,
        price: 245,
        change24h: 5.7,
        allocation: 14.4,
        riskLevel: 'warning',
        riskReason: '단기 급등으로 조정 가능성 높음',
        riskSources: [
          {
            title: 'SOL 7일 급등률 47% - 과매수 구간 진입',
            url: 'https://solscan.io',
            importance: 'high',
            summary: 'RSI 지표가 80 이상으로 과매수 상태입니다.',
          },
          {
            title: 'RSI 지표 80 이상 - 기술적 조정 신호',
            url: 'https://tradingview.com/sol',
            importance: 'high',
            summary: '기술적 분석상 조정이 예상됩니다.',
          },
          {
            title: '솔라나 네트워크 장애 이력 분석',
            url: 'https://status.solana.com',
            importance: 'high',
            summary: '최근 6개월간 3회의 네트워크 장애 발생',
          },
          {
            title: 'SOL 생태계 TVL 급증 현황',
            url: 'https://defillama.com/chain/solana',
            importance: 'medium',
            summary: 'TVL이 30일간 120% 증가했습니다.',
          },
        ],
        securityInfo: {
          isVerified: true,
          isHoneypot: false,
          buyTax: 0,
          sellTax: 0,
          riskScore: 35,
        },
      },
      {
        symbol: 'DOGE',
        name: 'Dogecoin',
        logo: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
        contractAddress: '0x4206931337dc273a630d328dA6441786BfaD668f',
        amount: '1000',
        value: 420,
        price: 0.42,
        change24h: -3.5,
        allocation: 1.2,
        riskLevel: 'warning',
        riskReason: '높은 변동성, 밈코인 특성상 급락 위험',
        riskSources: [
          {
            title: '밈코인 시장 변동성 경고 - 블룸버그',
            url: 'https://bloomberg.com/crypto',
            importance: 'high',
            summary: '밈코인 시장의 전반적인 변동성이 높습니다.',
          },
          {
            title: 'DOGE 30일 변동성 분석 (±40%)',
            url: 'https://dogechain.info',
            importance: 'high',
            summary: '30일간 가격 변동폭이 ±40%입니다.',
          },
          {
            title: '일론 머스크 트윗 영향도 분석',
            url: 'https://twitter.com/elonmusk',
            importance: 'medium',
            summary: '소셜 미디어 영향을 많이 받는 토큰입니다.',
          },
        ],
        securityInfo: {
          isVerified: true,
          isHoneypot: false,
          buyTax: 0,
          sellTax: 0,
          riskScore: 45,
        },
      },
      {
        symbol: 'XRP',
        name: 'Ripple',
        logo: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
        contractAddress: '0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE',
        amount: '500',
        value: 808.5,
        price: 1.617,
        change24h: 1.8,
        allocation: 2.4,
        riskLevel: 'caution',
        riskReason: 'SEC 소송 관련 불확실성 존재',
        riskSources: [
          {
            title: 'SEC vs Ripple 소송 진행 현황',
            url: 'https://xrpscan.com',
            importance: 'high',
            summary: '소송이 아직 완전히 종결되지 않았습니다.',
          },
          {
            title: '리플 법률팀 공식 성명',
            url: 'https://ripple.com/insights',
            importance: 'high',
            summary: '법적 상황에 대한 최신 업데이트',
          },
          {
            title: 'XRP 규제 리스크 분석 리포트',
            url: 'https://messari.io/xrp',
            importance: 'medium',
            summary: '규제 환경 변화 가능성 분석',
          },
        ],
        securityInfo: {
          isVerified: true,
          isHoneypot: false,
          buyTax: 0,
          sellTax: 0,
          riskScore: 25,
        },
      },
    ],
    portfolioAnalysis: {
      summary: [
        'BTC/ETH 비중 82% - 안정적인 대형 코인 중심',
        'SOL, DOGE는 높은 변동성 주의 필요',
        '전체 위험도: 중간',
      ],
      allocationChart: [
        { symbol: 'ETH', percentage: 52.3, riskLevel: 'caution' },
        { symbol: 'BTC', percentage: 29.7, riskLevel: 'safe' },
        { symbol: 'SOL', percentage: 14.4, riskLevel: 'warning' },
        { symbol: 'XRP', percentage: 2.4, riskLevel: 'caution' },
        { symbol: 'DOGE', percentage: 1.2, riskLevel: 'warning' },
      ],
    },
  },
  timestamp: new Date().toISOString(),
};

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

    // 목업 모드: 실제 API 호출 없이 목업 데이터 반환
    if (USE_MOCK_DATA) {
      console.log('[assets] 목업 모드 활성화 - 목업 데이터 반환');
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

