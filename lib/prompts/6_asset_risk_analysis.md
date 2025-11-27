# 🎯 Asset Risk Analysis Prompt - 자산 위험도 분석

## 개요

`asset_risk_analysis` 프롬프트는 **Asset 화면**에서 사용되는 핵심 프롬프트입니다.
각 보유 코인별로 위험도를 분석하고, 근거 링크와 함께 상세한 리스크 평가를 제공합니다.

## 사용 화면

- **Asset 페이지** (`/asset`)
- 각 코인 카드에 표시되는 위험도 정보 생성
- 근거 링크 목록 (중요도별 정렬)

## 구글 프롬프트 엔지니어링 기법 적용

### 1. ROLE (역할 지정)

```
You are a cryptocurrency risk assessment specialist with expertise in 
on-chain security analysis, market dynamics, and token fundamentals.
```

| 전문 영역 | 설명 |
|----------|------|
| **온체인 보안 분석** | 스마트 컨트랙트 취약점, 허니팟 탐지 |
| **시장 역학** | 가격 변동성, 기술적 분석 지표 |
| **토큰 펀더멘털** | 토큰 경제학, 프로젝트 신뢰도 |

### 2. TASK (작업 정의)

```
Analyze each token in the provided portfolio and generate:
1. Risk level classification (safe/caution/warning)
2. Clear, specific risk reason explanation
3. Supporting evidence sources with importance ranking
4. Portfolio-level risk summary
```

### 3. INPUTS (입력 데이터)

| 변수명 | 설명 | 데이터 소스 |
|--------|------|-------------|
| `chain_key` | 블록체인 네트워크 | 사용자 선택 |
| `portfolio_coins_json` | 보유 코인 목록 | Moralis API |
| `security_data_json` | GoPlus 보안 분석 결과 | GoPlus API |
| `market_data_json` | 시장 데이터 (가격, 변동률) | Moralis API |

### 4. RISK CLASSIFICATION (위험도 분류)

#### 🟢 SAFE (안전) - 점수 0-24

| 기준 | 상세 |
|------|------|
| 시가총액 | BTC, ETH 등 대형 코인 |
| 컨트랙트 | 검증됨, 취약점 없음 |
| 가격 안정성 | 시장 대비 낮은 변동성 |
| 유동성 | 주요 거래소에서 충분한 유동성 |
| 세금 | 구매/판매 세금 1% 미만 |

#### 🟡 CAUTION (주의) - 점수 25-49

| 기준 | 상세 |
|------|------|
| 시가총액 | 중형 코인 |
| 컨트랙트 | 경미한 우려 또는 미검증 |
| 가격 변동 | 7일간 ±30% 이상 변동 |
| 네트워크 | 가스비 급등, 혼잡 문제 |
| 규제 | 법적 불확실성 존재 |
| 세금 | 판매세 1-10% |

#### 🔴 WARNING (경고) - 점수 50-100

| 기준 | 상세 |
|------|------|
| 시가총액 | 소형 또는 신규 코인 |
| 보안 플래그 | 허니팟, 고세금(>10%), 민팅 가능 |
| 변동성 | 7일간 50% 이상 변동 |
| 집중 위험 | 상위 10개 지갑이 30% 이상 보유 |
| 의심 패턴 | 러그풀 패턴, 의심스러운 컨트랙트 |
| 투기성 | 밈코인, 순수 투기 가치 |

### 5. SOURCE GENERATION (근거 링크 생성)

#### 신뢰할 수 있는 도메인 목록

```
etherscan.io, solscan.io, basescan.org, polygonscan.com,
coingecko.com, coinmarketcap.com, defillama.com, 
messari.io, tradingview.com, dune.com,
gopluslabs.io, certik.com, hacken.io
```

#### 중요도 레벨

| 레벨 | 설명 | 사용 상황 |
|------|------|----------|
| **high** 🔴 | 즉각적인 보안 위협, 핵심 지표 | 허니팟 경고, RSI 과매수/과매도, 급격한 가격 변동 |
| **medium** 🟡 | 위험 평가에 영향을 미치는 요소 | TVL 변화, 네트워크 활동, 규제 뉴스 |
| **low** 🟢 | 배경 정보, 일반 맥락 | 일반 가격 히스토리, 스테이킹 수익률 |

### 6. SCHEMA (출력 형식)

```json
{
  "coins": [
    {
      "symbol": "ETH",
      "name": "Ethereum",
      "contractAddress": null,
      "riskLevel": "caution",
      "riskScore": 28,
      "riskReason": "네트워크 혼잡으로 가스비 3배 급등 (150 Gwei). 5일간 15% 가격 조정.",
      "riskSources": [
        {
          "title": "Etherscan Gas Tracker - 현재 네트워크 혼잡 경고",
          "url": "https://etherscan.io/gastracker",
          "importance": "high",
          "summary": "평균 가스비 150 Gwei, 30일 평균(45 Gwei)의 3배 수준"
        }
      ]
    }
  ],
  "portfolioSummary": {
    "overallRiskLevel": "caution",
    "riskDistribution": {"safe": 1, "caution": 2, "warning": 1},
    "keyRisks": ["ETH 네트워크 혼잡으로 거래 지연 가능"],
    "recommendations": ["DOGE 포지션 50% 축소 권장"]
  },
  "generatedAt": "2024-11-27T10:30:00Z"
}
```

### 7. SAMPLING 파라미터

```
- temperature: 0.25 (일관된 위험 평가를 위해 낮게 설정)
- top_p: 0.9 
- top_k: 35
- max_tokens: 3000 (다수 코인 분석을 위한 충분한 길이)
```

## 사용 예시

```typescript
import { buildAssetRiskAnalysisPrompt } from '@/lib/promptLoader';

const prompt = buildAssetRiskAnalysisPrompt({
  chainKey: 'base',
  portfolioCoins: [
    {
      symbol: 'ETH',
      name: 'Ethereum',
      contractAddress: null,
      value: 17784,
      price: 3420,
      change24h: -1.2,
      allocation: 52.3
    },
    {
      symbol: 'DOGE',
      name: 'Dogecoin',
      contractAddress: null,
      value: 420,
      price: 0.42,
      change24h: -3.5,
      allocation: 1.2
    }
  ],
  securityData: {
    'ETH': { isVerified: true, isHoneypot: false, sellTax: 0 },
    'DOGE': { isVerified: true, isHoneypot: false, sellTax: 0 }
  },
  marketData: {
    volatility: { ETH: 15, DOGE: 45 },
    volume24h: { ETH: 15000000000, DOGE: 800000000 }
  }
});
```

## 출력 필드 상세

### `coins[]` - 개별 코인 분석

| 필드 | 타입 | 설명 |
|------|------|------|
| `symbol` | string | 토큰 심볼 |
| `name` | string | 토큰 이름 |
| `contractAddress` | string \| null | 컨트랙트 주소 (네이티브는 null) |
| `riskLevel` | string | 위험도 ("safe" / "caution" / "warning") |
| `riskScore` | number | 위험도 점수 (0-100) |
| `riskReason` | string \| null | 위험 이유 (구체적 수치 포함) |
| `riskSources` | array | 근거 링크 목록 |

### `riskSources[]` - 근거 링크

| 필드 | 타입 | 설명 |
|------|------|------|
| `title` | string | 링크 제목 (구체적, 설명적) |
| `url` | string | 신뢰할 수 있는 도메인 URL |
| `importance` | string | 중요도 ("high" / "medium" / "low") |
| `summary` | string | 구체적 발견 사항 (데이터 포함) |

### `portfolioSummary` - 포트폴리오 요약

| 필드 | 타입 | 설명 |
|------|------|------|
| `overallRiskLevel` | string | 전체 위험도 레벨 |
| `riskDistribution` | object | 위험도별 코인 수 |
| `keyRisks` | string[] | 상위 3개 포트폴리오 위험 요소 |
| `recommendations` | string[] | 2-3개 실행 가능한 제안 |

## 주요 특징

### ✅ 장점

1. **증거 기반 분석**: 모든 위험 평가는 근거 링크로 뒷받침
2. **정량적 평가**: 0-100점 위험도 점수 제공
3. **실행 가능한 조언**: 포트폴리오 수준 개선 제안
4. **다층 분류**: 개별 코인 + 전체 포트폴리오 분석

### ⚠️ 주의사항

1. 근거 URL은 실제 존재하는 도메인 패턴 사용
2. `riskReason`에 반드시 구체적 수치 포함 (%, 일수, 금액)
3. caution/warning 레벨은 최소 2개의 high 중요도 소스 필요
4. safe 레벨 코인도 긍정적 지표를 소스로 제공

## 관련 파일

- `lib/promptLoader.ts` - 프롬프트 템플릿
- `lib/moralis.ts` - API 호출 로직
- `app/api/wallet/assets/route.ts` - Asset API 라우트
- `app/(main)/asset/page.tsx` - Asset 화면 컴포넌트
- `docs/api_response_spec.md` - API 응답 명세서

