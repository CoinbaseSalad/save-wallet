# API Response 데이터 명세서

각 화면별로 클라이언트에 반환되는 데이터 구조를 정의합니다.

---

## 📑 목차

1. [Home 화면](#1-home-화면)
2. [Asset 화면](#2-asset-화면)
3. [Search 화면](#3-search-화면)
4. [공통 타입 정의](#4-공통-타입-정의)

---

## 1. Home 화면

### 1.1 개요

사용자 본인의 지갑을 분석하여 **AI 평가**, **최근 거래 내역**, **포트폴리오 현황**을 제공합니다.

### 1.2 API Endpoint

```
GET /api/wallet/analysis
```

### 1.3 Request

```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "chainKey": "base",
  "userSettings": {
    "investmentStyle": 2,
    "livingExpenseRatio": 60,
    "investmentRatio": 30,
    "roastLevel": 2
  }
}
```

| 필드                              | 타입   | 필수 | 설명                                        |
| --------------------------------- | ------ | ---- | ------------------------------------------- |
| `walletAddress`                   | string | ✅   | 분석할 지갑 주소                            |
| `chainKey`                        | string | ✅   | 체인 키 (base, ethereum, polygon, arbitrum) |
| `userSettings.investmentStyle`    | number | ✅   | 투자 성향 (0: 안정형 ~ 4: 공격투자형)       |
| `userSettings.livingExpenseRatio` | number | ✅   | 생활비 비율 (%)                             |
| `userSettings.investmentRatio`    | number | ✅   | 투자 비율 (%)                               |
| `userSettings.roastLevel`         | number | ✅   | Roast 강도 (0: Kind ~ 4: Hot)               |

### 1.4 Response

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "chainKey": "base",

    "aiEvaluation": {
      "overallScore": 7.2,
      "evaluation": "전반적으로 안정적인 투자 패턴을 보이고 있습니다. 👍",
      "riskLevel": "중간",
      "tradingFrequency": "주 3-5회",
      "investmentStyleMatch": "설정된 '위험중립형' 성향과 실제 포트폴리오가 잘 일치합니다.",
      "portfolioAdvice": "BTC 비중이 높은 안정적인 포트폴리오입니다. SOL 고점 매수에 주의하세요.",
      "riskWarnings": [
        "PEPE 토큰의 판매세가 15%로 높습니다.",
        "SOL이 7일간 47% 급등하여 과매수 구간입니다."
      ],
      "improvementSuggestions": [
        "밈코인 비중을 10% 이하로 줄이는 것을 권장합니다.",
        "스테이블코인 비중을 20% 정도 추가하면 안정성이 높아집니다."
      ]
    },

    "recentTrades": [
      {
        "hash": "0xabc123...",
        "coin": "BTC",
        "coinLogo": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        "type": "buy",
        "amount": "0.05",
        "price": 67250,
        "valueUsd": 3362.5,
        "date": "2024-11-25",
        "evaluation": "good",
        "comment": "좋은 진입점입니다. 지지선 부근에서 매수했네요."
      },
      {
        "hash": "0xdef456...",
        "coin": "ETH",
        "coinLogo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
        "type": "sell",
        "amount": "2.5",
        "price": 3420,
        "valueUsd": 8550,
        "date": "2024-11-24",
        "evaluation": "neutral",
        "comment": "적절한 익절입니다."
      },
      {
        "hash": "0xghi789...",
        "coin": "SOL",
        "coinLogo": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
        "type": "buy",
        "amount": "15",
        "price": 245,
        "valueUsd": 3675,
        "date": "2024-11-23",
        "evaluation": "bad",
        "comment": "고점 매수입니다. RSI 80 이상에서 진입은 위험해요."
      }
    ],

    "portfolio": {
      "totalValueUsd": 34000,
      "totalChange24h": 2.5,
      "totalChangeValue": 850,
      "coins": [
        {
          "symbol": "BTC",
          "name": "Bitcoin",
          "logo": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
          "amount": "0.15",
          "value": 10087.5,
          "price": 67250,
          "change24h": 2.3,
          "allocation": 29.7
        },
        {
          "symbol": "ETH",
          "name": "Ethereum",
          "logo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
          "amount": "5.2",
          "value": 17784,
          "price": 3420,
          "change24h": -1.2,
          "allocation": 52.3
        },
        {
          "symbol": "SOL",
          "name": "Solana",
          "logo": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
          "amount": "20",
          "value": 4900,
          "price": 245,
          "change24h": 5.7,
          "allocation": 14.4
        }
      ]
    },

    "investStyle": {
      "riskLevel": "중간",
      "tradingFrequency": "주 3-5회",
      "preferredCoins": ["BTC", "ETH", "SOL"],
      "avgHoldingPeriod": "2-5일",
      "diversificationScore": 70
    }
  }
}
```

### 1.5 Response 필드 상세 설명

#### `aiEvaluation` - AI 분석 평가 (flock.io)

| 필드                     | 타입     | 설명                                     |
| ------------------------ | -------- | ---------------------------------------- |
| `overallScore`           | number   | 지갑 건강도 점수 (0-10, 소수점 1자리)    |
| `evaluation`             | string   | 한 줄 평가 (roast 강도 반영)             |
| `riskLevel`              | string   | 위험도 레벨 ("낮음" / "중간" / "높음")   |
| `tradingFrequency`       | string   | 거래 빈도 분석 결과                      |
| `investmentStyleMatch`   | string   | 사용자 설정 투자 성향과 실제 일치도 분석 |
| `portfolioAdvice`        | string   | 포트폴리오 종합 조언 (2-3문장)           |
| `riskWarnings`           | string[] | 즉시 주의가 필요한 위험 경고들           |
| `improvementSuggestions` | string[] | 포트폴리오 개선 제안들                   |

#### `recentTrades` - 최근 거래 내역 (일주일)

| 필드         | 타입   | 설명                                      |
| ------------ | ------ | ----------------------------------------- |
| `hash`       | string | 트랜잭션 해시 (앞 10자 표시용)            |
| `coin`       | string | 코인 심볼                                 |
| `coinLogo`   | string | 코인 로고 이미지 URL                      |
| `type`       | string | 거래 유형 ("buy" / "sell")                |
| `amount`     | string | 거래 수량                                 |
| `price`      | number | 거래 당시 가격 (USD)                      |
| `valueUsd`   | number | 거래 금액 (USD)                           |
| `date`       | string | 거래 날짜 (YYYY-MM-DD)                    |
| `evaluation` | string | AI 거래 평가 ("good" / "neutral" / "bad") |
| `comment`    | string | AI 코멘트 (roast 강도 반영)               |

#### `portfolio` - 포트폴리오 현황

| 필드               | 타입   | 설명                   |
| ------------------ | ------ | ---------------------- |
| `totalValueUsd`    | number | 총 자산 가치 (USD)     |
| `totalChange24h`   | number | 24시간 변동률 (%)      |
| `totalChangeValue` | number | 24시간 변동 금액 (USD) |
| `coins`            | array  | 보유 코인 목록         |

#### `portfolio.coins[]` - 보유 코인

| 필드         | 타입   | 설명                   |
| ------------ | ------ | ---------------------- |
| `symbol`     | string | 코인 심볼              |
| `name`       | string | 코인 이름              |
| `logo`       | string | 코인 로고 이미지 URL   |
| `amount`     | string | 보유 수량              |
| `value`      | number | 평가 금액 (USD)        |
| `price`      | number | 현재 가격 (USD)        |
| `change24h`  | number | 24시간 가격 변동률 (%) |
| `allocation` | number | 포트폴리오 비중 (%)    |

#### `investStyle` - 투자 성향 분석

| 필드                   | 타입     | 설명                   |
| ---------------------- | -------- | ---------------------- |
| `riskLevel`            | string   | 분석된 위험도 레벨     |
| `tradingFrequency`     | string   | 거래 빈도              |
| `preferredCoins`       | string[] | 선호 코인 목록         |
| `avgHoldingPeriod`     | string   | 평균 보유 기간         |
| `diversificationScore` | number   | 분산 투자 점수 (0-100) |

---

## 2. Asset 화면

### 2.1 개요

보유 코인별 **상세 정보**, **위험도**, **위험 이유**, **근거 링크**를 제공합니다.

### 2.2 API Endpoint

```
GET /api/wallet/assets
```

### 2.3 Request

```json
{
  "walletAddress": "0x1234567890abcdef1234567890abcdef12345678",
  "chainKey": "base"
}
```

### 2.4 Response

```json
{
  "success": true,
  "data": {
    "walletAddress": "0x1234...5678",
    "chainKey": "base",

    "summary": {
      "totalValueUsd": 34000,
      "totalChange24h": 2.5,
      "totalChangeValue": 850,
      "totalCoins": 5,
      "riskSummary": {
        "warning": 2,
        "caution": 2,
        "safe": 1
      }
    },

    "coins": [
      {
        "symbol": "BTC",
        "name": "Bitcoin",
        "logo": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        "contractAddress": null,
        "amount": "0.15",
        "value": 10087.5,
        "price": 67250,
        "change24h": 2.3,
        "allocation": 29.7,

        "riskLevel": "safe",
        "riskReason": null,
        "riskSources": [],

        "securityInfo": {
          "isVerified": true,
          "isHoneypot": false,
          "buyTax": 0,
          "sellTax": 0,
          "riskScore": 5
        }
      },
      {
        "symbol": "ETH",
        "name": "Ethereum",
        "logo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
        "contractAddress": null,
        "amount": "5.2",
        "value": 17784,
        "price": 3420,
        "change24h": -1.2,
        "allocation": 52.3,

        "riskLevel": "caution",
        "riskReason": "최근 네트워크 혼잡으로 가스비 급등",
        "riskSources": [
          {
            "title": "Etherscan Gas Tracker - 현재 가스비 급등 확인",
            "url": "https://etherscan.io/gastracker",
            "importance": "high",
            "summary": "현재 평균 가스비 150 Gwei로 평소의 3배 수준"
          },
          {
            "title": "ETH 네트워크 혼잡도 분석 리포트",
            "url": "https://etherscan.io/chart/networkutilization",
            "importance": "high",
            "summary": "네트워크 사용률 98%로 매우 혼잡한 상태"
          },
          {
            "title": "이더리움 재단 공식 블로그",
            "url": "https://blog.ethereum.org",
            "importance": "medium",
            "summary": "Dencun 업그레이드 후 L2 활성화로 인한 일시적 혼잡"
          },
          {
            "title": "DeFi 프로토콜 TVL 현황",
            "url": "https://defillama.com",
            "importance": "medium",
            "summary": "DeFi TVL $50B 돌파로 활동량 증가"
          },
          {
            "title": "ETH 가격 변동 히스토리",
            "url": "https://coingecko.com/eth",
            "importance": "low",
            "summary": "가격에 미치는 영향은 제한적"
          }
        ],

        "securityInfo": {
          "isVerified": true,
          "isHoneypot": false,
          "buyTax": 0,
          "sellTax": 0,
          "riskScore": 10
        }
      },
      {
        "symbol": "SOL",
        "name": "Solana",
        "logo": "https://assets.coingecko.com/coins/images/4128/small/solana.png",
        "contractAddress": null,
        "amount": "20",
        "value": 4900,
        "price": 245,
        "change24h": 5.7,
        "allocation": 14.4,

        "riskLevel": "warning",
        "riskReason": "단기 급등으로 조정 가능성 높음",
        "riskSources": [
          {
            "title": "SOL 7일 급등률 47% - 과매수 구간 진입",
            "url": "https://solscan.io",
            "importance": "high",
            "summary": "7일간 47% 급등, 역사적 고점 근접"
          },
          {
            "title": "RSI 지표 80 이상 - 기술적 조정 신호",
            "url": "https://tradingview.com/sol",
            "importance": "high",
            "summary": "RSI 82로 과매수 구간, 조정 가능성 높음"
          },
          {
            "title": "솔라나 네트워크 장애 이력 분석",
            "url": "https://status.solana.com",
            "importance": "high",
            "summary": "최근 1년간 3회 네트워크 장애 발생"
          },
          {
            "title": "SOL 생태계 TVL 급증 현황",
            "url": "https://defillama.com/chain/solana",
            "importance": "medium",
            "summary": "TVL $8B로 역대 최고치 갱신"
          },
          {
            "title": "주요 거래소 SOL 거래량 분석",
            "url": "https://coinmarketcap.com/sol",
            "importance": "medium",
            "summary": "거래량 급증으로 변동성 확대 예상"
          },
          {
            "title": "솔라나 밈코인 열풍 관련 뉴스",
            "url": "https://decrypt.co/solana",
            "importance": "low",
            "summary": "밈코인 열풍으로 투기적 수요 유입"
          },
          {
            "title": "SOL 스테이킹 수익률 변화",
            "url": "https://solanabeach.io/validators",
            "importance": "low",
            "summary": "스테이킹 APY 7.5%로 양호"
          }
        ],

        "securityInfo": {
          "isVerified": true,
          "isHoneypot": false,
          "buyTax": 0,
          "sellTax": 0,
          "riskScore": 25
        }
      },
      {
        "symbol": "DOGE",
        "name": "Dogecoin",
        "logo": "https://assets.coingecko.com/coins/images/5/small/dogecoin.png",
        "contractAddress": null,
        "amount": "1000",
        "value": 420,
        "price": 0.42,
        "change24h": -3.5,
        "allocation": 1.2,

        "riskLevel": "warning",
        "riskReason": "높은 변동성, 밈코인 특성상 급락 위험",
        "riskSources": [
          {
            "title": "밈코인 시장 변동성 경고 - 블룸버그",
            "url": "https://bloomberg.com/crypto",
            "importance": "high",
            "summary": "밈코인 시장 변동성 지속, 단기 급락 가능성"
          },
          {
            "title": "DOGE 30일 변동성 분석 (±40%)",
            "url": "https://dogechain.info",
            "importance": "high",
            "summary": "월간 변동폭 ±40%로 극심한 변동성"
          },
          {
            "title": "일론 머스크 트윗 영향도 분석",
            "url": "https://twitter.com/elonmusk",
            "importance": "medium",
            "summary": "머스크 트윗에 따른 가격 급등락 패턴"
          },
          {
            "title": "DOGE 고래 지갑 이동 모니터링",
            "url": "https://bitinfocharts.com/doge",
            "importance": "medium",
            "summary": "상위 10개 지갑이 전체 물량의 45% 보유"
          },
          {
            "title": "밈코인 투자 리스크 가이드",
            "url": "https://investopedia.com/memecoins",
            "importance": "low",
            "summary": "밈코인 투자 시 유의사항 안내"
          }
        ],

        "securityInfo": {
          "isVerified": true,
          "isHoneypot": false,
          "buyTax": 0,
          "sellTax": 0,
          "riskScore": 35
        }
      },
      {
        "symbol": "PEPE",
        "name": "Pepe",
        "logo": "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
        "contractAddress": "0x6982508145454ce325ddbe47a25d4ec3d2311933",
        "amount": "100000000",
        "value": 808.5,
        "price": 0.000008085,
        "change24h": 1.8,
        "allocation": 2.4,

        "riskLevel": "caution",
        "riskReason": "고위험 밈코인, 판매세 존재",
        "riskSources": [
          {
            "title": "GoPlus Security - PEPE 토큰 보안 분석",
            "url": "https://gopluslabs.io/token-security/1/0x6982508145454ce325ddbe47a25d4ec3d2311933",
            "importance": "high",
            "summary": "컨트랙트 검증됨, 판매세 5% 존재"
          },
          {
            "title": "PEPE 홀더 분포 분석",
            "url": "https://etherscan.io/token/0x6982508145454ce325ddbe47a25d4ec3d2311933",
            "importance": "high",
            "summary": "상위 100개 지갑이 전체의 42% 보유"
          },
          {
            "title": "밈코인 시즌 분석 리포트",
            "url": "https://messari.io/memecoins",
            "importance": "medium",
            "summary": "밈코인 열풍 주기적 패턴 분석"
          }
        ],

        "securityInfo": {
          "isVerified": true,
          "isHoneypot": false,
          "buyTax": 0,
          "sellTax": 5,
          "riskScore": 40,
          "isProxy": false,
          "isMintable": false,
          "ownerChangeBalance": false,
          "hiddenOwner": false
        }
      }
    ],

    "portfolioAnalysis": {
      "summary": [
        "BTC/ETH 비중 82% - 안정적인 대형 코인 중심",
        "SOL, DOGE는 높은 변동성 주의 필요",
        "전체 위험도: 중간"
      ],
      "allocationChart": [
        { "symbol": "ETH", "percentage": 52.3, "riskLevel": "caution" },
        { "symbol": "BTC", "percentage": 29.7, "riskLevel": "safe" },
        { "symbol": "SOL", "percentage": 14.4, "riskLevel": "warning" },
        { "symbol": "PEPE", "percentage": 2.4, "riskLevel": "caution" },
        { "symbol": "DOGE", "percentage": 1.2, "riskLevel": "warning" }
      ]
    }
  }
}
```

### 2.5 Response 필드 상세 설명

#### `summary` - 자산 요약

| 필드                  | 타입   | 설명                   |
| --------------------- | ------ | ---------------------- |
| `totalValueUsd`       | number | 총 자산 가치 (USD)     |
| `totalChange24h`      | number | 24시간 변동률 (%)      |
| `totalChangeValue`    | number | 24시간 변동 금액 (USD) |
| `totalCoins`          | number | 보유 코인 종류 수      |
| `riskSummary`         | object | 위험도별 코인 개수     |
| `riskSummary.warning` | number | 경고 레벨 코인 수      |
| `riskSummary.caution` | number | 주의 레벨 코인 수      |
| `riskSummary.safe`    | number | 양호 레벨 코인 수      |

#### `coins[]` - 보유 코인 상세

| 필드              | 타입           | 설명                                         |
| ----------------- | -------------- | -------------------------------------------- |
| `symbol`          | string         | 코인 심볼                                    |
| `name`            | string         | 코인 이름                                    |
| `logo`            | string         | 코인 로고 이미지 URL                         |
| `contractAddress` | string \| null | 컨트랙트 주소 (네이티브 토큰은 null)         |
| `amount`          | string         | 보유 수량                                    |
| `value`           | number         | 평가 금액 (USD)                              |
| `price`           | number         | 현재 가격 (USD)                              |
| `change24h`       | number         | 24시간 가격 변동률 (%)                       |
| `allocation`      | number         | 포트폴리오 비중 (%)                          |
| `riskLevel`       | string         | 위험도 레벨 ("safe" / "caution" / "warning") |
| `riskReason`      | string \| null | 위험 이유 (safe인 경우 null)                 |
| `riskSources`     | array          | 위험도 근거 링크 목록                        |
| `securityInfo`    | object         | GoPlus 보안 정보                             |

#### `coins[].riskSources[]` - 위험도 근거 링크

| 필드         | 타입   | 설명                               |
| ------------ | ------ | ---------------------------------- |
| `title`      | string | 링크 제목                          |
| `url`        | string | 링크 URL                           |
| `importance` | string | 중요도 ("high" / "medium" / "low") |
| `summary`    | string | 해당 링크 내용 요약 (영향도 설명)  |

#### `coins[].securityInfo` - GoPlus 보안 정보

| 필드                 | 타입    | 설명                               |
| -------------------- | ------- | ---------------------------------- |
| `isVerified`         | boolean | 컨트랙트 검증 여부                 |
| `isHoneypot`         | boolean | 허니팟 여부                        |
| `buyTax`             | number  | 구매 세금 (%)                      |
| `sellTax`            | number  | 판매 세금 (%)                      |
| `riskScore`          | number  | 위험도 점수 (0-100, 높을수록 위험) |
| `isProxy`            | boolean | 프록시 컨트랙트 여부               |
| `isMintable`         | boolean | 민트 가능 여부                     |
| `ownerChangeBalance` | boolean | 소유자 잔액 변경 가능 여부         |
| `hiddenOwner`        | boolean | 숨겨진 소유자 여부                 |

---

## 3. Search 화면

### 3.1 개요

다른 사용자의 지갑 주소를 입력하여 **Home 화면과 동일한 분석 결과**를 제공합니다.

### 3.2 API Endpoint

```
GET /api/wallet/search
```

### 3.3 Request

```json
{
  "walletAddress": "0xabcdef1234567890abcdef1234567890abcdef12",
  "chainKey": "base",
  "viewerSettings": {
    "roastLevel": 2
  }
}
```

| 필드                        | 타입   | 필수 | 설명                                        |
| --------------------------- | ------ | ---- | ------------------------------------------- |
| `walletAddress`             | string | ✅   | 검색할 지갑 주소                            |
| `chainKey`                  | string | ✅   | 체인 키                                     |
| `viewerSettings.roastLevel` | number | ✅   | 현재 사용자의 Roast 강도 (검색 결과 표시용) |

### 3.4 Response

Home 화면과 **동일한 구조**입니다.

```json
{
  "success": true,
  "data": {
    "walletAddress": "0xabcd...ef12",
    "chainKey": "base",

    "aiEvaluation": {
      "overallScore": 5.8,
      "evaluation": "중간 수준의 위험 관리가 필요한 포트폴리오입니다.",
      "riskLevel": "높음",
      "tradingFrequency": "매일",
      "investmentStyleMatch": "공격적인 투자 성향으로 분석됩니다.",
      "portfolioAdvice": "밈코인 비중이 높고 거래 빈도가 잦습니다. 안정적인 코인으로 포트폴리오 다변화를 권장합니다.",
      "riskWarnings": [
        "PEPE 토큰의 비중이 15%로 높습니다.",
        "일일 거래 빈도가 매우 높아 수수료 손실이 예상됩니다."
      ],
      "improvementSuggestions": [
        "밈코인 비중을 5% 이하로 줄이세요.",
        "BTC, ETH 등 대형 코인 비중을 높이세요."
      ]
    },

    "recentTrades": [
      {
        "hash": "0xsearch1...",
        "coin": "ETH",
        "coinLogo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
        "type": "buy",
        "amount": "10",
        "price": 3380,
        "valueUsd": 33800,
        "date": "2024-11-25",
        "evaluation": "neutral",
        "comment": "평균적인 진입입니다."
      },
      {
        "hash": "0xsearch2...",
        "coin": "BTC",
        "coinLogo": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
        "type": "sell",
        "amount": "0.1",
        "price": 68000,
        "valueUsd": 6800,
        "date": "2024-11-24",
        "evaluation": "good",
        "comment": "적절한 타이밍의 익절입니다."
      },
      {
        "hash": "0xsearch3...",
        "coin": "PEPE",
        "coinLogo": "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
        "type": "buy",
        "amount": "50000000",
        "price": 0.000021,
        "valueUsd": 1050,
        "date": "2024-11-23",
        "evaluation": "bad",
        "comment": "고위험 밈코인 매수입니다. 손실에 주의하세요."
      }
    ],

    "portfolio": {
      "totalValueUsd": 122000,
      "totalChange24h": -1.8,
      "totalChangeValue": -2196,
      "coins": [
        {
          "symbol": "ETH",
          "name": "Ethereum",
          "logo": "https://assets.coingecko.com/coins/images/279/small/ethereum.png",
          "amount": "25",
          "value": 85500,
          "price": 3420,
          "change24h": -1.5,
          "allocation": 70.1
        },
        {
          "symbol": "BTC",
          "name": "Bitcoin",
          "logo": "https://assets.coingecko.com/coins/images/1/small/bitcoin.png",
          "amount": "0.5",
          "value": 33625,
          "price": 67250,
          "change24h": 2.1,
          "allocation": 27.6
        },
        {
          "symbol": "PEPE",
          "name": "Pepe",
          "logo": "https://assets.coingecko.com/coins/images/29850/small/pepe-token.jpeg",
          "amount": "100000000",
          "value": 2100,
          "price": 0.000021,
          "change24h": -8.3,
          "allocation": 1.7
        }
      ]
    },

    "investStyle": {
      "riskLevel": "높음",
      "tradingFrequency": "매일",
      "preferredCoins": ["ETH", "PEPE", "DOGE"],
      "avgHoldingPeriod": "1-3일",
      "diversificationScore": 40
    }
  }
}
```

### 3.5 Home 화면과의 차이점

| 항목        | Home                | Search                          |
| ----------- | ------------------- | ------------------------------- |
| 지갑 주소   | 연결된 본인 지갑    | 입력한 타인 지갑                |
| 사용자 설정 | 본인 설정값 사용    | roastLevel만 사용 (검색자 기준) |
| AI 분석     | 본인 투자 성향 반영 | 지갑 데이터만으로 성향 추정     |

---

## 4. 공통 타입 정의

### 4.1 RiskLevel (위험도 레벨)

```typescript
type RiskLevel = "safe" | "caution" | "warning";
```

| 값        | 설명 | UI 색상   |
| --------- | ---- | --------- |
| `safe`    | 양호 | 🟢 green  |
| `caution` | 주의 | 🟡 yellow |
| `warning` | 경고 | 🔴 red    |

### 4.2 TradeEvaluation (거래 평가)

```typescript
type TradeEvaluation = "good" | "neutral" | "bad";
```

| 값        | 설명 | UI 색상   |
| --------- | ---- | --------- |
| `good`    | 좋음 | 🟢 green  |
| `neutral` | 보통 | 🟡 yellow |
| `bad`     | 주의 | 🔴 red    |

### 4.3 Importance (중요도)

```typescript
type Importance = "high" | "medium" | "low";
```

| 값       | 설명 | UI 표시    |
| -------- | ---- | ---------- |
| `high`   | 상   | 🔴 빨간 점 |
| `medium` | 중   | 🟡 노란 점 |
| `low`    | 하   | 🟢 초록 점 |

### 4.4 UserSettings (사용자 설정)

```typescript
interface UserSettings {
  investmentStyle: number; // 0: 안정형 ~ 4: 공격투자형
  livingExpenseRatio: number; // 생활비 비율 (%)
  investmentRatio: number; // 투자 비율 (%)
  roastLevel: number; // 0: Kind ~ 4: Hot
}
```

### 4.5 InvestmentStyle 매핑

| 값  | 레이블     | 설명             |
| --- | ---------- | ---------------- |
| 0   | 안정형     | 원금 보존 최우선 |
| 1   | 안정추구형 | 안정적 수익 추구 |
| 2   | 위험중립형 | 위험-수익 균형   |
| 3   | 적극투자형 | 높은 수익 추구   |
| 4   | 공격투자형 | 최대 수익 추구   |

### 4.6 RoastLevel 매핑

> **규칙**: 값이 낮을수록 약한 roast, 높을수록 강한 roast

| 값  | 레이블 | 강도      | 설명                                       |
| --- | ------ | --------- | ------------------------------------------ |
| 0   | Kind   | 가장 약함 | 격려와 긍정에 집중하는 부드러운 피드백     |
| 1   | Mild   | 약함      | 친절하고 가벼운 건설적 피드백              |
| 2   | Medium | 중간      | 균형 잡힌 현실적인 피드백                  |
| 3   | Spicy  | 강함      | 직설적이고 날카로운 피드백                 |
| 4   | Hot    | 가장 강함 | 거침없는 로스트 스타일, 현실을 직시하게 함 |

---

## 📝 에러 응답 형식

모든 API는 에러 발생 시 다음 형식으로 응답합니다.

```json
{
  "success": false,
  "error": {
    "code": "INVALID_ADDRESS",
    "message": "유효하지 않은 지갑 주소입니다.",
    "details": "주소 형식이 올바르지 않습니다."
  }
}
```

### 에러 코드

| 코드                | HTTP 상태 | 설명                    |
| ------------------- | --------- | ----------------------- |
| `INVALID_ADDRESS`   | 400       | 유효하지 않은 지갑 주소 |
| `UNSUPPORTED_CHAIN` | 400       | 지원하지 않는 체인      |
| `WALLET_NOT_FOUND`  | 404       | 지갑을 찾을 수 없음     |
| `MORALIS_ERROR`     | 502       | Moralis API 오류        |
| `GOPLUS_ERROR`      | 502       | GoPlus API 오류         |
| `FLOCK_AI_ERROR`    | 502       | flock.io AI API 오류    |
| `INTERNAL_ERROR`    | 500       | 내부 서버 오류          |
