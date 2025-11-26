// lib/moralis.ts
import Moralis from 'moralis';
import { EvmChain } from '@moralisweb3/common-evm-utils';

// Moralis 초기화 상태 관리
let isInitialized = false;

/**
 * Moralis SDK 초기화
 * 서버 시작 시 한 번만 실행됨
 */
export async function initMoralis(): Promise<void> {
  if (isInitialized) return;

  if (!process.env.MORALIS_API_KEY) {
    throw new Error('MORALIS_API_KEY 환경 변수가 설정되지 않았습니다.');
  }

  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

  isInitialized = true;
}

// 지원 체인 매핑
export const SUPPORTED_CHAINS: Record<string, EvmChain> = {
  base: EvmChain.BASE,
  ethereum: EvmChain.ETHEREUM,
  polygon: EvmChain.POLYGON,
  arbitrum: EvmChain.ARBITRUM,
};

// 체인별 네이티브 토큰 정보
export const NATIVE_TOKEN_INFO: Record<
  string,
  { symbol: string; name: string; logo: string; decimals: number }
> = {
  base: {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    decimals: 18,
  },
  ethereum: {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    decimals: 18,
  },
  polygon: {
    symbol: 'MATIC',
    name: 'Polygon',
    logo: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
    decimals: 18,
  },
  arbitrum: {
    symbol: 'ETH',
    name: 'Ethereum',
    logo: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
    decimals: 18,
  },
};

/**
 * 일주일 전 날짜 계산
 */
export function getOneWeekAgo(): Date {
  const date = new Date();
  date.setDate(date.getDate() - 7);
  return date;
}

// 잘 알려진 토큰의 CoinGecko 로고 매핑
const KNOWN_TOKEN_LOGOS: Record<string, string> = {
  BTC: 'https://assets.coingecko.com/coins/images/1/small/bitcoin.png',
  WBTC: 'https://assets.coingecko.com/coins/images/7598/small/wrapped_bitcoin_wbtc.png',
  ETH: 'https://assets.coingecko.com/coins/images/279/small/ethereum.png',
  WETH: 'https://assets.coingecko.com/coins/images/2518/small/weth.png',
  USDT: 'https://assets.coingecko.com/coins/images/325/small/Tether.png',
  USDC: 'https://assets.coingecko.com/coins/images/6319/small/usdc.png',
  DAI: 'https://assets.coingecko.com/coins/images/9956/small/Badge_Dai.png',
  LINK: 'https://assets.coingecko.com/coins/images/877/small/chainlink-new-logo.png',
  UNI: 'https://assets.coingecko.com/coins/images/12504/small/uni.png',
  AAVE: 'https://assets.coingecko.com/coins/images/12645/small/aave-token-round.png',
  SOL: 'https://assets.coingecko.com/coins/images/4128/small/solana.png',
  MATIC: 'https://assets.coingecko.com/coins/images/4713/small/matic-token-icon.png',
  ARB: 'https://assets.coingecko.com/coins/images/16547/small/photo_2023-03-29_21.47.00.jpeg',
  OP: 'https://assets.coingecko.com/coins/images/25244/small/Optimism.png',
  DOGE: 'https://assets.coingecko.com/coins/images/5/small/dogecoin.png',
  SHIB: 'https://assets.coingecko.com/coins/images/11939/small/shiba.png',
  PEPE: 'https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg',
  APE: 'https://assets.coingecko.com/coins/images/24383/small/apecoin.jpg',
  LDO: 'https://assets.coingecko.com/coins/images/13573/small/Lido_DAO.png',
  CRV: 'https://assets.coingecko.com/coins/images/12124/small/Curve.png',
  MKR: 'https://assets.coingecko.com/coins/images/1364/small/Mark_Maker.png',
  SNX: 'https://assets.coingecko.com/coins/images/3406/small/SNX.png',
  COMP: 'https://assets.coingecko.com/coins/images/10775/small/COMP.png',
  SUSHI: 'https://assets.coingecko.com/coins/images/12271/small/512x512_Logo_no_chop.png',
  YFI: 'https://assets.coingecko.com/coins/images/11849/small/yearn.jpg',
  '1INCH': 'https://assets.coingecko.com/coins/images/13469/small/1inch-token.png',
  GRT: 'https://assets.coingecko.com/coins/images/13397/small/Graph_Token.png',
  ENS: 'https://assets.coingecko.com/coins/images/19785/small/acatxTm8_400x400.jpg',
  BLUR: 'https://assets.coingecko.com/coins/images/28453/small/blur.png',
  XRP: 'https://assets.coingecko.com/coins/images/44/small/xrp-symbol-white-128.png',
  ADA: 'https://assets.coingecko.com/coins/images/975/small/cardano.png',
  AVAX: 'https://assets.coingecko.com/coins/images/12559/small/Avalanche_Circle_RedWhite_Trans.png',
  DOT: 'https://assets.coingecko.com/coins/images/12171/small/polkadot.png',
  ATOM: 'https://assets.coingecko.com/coins/images/1481/small/cosmos_hub.png',
  FTM: 'https://assets.coingecko.com/coins/images/4001/small/Fantom_round.png',
  NEAR: 'https://assets.coingecko.com/coins/images/10365/small/near.jpg',
};

/**
 * 토큰 로고 URL 가져오기 (폴백 로직 포함)
 * 우선순위: Moralis 로고 → CoinGecko 로고 → Trustwallet Assets → DiceBear 아바타
 */
export function getTokenLogo(params: {
  logo?: string | null;
  symbol: string;
  contractAddress?: string;
  chain?: string;
}): string {
  const { logo, symbol, contractAddress, chain = 'ethereum' } = params;

  // 1. Moralis에서 제공한 로고 사용
  if (logo) return logo;

  // 2. 잘 알려진 토큰의 경우 CoinGecko 이미지 사용
  const upperSymbol = symbol.toUpperCase();
  if (KNOWN_TOKEN_LOGOS[upperSymbol]) {
    return KNOWN_TOKEN_LOGOS[upperSymbol];
  }

  // 3. Trustwallet assets CDN 사용 (컨트랙트 주소 기반)
  if (contractAddress && contractAddress.startsWith('0x')) {
    const chainName =
      chain === 'base' ? 'base' : chain === 'polygon' ? 'polygon' : 'ethereum';
    return `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${chainName}/assets/${contractAddress}/logo.png`;
  }

  // 4. 기본 플레이스홀더 (DiceBear API - 심볼 기반 아바타)
  return `https://api.dicebear.com/7.x/initials/svg?seed=${symbol}&backgroundColor=6366f1&textColor=ffffff`;
}

// ============================================
// Moralis API 호출 함수 (util function)
// ============================================

/**
 * 최근 일주일간의 토큰 전송 내역 조회
 * @param address 지갑 주소
 * @param chainKey 체인 키 (base, ethereum, polygon, arbitrum)
 * @param limit 조회 개수 (기본값: 100)
 */
export async function getRecentTokenTransfers(
  address: string,
  chainKey: string = 'base',
  limit: number = 100
): Promise<TokenTransfer[]> {
  await initMoralis();

  const chain = SUPPORTED_CHAINS[chainKey.toLowerCase()];
  if (!chain) {
    throw new Error(`지원하지 않는 체인입니다: ${chainKey}`);
  }

  const oneWeekAgo = getOneWeekAgo();
  const now = new Date();

  try {
    const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
      address,
      chain,
      fromDate: oneWeekAgo.toISOString(),
      toDate: now.toISOString(),
      limit,
    });

    return response.result.map((transfer) => {
      const isIncoming = transfer.toAddress?.lowercase === address.toLowerCase();
      // Moralis API 응답 타입에서 필드 접근 (타입 안전하게 처리)
      const transferData = transfer as unknown as {
        tokenSymbol?: string;
        tokenName?: string;
        valueDecimal?: string;
        tokenDecimals?: number;
        transactionHash?: string;
        fromAddress?: { lowercase: string };
        toAddress?: { lowercase: string };
        address?: { lowercase: string };
        value?: { toString: () => string };
        blockTimestamp?: { toISOString: () => string };
      };

      const tokenSymbol = transferData.tokenSymbol || 'UNKNOWN';
      const tokenAddress = transferData.address?.lowercase || '';

      const tokenLogo = getTokenLogo({
        logo: null,
        symbol: tokenSymbol,
        contractAddress: tokenAddress,
        chain: chainKey,
      });

      return {
        hash: transferData.transactionHash || '',
        from: transferData.fromAddress?.lowercase || '',
        to: transferData.toAddress?.lowercase || '',
        tokenSymbol,
        tokenName: transferData.tokenName || 'Unknown Token',
        tokenAddress,
        tokenLogo,
        value: transferData.value?.toString() || '0',
        valueFormatted: transferData.valueDecimal || '0',
        decimals: transferData.tokenDecimals || 18,
        blockTimestamp: transferData.blockTimestamp?.toISOString() || '',
        direction: isIncoming ? 'in' : 'out',
      };
    });
  } catch (error) {
    console.error('토큰 전송 내역 조회 오류:', error);
    return [];
  }
}

/**
 * 지갑의 ERC20 토큰 잔고 조회 (가격 포함)
 * @param address 지갑 주소
 * @param chainKey 체인 키
 */
export async function getWalletTokenBalances(
  address: string,
  chainKey: string = 'base'
): Promise<TokenBalance[]> {
  await initMoralis();

  const chain = SUPPORTED_CHAINS[chainKey.toLowerCase()];
  if (!chain) {
    throw new Error(`지원하지 않는 체인입니다: ${chainKey}`);
  }

  try {
    const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
      address,
      chain,
    });

    return response.result.map((token) => {
      const symbol = token.symbol || 'UNKNOWN';
      const contractAddress = token.tokenAddress?.lowercase || '';

      const logoUrl = getTokenLogo({
        logo: token.logo || null,
        symbol,
        contractAddress,
        chain: chainKey,
      });

      // Moralis API는 string 또는 number로 반환할 수 있음
      const usdPrice = token.usdPrice ? parseFloat(String(token.usdPrice)) : null;
      const priceChange24h = token.usdPrice24hrPercentChange
        ? parseFloat(String(token.usdPrice24hrPercentChange))
        : null;

      return {
        symbol,
        name: token.name || 'Unknown Token',
        contractAddress,
        amount: token.balanceFormatted || '0',
        amountRaw: token.balance?.toString() || '0',
        decimals: token.decimals || 18,
        price: usdPrice,
        priceChange24h,
        valueUsd: token.usdValue || null,
        logo: logoUrl,
        thumbnail: logoUrl,
        verified: token.verifiedContract || false,
        riskLevel: getTokenRiskLevel(symbol, priceChange24h || 0),
      };
    });
  } catch (error) {
    console.error('토큰 잔고 조회 오류:', error);
    return [];
  }
}

/**
 * 네이티브 토큰 잔고 조회 (ETH, MATIC 등)
 * @param address 지갑 주소
 * @param chainKey 체인 키
 */
export async function getNativeTokenBalance(
  address: string,
  chainKey: string = 'base'
): Promise<NativeBalance> {
  await initMoralis();

  const chain = SUPPORTED_CHAINS[chainKey.toLowerCase()];
  if (!chain) {
    throw new Error(`지원하지 않는 체인입니다: ${chainKey}`);
  }

  const nativeInfo = NATIVE_TOKEN_INFO[chainKey.toLowerCase()] || NATIVE_TOKEN_INFO['ethereum'];

  try {
    const response = await Moralis.EvmApi.balance.getNativeBalance({
      address,
      chain,
    });

    // 네이티브 토큰 USD 가치 계산 (WETH 가격 사용)
    let valueUsd: number | null = null;
    try {
      // WETH 주소로 가격 조회 (Base와 Ethereum에서 사용)
      const wethAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
      const priceResponse = await Moralis.EvmApi.token.getTokenPrice({
        address: wethAddress,
        chain: EvmChain.ETHEREUM, // 가격은 Ethereum에서 조회
      });
      const balanceEther = parseFloat(response.result.balance.ether);
      valueUsd = balanceEther * (priceResponse.result.usdPrice || 0);
    } catch {
      console.warn('네이티브 토큰 가격 조회 실패');
    }

    return {
      symbol: nativeInfo.symbol,
      name: nativeInfo.name,
      balance: response.result.balance.toString(),
      balanceFormatted: response.result.balance.ether,
      logo: nativeInfo.logo,
      valueUsd,
    };
  } catch (error) {
    console.error('네이티브 토큰 잔고 조회 오류:', error);
    return {
      symbol: nativeInfo.symbol,
      name: nativeInfo.name,
      balance: '0',
      balanceFormatted: '0',
      logo: nativeInfo.logo,
      valueUsd: null,
    };
  }
}

/**
 * 전체 포트폴리오 조회 (네이티브 + ERC20 토큰)
 * @param address 지갑 주소
 * @param chainKey 체인 키
 */
export async function getWalletPortfolio(
  address: string,
  chainKey: string = 'base'
): Promise<{
  nativeBalance: NativeBalance;
  tokenBalances: TokenBalance[];
  portfolioCoins: PortfolioCoin[];
  totalValueUsd: number;
}> {
  // 병렬로 데이터 조회
  const [nativeBalance, tokenBalances] = await Promise.all([
    getNativeTokenBalance(address, chainKey),
    getWalletTokenBalances(address, chainKey),
  ]);

  // 총 가치 계산
  const erc20TotalValue = tokenBalances.reduce((sum, t) => sum + (t.valueUsd || 0), 0);
  const totalValueUsd = erc20TotalValue + (nativeBalance.valueUsd || 0);

  // 포트폴리오 코인 목록 생성
  const portfolioCoins: PortfolioCoin[] = [];

  // 네이티브 토큰 추가
  if (nativeBalance.valueUsd && nativeBalance.valueUsd > 0) {
    portfolioCoins.push({
      symbol: nativeBalance.symbol,
      name: nativeBalance.name,
      amount: nativeBalance.balanceFormatted,
      value: nativeBalance.valueUsd,
      price: nativeBalance.valueUsd / parseFloat(nativeBalance.balanceFormatted || '1'),
      change24h: 0,
      allocation: totalValueUsd > 0 ? (nativeBalance.valueUsd / totalValueUsd) * 100 : 0,
      logo: nativeBalance.logo,
      riskLevel: 'safe',
    });
  }

  // ERC20 토큰 추가
  tokenBalances
    .filter((t) => (t.valueUsd || 0) > 0)
    .forEach((token) => {
      portfolioCoins.push({
        symbol: token.symbol,
        name: token.name,
        amount: token.amount,
        value: token.valueUsd || 0,
        price: token.price || 0,
        change24h: token.priceChange24h || 0,
        allocation: totalValueUsd > 0 ? ((token.valueUsd || 0) / totalValueUsd) * 100 : 0,
        logo: token.logo,
        riskLevel: token.riskLevel || 'safe',
      });
    });

  // 가치 기준 정렬
  portfolioCoins.sort((a, b) => b.value - a.value);

  return {
    nativeBalance,
    tokenBalances,
    portfolioCoins,
    totalValueUsd,
  };
}

/**
 * 지갑 종합 분석 데이터 조회
 * 홈 화면에서 사용할 모든 데이터를 한 번에 조회
 * @param address 지갑 주소
 * @param chainKey 체인 키
 */
export async function analyzeWalletData(
  address: string,
  chainKey: string = 'base'
): Promise<{
  portfolio: {
    nativeBalance: NativeBalance;
    tokenBalances: TokenBalance[];
    portfolioCoins: PortfolioCoin[];
    totalValueUsd: number;
  };
  recentTransfers: TokenTransfer[];
  summary: WalletSummary;
  investmentMetrics: {
    riskLevel: string;
    tradingFrequency: string;
    diversificationScore: number;
    preferredCoins: string[];
  };
}> {
  // 병렬로 데이터 조회
  const [portfolio, recentTransfers] = await Promise.all([
    getWalletPortfolio(address, chainKey),
    getRecentTokenTransfers(address, chainKey, 50),
  ]);

  // 전송 통계
  const transfersIn = recentTransfers.filter((t) => t.direction === 'in').length;
  const transfersOut = recentTransfers.filter((t) => t.direction === 'out').length;

  // 요약 정보
  const summary: WalletSummary = {
    totalValueUsd: portfolio.totalValueUsd,
    totalTokens: portfolio.portfolioCoins.length,
    transfersIn,
    transfersOut,
  };

  // 투자 지표 분석
  const tradingCount = recentTransfers.length;
  const uniqueCoins = [...new Set(recentTransfers.map((t) => t.tokenSymbol))];
  const diversificationScore = Math.min(portfolio.portfolioCoins.length / 10, 1) * 100;

  const investmentMetrics = {
    riskLevel: getOverallRiskLevel(portfolio.portfolioCoins),
    tradingFrequency: getTradingFrequencyLabel(tradingCount),
    diversificationScore: Math.round(diversificationScore),
    preferredCoins: uniqueCoins.slice(0, 5),
  };

  return {
    portfolio,
    recentTransfers,
    summary,
    investmentMetrics,
  };
}

// ============================================
// 위험도 분석 유틸리티 (로컬 폴백용)
// 실제 위험도는 GoPlus API + flock.io AI를 통해 계산
// ============================================

// 안정적인 코인 목록 (폴백용)
const STABLE_COINS = ['USDT', 'USDC', 'DAI', 'BUSD', 'TUSD', 'FRAX', 'USDP'];
const MAJOR_COINS = ['BTC', 'WBTC', 'ETH', 'WETH'];
const MEME_COINS = ['DOGE', 'SHIB', 'PEPE', 'FLOKI', 'BONK', 'WIF', 'WOJAK', 'MEME'];

/**
 * 개별 토큰 위험도 레벨 계산 (로컬 폴백)
 * 실제 위험도는 GoPlus API를 통해 계산됨
 */
export function getTokenRiskLevel(
  symbol: string,
  change24h: number
): 'safe' | 'caution' | 'warning' {
  const upperSymbol = symbol.toUpperCase();

  if (STABLE_COINS.includes(upperSymbol)) return 'safe';
  if (MAJOR_COINS.includes(upperSymbol)) return 'safe';
  if (MEME_COINS.includes(upperSymbol)) return 'warning';

  if (Math.abs(change24h) > 15) return 'warning';
  if (Math.abs(change24h) > 8) return 'caution';

  return 'safe';
}

/**
 * 전체 포트폴리오 위험도 계산 (로컬 폴백)
 * 실제 점수는 flock.io AI를 통해 계산됨
 */
export function getOverallRiskLevel(coins: PortfolioCoin[]): string {
  if (coins.length === 0) return '데이터 없음';

  const stableCoins = [...STABLE_COINS, ...MAJOR_COINS];
  const stableAllocation = coins
    .filter((c) => stableCoins.includes(c.symbol.toUpperCase()))
    .reduce((sum, c) => sum + c.allocation, 0);

  if (stableAllocation >= 70) return '낮음';
  if (stableAllocation >= 40) return '중간';
  return '높음';
}

/**
 * 거래 빈도 레이블 반환
 */
export function getTradingFrequencyLabel(count: number): string {
  if (count >= 20) return '매일';
  if (count >= 10) return '주 3-5회';
  if (count >= 5) return '주 1-2회';
  if (count > 0) return '월 1-2회';
  return '거래 없음';
}

// ============================================
// GoPlus Security API 연동
// 토큰 보안 검사 (허니팟, 세금, 악성 여부 등)
// ============================================

// GoPlus 체인 ID 매핑
export const GOPLUS_CHAIN_IDS: Record<string, string> = {
  ethereum: '1',
  base: '8453',
  polygon: '137',
  arbitrum: '42161',
};

/**
 * GoPlus API를 통한 토큰 보안 검사
 * @param contractAddress 토큰 컨트랙트 주소
 * @param chainKey 체인 키 (base, ethereum, polygon, arbitrum)
 */
export async function checkTokenSecurity(
  contractAddress: string,
  chainKey: string = 'base'
): Promise<GoPlusTokenSecurity | null> {
  const chainId = GOPLUS_CHAIN_IDS[chainKey.toLowerCase()];
  if (!chainId) {
    console.warn(`GoPlus: 지원하지 않는 체인: ${chainKey}`);
    return null;
  }

  try {
    const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${contractAddress}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    // GoPlus API 키가 있으면 인증 헤더 추가
    if (process.env.GOPLUS_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.GOPLUS_API_KEY}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      console.warn(`GoPlus API 오류: ${response.status}`);
      return null;
    }

    const data = await response.json();

    if (data.code !== 1 || !data.result) {
      return null;
    }

    const tokenData = data.result[contractAddress.toLowerCase()];
    if (!tokenData) {
      return null;
    }

    return {
      contractAddress,
      isHoneypot: tokenData.is_honeypot === '1',
      buyTax: parseFloat(tokenData.buy_tax || '0'),
      sellTax: parseFloat(tokenData.sell_tax || '0'),
      isProxy: tokenData.is_proxy === '1',
      isMintable: tokenData.is_mintable === '1',
      canTakeBackOwnership: tokenData.can_take_back_ownership === '1',
      ownerChangeBalance: tokenData.owner_change_balance === '1',
      hiddenOwner: tokenData.hidden_owner === '1',
      selfDestruct: tokenData.selfdestruct === '1',
      externalCall: tokenData.external_call === '1',
      isBlacklisted: tokenData.is_blacklisted === '1',
      isWhitelisted: tokenData.is_whitelisted === '1',
      isAntiWhale: tokenData.is_anti_whale === '1',
      tradingCooldown: tokenData.trading_cooldown === '1',
      transferPausable: tokenData.transfer_pausable === '1',
      cannotBuy: tokenData.cannot_buy === '1',
      cannotSellAll: tokenData.cannot_sell_all === '1',
      holderCount: parseInt(tokenData.holder_count || '0'),
      totalSupply: tokenData.total_supply || '0',
      // 위험도 점수 계산
      riskScore: calculateGoPlusRiskScore(tokenData),
      riskLevel: calculateGoPlusRiskLevel(tokenData),
    };
  } catch (error) {
    console.error('GoPlus API 호출 오류:', error);
    return null;
  }
}

/**
 * GoPlus 데이터로부터 위험도 점수 계산 (0-100, 높을수록 위험)
 */
function calculateGoPlusRiskScore(data: Record<string, string>): number {
  let score = 0;

  // 치명적 위험 요소 (각 30점)
  if (data.is_honeypot === '1') score += 30;
  if (data.cannot_buy === '1') score += 30;
  if (data.cannot_sell_all === '1') score += 30;

  // 높은 위험 요소 (각 15점)
  if (parseFloat(data.buy_tax || '0') > 10) score += 15;
  if (parseFloat(data.sell_tax || '0') > 10) score += 15;
  if (data.owner_change_balance === '1') score += 15;
  if (data.hidden_owner === '1') score += 15;
  if (data.selfdestruct === '1') score += 15;

  // 중간 위험 요소 (각 10점)
  if (data.is_proxy === '1') score += 10;
  if (data.is_mintable === '1') score += 10;
  if (data.can_take_back_ownership === '1') score += 10;
  if (data.external_call === '1') score += 10;
  if (data.transfer_pausable === '1') score += 10;

  // 낮은 위험 요소 (각 5점)
  if (data.is_blacklisted === '1') score += 5;
  if (data.trading_cooldown === '1') score += 5;
  if (data.is_anti_whale === '1') score += 5;

  return Math.min(score, 100);
}

/**
 * GoPlus 데이터로부터 위험도 레벨 계산
 */
function calculateGoPlusRiskLevel(
  data: Record<string, string>
): 'safe' | 'caution' | 'warning' {
  const score = calculateGoPlusRiskScore(data);

  if (score >= 30) return 'warning';
  if (score >= 15) return 'caution';
  return 'safe';
}

/**
 * 여러 토큰의 보안 정보를 일괄 조회
 */
export async function checkMultipleTokensSecurity(
  contractAddresses: string[],
  chainKey: string = 'base'
): Promise<Map<string, GoPlusTokenSecurity>> {
  const results = new Map<string, GoPlusTokenSecurity>();

  if (contractAddresses.length === 0) {
    return results;
  }

  const chainId = GOPLUS_CHAIN_IDS[chainKey.toLowerCase()];
  if (!chainId) {
    return results;
  }

  try {
    // GoPlus는 쉼표로 구분된 여러 주소를 지원
    const addresses = contractAddresses.join(',');
    const url = `https://api.gopluslabs.io/api/v1/token_security/${chainId}?contract_addresses=${addresses}`;

    const headers: Record<string, string> = {
      'Accept': 'application/json',
    };

    if (process.env.GOPLUS_API_KEY) {
      headers['Authorization'] = `Bearer ${process.env.GOPLUS_API_KEY}`;
    }

    const response = await fetch(url, { headers });

    if (!response.ok) {
      return results;
    }

    const data = await response.json();

    if (data.code !== 1 || !data.result) {
      return results;
    }

    for (const [address, tokenData] of Object.entries(data.result)) {
      const td = tokenData as Record<string, string>;
      results.set(address.toLowerCase(), {
        contractAddress: address,
        isHoneypot: td.is_honeypot === '1',
        buyTax: parseFloat(td.buy_tax || '0'),
        sellTax: parseFloat(td.sell_tax || '0'),
        isProxy: td.is_proxy === '1',
        isMintable: td.is_mintable === '1',
        canTakeBackOwnership: td.can_take_back_ownership === '1',
        ownerChangeBalance: td.owner_change_balance === '1',
        hiddenOwner: td.hidden_owner === '1',
        selfDestruct: td.selfdestruct === '1',
        externalCall: td.external_call === '1',
        isBlacklisted: td.is_blacklisted === '1',
        isWhitelisted: td.is_whitelisted === '1',
        isAntiWhale: td.is_anti_whale === '1',
        tradingCooldown: td.trading_cooldown === '1',
        transferPausable: td.transfer_pausable === '1',
        cannotBuy: td.cannot_buy === '1',
        cannotSellAll: td.cannot_sell_all === '1',
        holderCount: parseInt(td.holder_count || '0'),
        totalSupply: td.total_supply || '0',
        riskScore: calculateGoPlusRiskScore(td),
        riskLevel: calculateGoPlusRiskLevel(td),
      });
    }
  } catch (error) {
    console.error('GoPlus 일괄 조회 오류:', error);
  }

  return results;
}

// ============================================
// flock.io AI 연동 인터페이스
// 지갑 점수, 투자 평가, 조언 생성
// API 문서: https://docs.flock.io/flock-products/api-platform/api-endpoint
// ============================================

// flock.io API 설정
const FLOCK_API_URL = 'https://api.flock.io/v1/chat/completions';
const FLOCK_MODEL = 'qwen3-30b-a3b-instruct-2507';

/**
 * 사용자 설정 타입 (app/hooks/useUserSettings.ts와 동기화)
 */
export interface UserSettings {
  investmentStyle: number;       // 0: 안정형 ~ 4: 공격투자형
  livingExpenseRatio: number;    // 생활비 비율 (%)
  investmentRatio: number;       // 투자 비율 (%)
  roastLevel: number;            // 0: Kind ~ 4: Hot
}

/**
 * flock.io AI에 전달할 지갑 분석 데이터 (종합)
 */
export interface FlockAIAnalysisInput {
  // 지갑 정보
  walletAddress: string;
  chainKey: string;

  // Moralis에서 얻은 지갑 데이터
  walletData: {
    totalValueUsd: number;
    portfolioCoins: PortfolioCoin[];
    recentTransfers: TokenTransfer[];
    nativeBalance: NativeBalance;
    summary: WalletSummary;
  };

  // GoPlus에서 얻은 보안 데이터
  tokenSecurityData: Map<string, GoPlusTokenSecurity>;

  // 사용자 설정
  userSettings: UserSettings;
}

/**
 * flock.io AI 분석 결과
 */
export interface FlockAIAnalysisResult {
  overallScore: number;           // 0-10 지갑 건강도 점수
  evaluation: string;             // 한 줄 평가
  riskLevel: string;              // 위험도 레벨 (낮음/중간/높음)
  tradingFrequency: string;       // 거래 빈도 분석
  investmentStyleMatch: string;   // 투자 성향 일치도 분석
  tradeEvaluations: TradeEvaluation[];  // 각 거래 평가
  portfolioAdvice: string;        // 포트폴리오 조언
  riskWarnings: string[];         // 위험 경고 메시지들
  improvementSuggestions: string[]; // 개선 제안
}

// 투자 성향 레이블
const INVESTMENT_STYLE_LABELS = [
  { label: '안정형', description: '원금 보존을 최우선으로 하며, 낮은 수익률도 감수합니다.', emoji: '🛡️' },
  { label: '안정추구형', description: '안정적인 수익을 추구하며, 소폭의 손실은 감수할 수 있습니다.', emoji: '🌿' },
  { label: '위험중립형', description: '적정한 위험과 수익의 균형을 추구합니다.', emoji: '⚖️' },
  { label: '적극투자형', description: '높은 수익을 위해 상당한 위험을 감수할 수 있습니다.', emoji: '🚀' },
  { label: '공격투자형', description: '최대 수익을 위해 높은 변동성과 손실 위험을 감수합니다.', emoji: '🔥' },
];

// Roast 강도 레이블
const ROAST_LEVEL_LABELS = [
  { label: 'Kind', description: '부드럽고 격려하는 피드백', emoji: '😊' },
  { label: 'Mild', description: '친절하지만 솔직한 피드백', emoji: '🙂' },
  { label: 'Medium', description: '균형 잡힌 현실적인 피드백', emoji: '😐' },
  { label: 'Spicy', description: '직설적이고 날카로운 피드백', emoji: '😤' },
  { label: 'Hot', description: '매우 직설적인 피드백으로 현실을 직시', emoji: '🔥' },
];

/**
 * flock.io AI 분석 요청을 위한 프롬프트 생성
 */
export function buildFlockAIPrompt(input: FlockAIAnalysisInput): string {
  const { walletData, tokenSecurityData, userSettings } = input;

  const styleInfo = INVESTMENT_STYLE_LABELS[userSettings.investmentStyle] || INVESTMENT_STYLE_LABELS[2];
  const roastInfo = ROAST_LEVEL_LABELS[userSettings.roastLevel] || ROAST_LEVEL_LABELS[2];

  // 포트폴리오 정보 문자열 생성
  const portfolioStr = walletData.portfolioCoins.length > 0
    ? walletData.portfolioCoins.map(c => {
      const security = tokenSecurityData.get(c.symbol.toLowerCase());
      const securityInfo = security
        ? `보안점수: ${100 - security.riskScore}/100${security.isHoneypot ? ' ⚠️허니팟' : ''}${security.sellTax > 5 ? ` ⚠️판매세: ${security.sellTax}%` : ''}`
        : '보안정보 없음';
      return `  - ${c.symbol} (${c.name})
    · 비중: ${c.allocation.toFixed(1)}% | 가치: $${c.value.toFixed(2)}
    · 가격: $${c.price.toFixed(4)} | 24h 변동: ${c.change24h > 0 ? '+' : ''}${c.change24h.toFixed(2)}%
    · ${securityInfo}`;
    }).join('\n')
    : '  - 보유 토큰 없음';

  // 최근 거래 문자열 생성
  const tradesStr = walletData.recentTransfers.length > 0
    ? walletData.recentTransfers.slice(0, 15).map(t => {
      const date = t.blockTimestamp ? t.blockTimestamp.split('T')[0] : '날짜 없음';
      const type = t.direction === 'in' ? '📥 매수' : '📤 매도';
      return `  - ${date} | ${type} | ${t.tokenSymbol} | 수량: ${t.valueFormatted}`;
    }).join('\n')
    : '  - 최근 일주일 거래 없음';

  // 위험 토큰 분석
  const riskTokens = Array.from(tokenSecurityData.values())
    .filter(s => s.riskLevel === 'warning' || s.isHoneypot || s.sellTax > 10)
    .map(s => {
      const warnings = [];
      if (s.isHoneypot) warnings.push('허니팟');
      if (s.cannotSellAll) warnings.push('전량 판매 불가');
      if (s.sellTax > 10) warnings.push(`높은 판매세 ${s.sellTax}%`);
      if (s.ownerChangeBalance) warnings.push('소유자 잔액 변경 가능');
      if (s.hiddenOwner) warnings.push('숨겨진 소유자');
      return `  - ${s.contractAddress.slice(0, 10)}...: ${warnings.join(', ')}`;
    });

  // 투자 금액 배분 계산
  const savingsRatio = 100 - userSettings.livingExpenseRatio - userSettings.investmentRatio;

  return `당신은 암호화폐 투자 분석 및 평가 전문 AI입니다.
아래 정보를 바탕으로 지갑을 종합 분석하고 평가해주세요.

═══════════════════════════════════════════
📊 지갑 정보
═══════════════════════════════════════════
- 지갑 주소: ${input.walletAddress}
- 체인: ${input.chainKey}
- 총 자산 가치: $${walletData.totalValueUsd.toFixed(2)}
- 보유 토큰 수: ${walletData.portfolioCoins.length}개
- 일주일간 거래: 매수 ${walletData.summary.transfersIn}건, 매도 ${walletData.summary.transfersOut}건

═══════════════════════════════════════════
💰 포트폴리오 현황
═══════════════════════════════════════════
${portfolioStr}

═══════════════════════════════════════════
📜 최근 거래 내역 (일주일)
═══════════════════════════════════════════
${tradesStr}

═══════════════════════════════════════════
⚠️ 보안 위험 토큰 (GoPlus 분석)
═══════════════════════════════════════════
${riskTokens.length > 0 ? riskTokens.join('\n') : '  - 위험 토큰 없음 ✅'}

═══════════════════════════════════════════
👤 사용자 프로필
═══════════════════════════════════════════
- 투자 성향: ${styleInfo.emoji} ${styleInfo.label}
  → ${styleInfo.description}
- 월 급여 배분:
  · 생활비: ${userSettings.livingExpenseRatio}%
  · 투자금: ${userSettings.investmentRatio}%
  · 저축: ${savingsRatio}%
- 피드백 강도: ${roastInfo.emoji} ${roastInfo.label}
  → ${roastInfo.description}

═══════════════════════════════════════════
📋 분석 요청
═══════════════════════════════════════════
위 정보를 바탕으로 다음을 분석해주세요:

1. **지갑 건강도 점수** (0-10): 포트폴리오 분산도, 보안 위험, 거래 패턴 종합
2. **투자 성향 일치도**: 사용자의 설정된 투자 성향과 실제 포트폴리오가 얼마나 일치하는지
3. **각 거래 평가**: 최근 거래들에 대한 개별 평가 (good/neutral/bad)
4. **위험 경고**: 즉시 주의가 필요한 사항들
5. **개선 제안**: 포트폴리오 개선을 위한 구체적인 제안

[중요] 피드백 강도가 "${roastInfo.label}"이므로, ${roastInfo.description}을 제공해주세요.

다음 JSON 형식으로만 응답해주세요:
{
  "overallScore": (0-10, 소수점 1자리),
  "evaluation": "(한 줄 평가, 피드백 강도에 맞게)",
  "riskLevel": "(낮음/중간/높음)",
  "tradingFrequency": "(거래 빈도 분석 결과)",
  "investmentStyleMatch": "(투자 성향 일치도 분석)",
  "tradeEvaluations": [
    { "hash": "(거래 해시 앞 10자)", "coin": "(코인 심볼)", "type": "(buy/sell)", "evaluation": "(good/neutral/bad)", "comment": "(짧은 코멘트)" }
  ],
  "portfolioAdvice": "(2-3문장의 종합 조언)",
  "riskWarnings": ["(즉시 주의 필요 사항들)"],
  "improvementSuggestions": ["(개선 제안들)"]
}`;
}

/**
 * flock.io AI API 호출
 * @param prompt 분석 요청 프롬프트
 * @returns AI 분석 결과
 */
export async function callFlockAI(prompt: string): Promise<FlockAIAnalysisResult | null> {
  if (!process.env.FLOCK_API_KEY) {
    console.error('FLOCK_API_KEY 환경 변수가 설정되지 않았습니다.');
    return null;
  }

  try {
    const response = await fetch(FLOCK_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-litellm-api-key': process.env.FLOCK_API_KEY,
      },
      body: JSON.stringify({
        model: FLOCK_MODEL,
        messages: [
          {
            role: 'system',
            content: '당신은 암호화폐 투자 분석 전문가입니다. 사용자의 지갑 데이터를 분석하고 평가를 제공합니다. 항상 요청된 JSON 형식으로만 응답합니다.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        max_tokens: 2000,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      console.error(`flock.io API 오류: ${response.status}`);
      return null;
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      console.error('flock.io API 응답에 content가 없습니다.');
      return null;
    }

    // JSON 파싱 시도
    try {
      // JSON 블록 추출 (마크다운 코드 블록 처리)
      const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
        content.match(/```\s*([\s\S]*?)\s*```/) ||
        [null, content];
      const jsonStr = jsonMatch[1] || content;

      const result = JSON.parse(jsonStr.trim());
      return result as FlockAIAnalysisResult;
    } catch (parseError) {
      console.error('JSON 파싱 오류:', parseError);
      console.log('원본 응답:', content);
      return null;
    }
  } catch (error) {
    console.error('flock.io API 호출 오류:', error);
    return null;
  }
}

/**
 * 지갑 종합 분석 실행 (Moralis + GoPlus + flock.io AI)
 * @param walletAddress 지갑 주소
 * @param chainKey 체인 키
 * @param userSettings 사용자 설정
 */
export async function performWalletAnalysis(
  walletAddress: string,
  chainKey: string,
  userSettings: UserSettings
): Promise<{
  walletData: Awaited<ReturnType<typeof analyzeWalletData>>;
  securityData: Map<string, GoPlusTokenSecurity>;
  aiAnalysis: FlockAIAnalysisResult | null;
}> {
  // 1. Moralis에서 지갑 데이터 조회
  const walletData = await analyzeWalletData(walletAddress, chainKey);

  // 2. GoPlus에서 토큰 보안 정보 조회
  const contractAddresses = walletData.portfolio.tokenBalances
    .map(t => t.contractAddress)
    .filter(addr => addr && addr.startsWith('0x'));

  const securityData = await checkMultipleTokensSecurity(contractAddresses, chainKey);

  // 3. flock.io AI 분석 요청
  const aiInput: FlockAIAnalysisInput = {
    walletAddress,
    chainKey,
    walletData: {
      totalValueUsd: walletData.portfolio.totalValueUsd,
      portfolioCoins: walletData.portfolio.portfolioCoins,
      recentTransfers: walletData.recentTransfers,
      nativeBalance: walletData.portfolio.nativeBalance,
      summary: walletData.summary,
    },
    tokenSecurityData: securityData,
    userSettings,
  };

  const prompt = buildFlockAIPrompt(aiInput);
  const aiAnalysis = await callFlockAI(prompt);

  return {
    walletData,
    securityData,
    aiAnalysis,
  };
}

// ============================================
// 타입 정의
// ============================================

/**
 * 토큰 잔고 타입 (썸네일 포함)
 */
export interface TokenBalance {
  symbol: string;
  name: string;
  contractAddress: string;
  amount: string;
  amountRaw: string;
  decimals: number;
  price: number | null;
  priceChange24h: number | null;
  valueUsd: number | null;
  logo: string;
  thumbnail: string;
  verified: boolean;
  riskLevel?: 'safe' | 'caution' | 'warning';
}

/**
 * 네이티브 토큰 잔고 타입
 */
export interface NativeBalance {
  symbol: string;
  name: string;
  balance: string;
  balanceFormatted: string;
  logo: string;
  valueUsd: number | null;
}

/**
 * ERC20 전송 타입 (썸네일 포함)
 */
export interface TokenTransfer {
  hash: string;
  from: string;
  to: string;
  tokenSymbol: string;
  tokenName: string;
  tokenAddress: string;
  tokenLogo: string;
  value: string;
  valueFormatted: string;
  decimals: number;
  blockTimestamp: string;
  direction: 'in' | 'out';
}

/**
 * 포트폴리오 코인 타입 (분석용)
 */
export interface PortfolioCoin {
  symbol: string;
  name: string;
  amount: string;
  value: number;
  price: number;
  change24h: number;
  allocation: number;
  logo: string;
  riskLevel: 'safe' | 'caution' | 'warning';
}

/**
 * 거래 평가 타입
 */
export interface TradeEvaluation {
  hash: string;
  coin: string;
  coinLogo: string;
  type: 'buy' | 'sell';
  amount: string;
  date: string;
  evaluation: 'good' | 'neutral' | 'bad';
  comment: string;
}

/**
 * 지갑 데이터 요약 타입
 */
export interface WalletSummary {
  totalValueUsd: number;
  totalTokens: number;
  transfersIn: number;
  transfersOut: number;
}

// ============================================
// GoPlus Security API 타입 정의
// ============================================

/**
 * GoPlus 토큰 보안 검사 결과
 */
export interface GoPlusTokenSecurity {
  contractAddress: string;
  // 핵심 보안 지표
  isHoneypot: boolean;          // 허니팟 (구매 가능, 판매 불가)
  buyTax: number;               // 구매 세금 (%)
  sellTax: number;              // 판매 세금 (%)
  // 컨트랙트 위험 요소
  isProxy: boolean;             // 프록시 컨트랙트 여부
  isMintable: boolean;          // 민트 가능 여부
  canTakeBackOwnership: boolean; // 소유권 회수 가능
  ownerChangeBalance: boolean;  // 소유자가 잔액 변경 가능
  hiddenOwner: boolean;         // 숨겨진 소유자
  selfDestruct: boolean;        // 자기 파괴 기능
  externalCall: boolean;        // 외부 호출 기능
  // 거래 제한
  isBlacklisted: boolean;       // 블랙리스트 기능
  isWhitelisted: boolean;       // 화이트리스트 기능
  isAntiWhale: boolean;         // 고래 방지 기능
  tradingCooldown: boolean;     // 거래 쿨다운
  transferPausable: boolean;    // 전송 일시정지 가능
  cannotBuy: boolean;           // 구매 불가
  cannotSellAll: boolean;       // 전량 판매 불가
  // 기타 정보
  holderCount: number;          // 홀더 수
  totalSupply: string;          // 총 공급량
  // 계산된 위험도
  riskScore: number;            // 0-100 (높을수록 위험)
  riskLevel: 'safe' | 'caution' | 'warning';
}

/**
 * GoPlus 지갑 보안 검사 결과 (추후 확장용)
 */
export interface GoPlusWalletSecurity {
  walletAddress: string;
  isContract: boolean;
  isMalicious: boolean;
  maliciousType?: string;
  riskScore: number;
}