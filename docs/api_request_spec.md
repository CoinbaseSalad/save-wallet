# API 요청 사양 (API Request Specification)

> 마지막 업데이트: 2024-11-27  
> 프로젝트: Coinbase Salad - 암호화폐 지갑 분석 서비스

이 문서는 프로젝트의 모든 API 요청 사양을 정의합니다.

---

## 목차

1. [클라이언트 → 서버 API](#1-클라이언트--서버-api)
   - [1.1 지갑 분석 요청 (Home/Search)](#11-지갑-분석-요청-homesearch)
   - [1.2 자산 현황 요청 (Asset)](#12-자산-현황-요청-asset)
2. [서버 → Moralis API](#2-서버--moralis-api)
   - [2.1 토큰 잔고 조회 (가격 포함)](#21-토큰-잔고-조회-가격-포함)
   - [2.2 토큰 전송 내역 조회](#22-토큰-전송-내역-조회)
   - [2.3 네이티브 토큰 잔고 조회](#23-네이티브-토큰-잔고-조회)
   - [2.4 토큰 가격 조회](#24-토큰-가격-조회)
3. [서버 → GoPlus Security API](#3-서버--goplus-security-api)
   - [3.1 토큰 보안 검사](#31-토큰-보안-검사)
4. [서버 → flock.io AI API](#4-서버--flockio-ai-api)
   - [4.1 Chat Completions](#41-chat-completions)
5. [데이터 흐름 다이어그램](#5-데이터-흐름-다이어그램)
6. [환경 변수](#6-환경-변수)

---

## 1. 클라이언트 → 서버 API

### 1.1 지갑 분석 요청 (Home/Search)

Home 화면과 Search 화면에서 사용하는 지갑 종합 분석 API입니다.

#### 요청 (Request)

```http
POST /api/wallet/analyze
Content-Type: application/json
```

```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "chainKey": "base",
  "userSettings": {
    "investmentStyle": 2,
    "livingExpenseRatio": 50,
    "investmentRatio": 30,
    "roastLevel": 2
  }
}
```

#### 요청 파라미터

| 필드                              | 타입   | 필수 | 설명                                               |
| --------------------------------- | ------ | ---- | -------------------------------------------------- |
| `walletAddress`                   | string | ✅   | 분석할 지갑 주소 (0x로 시작하는 42자 Hex 문자열)   |
| `chainKey`                        | string | ✅   | 체인 키: `base`, `ethereum`, `polygon`, `arbitrum` |
| `userSettings`                    | object | ✅   | 사용자 설정 객체                                   |
| `userSettings.investmentStyle`    | number | ✅   | 투자 성향 (0: 안정형 ~ 4: 공격투자형)              |
| `userSettings.livingExpenseRatio` | number | ✅   | 생활비 비율 (0-100, %)                             |
| `userSettings.investmentRatio`    | number | ✅   | 투자 비율 (0-100, %)                               |
| `userSettings.roastLevel`         | number | ✅   | Roast 강도 (0: Kind ~ 4: Hot)                      |

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "chainKey": "base",
    "aiEvaluation": {
      /* AI 평가 데이터 */
    },
    "recentTrades": [
      /* 최근 거래 내역 */
    ],
    "portfolio": {
      /* 포트폴리오 현황 */
    },
    "investStyle": {
      /* 투자 성향 분석 */
    }
  },
  "timestamp": "2024-11-27T12:00:00.000Z"
}
```

> 상세 응답 구조는 [api_response_spec.md](./api_response_spec.md) 참조

#### cURL 예시

```bash
curl -X POST 'http://localhost:3000/api/wallet/analyze' \
  -H 'Content-Type: application/json' \
  -d '{
    "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
    "chainKey": "base",
    "userSettings": {
      "investmentStyle": 2,
      "livingExpenseRatio": 50,
      "investmentRatio": 30,
      "roastLevel": 2
    }
  }'
```

---

### 1.2 자산 현황 요청 (Asset)

Asset 화면에서 사용하는 자산 상세 정보 API입니다.

#### 요청 (Request)

```http
POST /api/wallet/assets
Content-Type: application/json
```

```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "chainKey": "base"
}
```

#### 요청 파라미터

| 필드            | 타입   | 필수 | 설명                                               |
| --------------- | ------ | ---- | -------------------------------------------------- |
| `walletAddress` | string | ✅   | 조회할 지갑 주소                                   |
| `chainKey`      | string | ✅   | 체인 키: `base`, `ethereum`, `polygon`, `arbitrum` |

#### 응답 (Response)

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "chainKey": "base",
    "summary": {
      /* 자산 요약 */
    },
    "coins": [
      /* 보유 코인 상세 (보안 정보 포함) */
    ],
    "portfolioAnalysis": {
      /* 포트폴리오 분석 */
    }
  },
  "timestamp": "2024-11-27T12:00:00.000Z"
}
```

> 상세 응답 구조는 [api_response_spec.md](./api_response_spec.md) 참조

---

## 2. 서버 → Moralis API

### 2.1 토큰 잔고 조회 (가격 포함)

지갑의 ERC20 토큰 잔고와 현재 가격을 조회합니다.

#### 요청 (Request)

```http
GET https://deep-index.moralis.io/api/v2.2/wallets/{address}/tokens
X-API-Key: {MORALIS_API_KEY}
```

#### Query Parameters

| 파라미터 | 타입   | 필수 | 설명                            |
| -------- | ------ | ---- | ------------------------------- |
| `chain`  | string | ❌   | 체인 ID (예: `0x2105` for Base) |
| `limit`  | number | ❌   | 결과 제한 (기본값: 100)         |
| `cursor` | string | ❌   | 페이지네이션 커서               |

#### SDK 사용법

```typescript
import Moralis from "moralis";
import { EvmChain } from "@moralisweb3/common-evm-utils";

const response = await Moralis.EvmApi.wallets.getWalletTokenBalancesPrice({
  address: "0x1234...",
  chain: EvmChain.BASE,
});
```

#### 응답 (Response)

```json
{
  "result": [
    {
      "token_address": "0xabcd...",
      "symbol": "USDC",
      "name": "USD Coin",
      "logo": "https://...",
      "thumbnail": "https://...",
      "decimals": 6,
      "balance": "1000000000",
      "balance_formatted": "1000.000000",
      "usd_price": 0.9998,
      "usd_price_24hr_percent_change": 0.01,
      "usd_price_24hr_usd_change": 0.0001,
      "usd_value": 999.8,
      "usd_value_24hr_usd_change": 0.1,
      "native_token": false,
      "portfolio_percentage": 45.5,
      "verified_contract": true
    }
  ],
  "cursor": "...",
  "page": 1,
  "page_size": 100
}
```

#### 응답 필드 설명

| 필드                            | 타입    | 설명                   |
| ------------------------------- | ------- | ---------------------- |
| `token_address`                 | string  | 토큰 컨트랙트 주소     |
| `symbol`                        | string  | 토큰 심볼              |
| `name`                          | string  | 토큰 이름              |
| `logo`                          | string  | 토큰 로고 URL          |
| `thumbnail`                     | string  | 토큰 썸네일 URL        |
| `decimals`                      | number  | 소수점 자릿수          |
| `balance`                       | string  | 원시 잔고 (wei 단위)   |
| `balance_formatted`             | string  | 포맷된 잔고            |
| `usd_price`                     | number  | 현재 USD 가격          |
| `usd_price_24hr_percent_change` | number  | 24시간 가격 변동률 (%) |
| `usd_value`                     | number  | 총 USD 가치            |
| `verified_contract`             | boolean | 검증된 컨트랙트 여부   |

---

### 2.2 토큰 전송 내역 조회

지갑의 ERC20 토큰 전송 내역을 조회합니다.

#### 요청 (Request)

```http
GET https://deep-index.moralis.io/api/v2.2/{address}/erc20/transfers
X-API-Key: {MORALIS_API_KEY}
```

#### Query Parameters

| 파라미터    | 타입   | 필수 | 설명                    |
| ----------- | ------ | ---- | ----------------------- |
| `chain`     | string | ❌   | 체인 ID                 |
| `from_date` | string | ❌   | 시작 날짜 (ISO 8601)    |
| `to_date`   | string | ❌   | 종료 날짜 (ISO 8601)    |
| `limit`     | number | ❌   | 결과 제한 (기본값: 100) |

#### SDK 사용법

```typescript
const oneWeekAgo = new Date();
oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

const response = await Moralis.EvmApi.token.getWalletTokenTransfers({
  address: "0x1234...",
  chain: EvmChain.BASE,
  fromDate: oneWeekAgo.toISOString(),
  toDate: new Date().toISOString(),
  limit: 100,
});
```

#### 응답 (Response)

```json
{
  "result": [
    {
      "transaction_hash": "0xabc123...",
      "address": "0xtoken...",
      "block_timestamp": "2024-11-27T10:30:00.000Z",
      "block_number": "12345678",
      "block_hash": "0xblock...",
      "to_address": "0xto...",
      "from_address": "0xfrom...",
      "value": "1000000000000000000",
      "value_decimal": "1.0",
      "token_name": "Wrapped Ether",
      "token_symbol": "WETH",
      "token_decimals": 18,
      "token_logo": "https://..."
    }
  ],
  "cursor": "...",
  "page": 1,
  "page_size": 100
}
```

#### 응답 필드 설명

| 필드               | 타입   | 설명                  |
| ------------------ | ------ | --------------------- |
| `transaction_hash` | string | 트랜잭션 해시         |
| `address`          | string | 토큰 컨트랙트 주소    |
| `block_timestamp`  | string | 블록 타임스탬프 (ISO) |
| `to_address`       | string | 수신 주소             |
| `from_address`     | string | 송신 주소             |
| `value`            | string | 전송량 (wei)          |
| `value_decimal`    | string | 전송량 (포맷)         |
| `token_symbol`     | string | 토큰 심볼             |
| `token_decimals`   | number | 소수점 자릿수         |

---

### 2.3 네이티브 토큰 잔고 조회

지갑의 네이티브 토큰 (ETH, MATIC 등) 잔고를 조회합니다.

#### 요청 (Request)

```http
GET https://deep-index.moralis.io/api/v2.2/{address}/balance
X-API-Key: {MORALIS_API_KEY}
```

#### SDK 사용법

```typescript
const response = await Moralis.EvmApi.balance.getNativeBalance({
  address: "0x1234...",
  chain: EvmChain.BASE,
});

// response.result.balance - 잔고 (wei)
// response.result.balance.ether - 잔고 (ETH)
```

#### 응답 (Response)

```json
{
  "balance": "1234567890000000000"
}
```

---

### 2.4 토큰 가격 조회

특정 토큰의 현재 가격을 조회합니다.

#### 요청 (Request)

```http
GET https://deep-index.moralis.io/api/v2.2/erc20/{address}/price
X-API-Key: {MORALIS_API_KEY}
```

#### SDK 사용법

```typescript
const response = await Moralis.EvmApi.token.getTokenPrice({
  address: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", // WETH
  chain: EvmChain.ETHEREUM,
});

// response.result.usdPrice - USD 가격
```

#### 응답 (Response)

```json
{
  "nativePrice": {
    "value": "1000000000000000000",
    "decimals": 18,
    "name": "Ether",
    "symbol": "ETH"
  },
  "usdPrice": 3245.67,
  "usdPriceFormatted": "3245.670000",
  "24hrPercentChange": "2.34",
  "exchangeAddress": "0x...",
  "exchangeName": "Uniswap v3"
}
```

---

## 3. 서버 → GoPlus Security API

### 3.1 토큰 보안 검사

토큰의 보안 위험 요소를 검사합니다.

#### 요청 (Request)

```http
GET https://api.gopluslabs.io/api/v1/token_security/{chain_id}?contract_addresses={addresses}
Authorization: Bearer {GOPLUS_API_KEY}  (선택)
Accept: application/json
```

#### Path/Query Parameters

| 파라미터             | 타입   | 필수 | 설명                          |
| -------------------- | ------ | ---- | ----------------------------- |
| `chain_id`           | string | ✅   | 체인 ID (아래 표 참조)        |
| `contract_addresses` | string | ✅   | 쉼표로 구분된 컨트랙트 주소들 |

#### 지원 체인 ID

| 체인 키    | Chain ID |
| ---------- | -------- |
| `ethereum` | 1        |
| `base`     | 8453     |
| `polygon`  | 137      |
| `arbitrum` | 42161    |

#### 요청 예시

```bash
curl -X GET \
  'https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913' \
  -H 'Accept: application/json'
```

#### 여러 토큰 동시 조회

```typescript
const addresses = ["0xaddr1...", "0xaddr2...", "0xaddr3..."];
const url = `https://api.gopluslabs.io/api/v1/token_security/8453?contract_addresses=${addresses.join(
  ","
)}`;
```

#### 응답 (Response)

```json
{
  "code": 1,
  "message": "OK",
  "result": {
    "0x833589fcd6edb6e08f4c7c32d4f71b54bda02913": {
      "is_open_source": "1",
      "is_proxy": "0",
      "is_mintable": "0",
      "can_take_back_ownership": "0",
      "owner_change_balance": "0",
      "hidden_owner": "0",
      "selfdestruct": "0",
      "external_call": "0",
      "is_honeypot": "0",
      "buy_tax": "0",
      "sell_tax": "0",
      "cannot_buy": "0",
      "cannot_sell_all": "0",
      "is_blacklisted": "0",
      "is_whitelisted": "0",
      "is_anti_whale": "0",
      "trading_cooldown": "0",
      "transfer_pausable": "0",
      "holder_count": "123456",
      "total_supply": "1000000000000000000000000"
    }
  }
}
```

#### 응답 필드 설명 (주요 보안 지표)

| 필드                   | 값    | 설명                             |
| ---------------------- | ----- | -------------------------------- |
| `is_honeypot`          | 0/1   | 🔴 허니팟 (구매 가능, 판매 불가) |
| `buy_tax`              | 0~100 | 구매 세금 (%)                    |
| `sell_tax`             | 0~100 | 판매 세금 (%)                    |
| `cannot_buy`           | 0/1   | 🔴 구매 불가                     |
| `cannot_sell_all`      | 0/1   | 🔴 전량 판매 불가                |
| `owner_change_balance` | 0/1   | 🟠 소유자가 잔액 변경 가능       |
| `hidden_owner`         | 0/1   | 🟠 숨겨진 소유자                 |
| `is_proxy`             | 0/1   | 🟡 프록시 컨트랙트               |
| `is_mintable`          | 0/1   | 🟡 추가 발행 가능                |
| `selfdestruct`         | 0/1   | 🔴 자기 파괴 기능                |
| `transfer_pausable`    | 0/1   | 🟡 전송 일시정지 가능            |
| `is_blacklisted`       | 0/1   | 🟡 블랙리스트 기능               |
| `trading_cooldown`     | 0/1   | 🟡 거래 쿨다운                   |
| `holder_count`         | 숫자  | 토큰 홀더 수                     |

#### 위험도 점수 계산 로직

```typescript
function calculateRiskScore(data: GoPlusResponse): number {
  let score = 0;

  // 치명적 위험 (각 30점)
  if (data.is_honeypot === "1") score += 30;
  if (data.cannot_buy === "1") score += 30;
  if (data.cannot_sell_all === "1") score += 30;

  // 높은 위험 (각 15점)
  if (parseFloat(data.buy_tax || "0") > 10) score += 15;
  if (parseFloat(data.sell_tax || "0") > 10) score += 15;
  if (data.owner_change_balance === "1") score += 15;
  if (data.hidden_owner === "1") score += 15;
  if (data.selfdestruct === "1") score += 15;

  // 중간 위험 (각 10점)
  if (data.is_proxy === "1") score += 10;
  if (data.is_mintable === "1") score += 10;
  if (data.can_take_back_ownership === "1") score += 10;
  if (data.external_call === "1") score += 10;
  if (data.transfer_pausable === "1") score += 10;

  return Math.min(score, 100);
}

// 위험도 레벨 계산
function getRiskLevel(score: number): "safe" | "caution" | "warning" {
  if (score >= 30) return "warning";
  if (score >= 15) return "caution";
  return "safe";
}
```

---

## 4. 서버 → flock.io AI API

### 4.1 Chat Completions

지갑 분석 결과를 기반으로 AI 평가를 생성합니다.

#### 요청 (Request)

```http
POST https://api.flock.io/v1/chat/completions
Accept: application/json
Content-Type: application/json
x-litellm-api-key: {FLOCK_API_KEY}
```

#### Request Body

```json
{
  "model": "qwen3-30b-a3b-instruct-2507",
  "messages": [
    {
      "role": "system",
      "content": "당신은 암호화폐 투자 분석 전문가입니다. 사용자의 지갑 데이터를 분석하고 평가를 제공합니다. 항상 요청된 JSON 형식으로만 응답합니다."
    },
    {
      "role": "user",
      "content": "{분석 프롬프트}"
    }
  ],
  "max_tokens": 2000,
  "temperature": 0.7,
  "stream": false
}
```

#### Request Body 필드 설명

| 필드          | 타입    | 필수 | 설명                               |
| ------------- | ------- | ---- | ---------------------------------- |
| `model`       | string  | ✅   | 사용할 모델 ID                     |
| `messages`    | array   | ✅   | 대화 메시지 배열                   |
| `max_tokens`  | number  | ❌   | 최대 생성 토큰 수 (기본값: 16)     |
| `temperature` | number  | ❌   | 랜덤성 (0-2, 기본값: 1)            |
| `stream`      | boolean | ❌   | 스트리밍 응답 여부 (기본값: false) |

#### 프롬프트 구조 예시

```typescript
function buildFlockAIPrompt(input: FlockAIAnalysisInput): string {
  return `당신은 암호화폐 투자 분석 및 평가 전문 AI입니다.
아래 정보를 바탕으로 지갑을 종합 분석하고 평가해주세요.

═══════════════════════════════════════════
📊 지갑 정보
═══════════════════════════════════════════
- 지갑 주소: ${input.walletAddress}
- 체인: ${input.chainKey}
- 총 자산 가치: $${input.walletData.totalValueUsd.toFixed(2)}
- 보유 토큰 수: ${input.walletData.portfolioCoins.length}개

═══════════════════════════════════════════
💰 포트폴리오 현황
═══════════════════════════════════════════
${formatPortfolio(input.walletData.portfolioCoins)}

═══════════════════════════════════════════
📜 최근 거래 내역 (일주일)
═══════════════════════════════════════════
${formatTrades(input.walletData.recentTransfers)}

═══════════════════════════════════════════
⚠️ 보안 위험 토큰 (GoPlus 분석)
═══════════════════════════════════════════
${formatRiskTokens(input.tokenSecurityData)}

═══════════════════════════════════════════
👤 사용자 프로필
═══════════════════════════════════════════
- 투자 성향: ${getStyleLabel(input.userSettings.investmentStyle)}
- 피드백 강도: ${getRoastLabel(input.userSettings.roastLevel)}

다음 JSON 형식으로만 응답해주세요:
{
  "overallScore": (0-10, 소수점 1자리),
  "evaluation": "(한 줄 평가)",
  "riskLevel": "(낮음/중간/높음)",
  "tradingFrequency": "(거래 빈도)",
  "investmentStyleMatch": "(성향 일치도)",
  "tradeEvaluations": [...],
  "portfolioAdvice": "(조언)",
  "riskWarnings": [...],
  "improvementSuggestions": [...]
}`;
}
```

#### 응답 (Response)

```json
{
  "id": "chatcmpl-abc123",
  "object": "chat.completion",
  "created": 1701086400,
  "model": "qwen3-30b-a3b-instruct-2507",
  "choices": [
    {
      "index": 0,
      "message": {
        "role": "assistant",
        "content": "{\n  \"overallScore\": 7.2,\n  \"evaluation\": \"...\",\n  ...}"
      },
      "finish_reason": "stop"
    }
  ],
  "usage": {
    "prompt_tokens": 1500,
    "completion_tokens": 500,
    "total_tokens": 2000
  }
}
```

#### 응답 필드 설명

| 필드                        | 타입   | 설명                         |
| --------------------------- | ------ | ---------------------------- |
| `id`                        | string | 응답 고유 ID                 |
| `model`                     | string | 사용된 모델                  |
| `choices[].message`         | object | AI 응답 메시지               |
| `choices[].message.content` | string | AI 응답 내용 (JSON 문자열)   |
| `choices[].finish_reason`   | string | 종료 이유 (`stop`, `length`) |
| `usage.prompt_tokens`       | number | 프롬프트 토큰 수             |
| `usage.completion_tokens`   | number | 생성된 토큰 수               |
| `usage.total_tokens`        | number | 총 사용 토큰 수              |

#### AI 응답 JSON 파싱

````typescript
async function callFlockAI(
  prompt: string
): Promise<FlockAIAnalysisResult | null> {
  const response = await fetch(FLOCK_API_URL, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "x-litellm-api-key": process.env.FLOCK_API_KEY!,
    },
    body: JSON.stringify({
      model: "qwen3-30b-a3b-instruct-2507",
      messages: [
        { role: "system", content: "..." },
        { role: "user", content: prompt },
      ],
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  // JSON 블록 추출 (마크다운 코드 블록 처리)
  const jsonMatch = content.match(/```json\s*([\s\S]*?)\s*```/) ||
    content.match(/```\s*([\s\S]*?)\s*```/) || [null, content];

  return JSON.parse(jsonMatch[1] || content);
}
````

#### AI 응답 예상 구조

```json
{
  "overallScore": 7.2,
  "evaluation": "포트폴리오 분산이 적절하고 안정 자산 비중이 높습니다. 다만 일부 밈코인의 비중이 높아 주의가 필요합니다.",
  "riskLevel": "중간",
  "tradingFrequency": "주 3-5회",
  "investmentStyleMatch": "설정된 위험중립형 성향과 대체로 일치하나, PEPE 보유량이 다소 공격적입니다.",
  "tradeEvaluations": [
    {
      "hash": "0xabc123...",
      "coin": "ETH",
      "type": "buy",
      "evaluation": "good",
      "comment": "저점 매수 타이밍이 좋았습니다."
    }
  ],
  "portfolioAdvice": "현재 포트폴리오는 안정적이지만, 밈코인 비중을 5% 이하로 줄이고 DeFi 토큰으로 분산하는 것을 권장합니다.",
  "riskWarnings": [
    "PEPE 토큰의 24시간 변동성이 15%를 초과했습니다.",
    "일부 토큰에서 높은 판매세가 감지되었습니다."
  ],
  "improvementSuggestions": [
    "스테이블코인 비중을 20%까지 늘려 변동성에 대비하세요.",
    "이더리움 메인넷 토큰도 함께 보유하여 멀티체인 분산을 고려하세요."
  ]
}
```

---

## 5. 데이터 흐름 다이어그램

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              클라이언트 (Next.js)                            │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │   Home 화면      │   │   Asset 화면     │   │  Search 화면    │           │
│  │                 │   │                 │   │                 │           │
│  │ - 지갑 주소      │   │ - 지갑 주소      │   │ - 검색 지갑 주소 │           │
│  │ - 사용자 설정    │   │                 │   │ - roastLevel    │           │
│  └────────┬────────┘   └────────┬────────┘   └────────┬────────┘           │
└───────────┼────────────────────┼────────────────────┼───────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
    POST /api/wallet/analyze   POST /api/wallet/assets   POST /api/wallet/analyze
            │                    │                    │
┌───────────┴────────────────────┴────────────────────┴───────────────────────┐
│                           서버 (API Routes)                                  │
│                                                                             │
│  ┌────────────────────────────────────────────────────────────────────┐    │
│  │                    performWalletAnalysis()                          │    │
│  │                                                                    │    │
│  │  1. Moralis API 호출 (병렬)                                        │    │
│  │     ├─ getWalletTokenBalances()  → 토큰 잔고 + 가격               │    │
│  │     ├─ getNativeTokenBalance()   → 네이티브 토큰 잔고             │    │
│  │     └─ getRecentTokenTransfers() → 일주일 거래 내역               │    │
│  │                                                                    │    │
│  │  2. GoPlus API 호출                                               │    │
│  │     └─ checkMultipleTokensSecurity() → 토큰 보안 정보             │    │
│  │                                                                    │    │
│  │  3. flock.io AI 호출                                              │    │
│  │     ├─ buildFlockAIPrompt()  → 프롬프트 생성                      │    │
│  │     └─ callFlockAI()         → AI 평가 요청                       │    │
│  └────────────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│    Moralis API    │  │   GoPlus API      │  │   flock.io AI     │
│                   │  │                   │  │                   │
│ • Token Balances  │  │ • Token Security  │  │ • Chat Completions│
│ • Token Transfers │  │ • Risk Analysis   │  │ • JSON Analysis   │
│ • Native Balance  │  │                   │  │                   │
│ • Token Prices    │  │                   │  │                   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
```

---

## 6. 환경 변수

### 필수 환경 변수 (.env.local)

```env
# Moralis API
MORALIS_API_KEY=your_moralis_api_key_here

# flock.io AI
FLOCK_API_KEY=your_flock_api_key_here

# GoPlus Security (선택, 없어도 무료 API 사용 가능)
GOPLUS_API_KEY=your_goplus_api_key_here
```

### API 키 발급 방법

| 서비스   | 발급 URL                  | 비고                      |
| -------- | ------------------------- | ------------------------- |
| Moralis  | https://admin.moralis.io/ | Free tier 사용 가능       |
| flock.io | https://docs.flock.io/    | API 키 필요               |
| GoPlus   | https://gopluslabs.io/    | 무료 API 제공 (제한 있음) |

---

## 부록: 지원 체인 정보

| 체인 키    | 체인 이름    | Chain ID | Moralis Chain       | GoPlus Chain ID |
| ---------- | ------------ | -------- | ------------------- | --------------- |
| `base`     | Base         | 8453     | `EvmChain.BASE`     | 8453            |
| `ethereum` | Ethereum     | 1        | `EvmChain.ETHEREUM` | 1               |
| `polygon`  | Polygon      | 137      | `EvmChain.POLYGON`  | 137             |
| `arbitrum` | Arbitrum One | 42161    | `EvmChain.ARBITRUM` | 42161           |

---

## 부록: 에러 처리

### HTTP 상태 코드

| 코드 | 상태              | 설명                     |
| ---- | ----------------- | ------------------------ |
| 200  | OK                | 요청 성공                |
| 400  | Bad Request       | 잘못된 요청 파라미터     |
| 401  | Unauthorized      | API 키 누락/무효         |
| 404  | Not Found         | 지갑/토큰을 찾을 수 없음 |
| 429  | Too Many Requests | Rate limit 초과          |
| 500  | Internal Error    | 서버 내부 오류           |
| 502  | Bad Gateway       | 외부 API 오류            |

### 에러 응답 형식

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "유효하지 않은 지갑 주소입니다.",
    "details": {
      "walletAddress": "invalid_address"
    }
  },
  "timestamp": "2024-11-27T12:00:00.000Z"
}
```
