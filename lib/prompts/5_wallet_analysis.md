# 🔬 Wallet Analysis Prompt - 지갑 종합 분석

## 개요

`wallet_analysis` 프롬프트는 Home/Search 화면에서 사용되는 **핵심 프롬프트**입니다.
사용자의 암호화폐 지갑을 종합적으로 분석하여 투자 조언을 제공합니다.

## 구글 프롬프트 엔지니어링 기법 적용

### 1. ROLE (역할 지정)
```
You are a cryptocurrency investment analyst specializing in on-chain portfolio assessment.
```
- **명확한 전문가 역할** 부여
- DeFi, 토큰경제학, 리스크 관리 전문성 강조
- 데이터 기반의 실행 가능한 인사이트 제공 요구

### 2. TASK (작업 정의)
```
Analyze the provided wallet data and generate a comprehensive evaluation
```
- 4가지 핵심 분석 항목 명시:
  1. 전체 지갑 건강도 점수 (0-10)
  2. 투자 성향 일치도 평가
  3. 개별 거래 평가
  4. 위험 경고 및 개선 제안

### 3. INPUTS (입력 데이터)
| 변수명 | 설명 | 예시 |
|--------|------|------|
| `wallet_address` | 지갑 주소 | `0xd8dA6BF...` |
| `chain_key` | 블록체인 네트워크 | `base`, `ethereum` |
| `portfolio_json` | 포트폴리오 현황 (토큰 목록, 비중) | JSON 객체 |
| `trades_json` | 최근 거래 내역 | JSON 배열 |
| `security_json` | GoPlus 보안 분석 결과 | JSON 객체 |
| `user_profile_json` | 사용자 설정 (투자성향, 급여배분) | JSON 객체 |
| `feedback_level` | 피드백 강도 (0-4) | `3` |

### 4. SCORING CRITERIA (채점 기준)
```
- health_score 0-10:
  * 0-3: Critical issues, immediate action required
  * 4-5: Significant concerns, needs attention
  * 6-7: Moderate health, room for improvement
  * 8-10: Strong portfolio management
```
- **감점 요인**: 50% 이상 단일 토큰 집중, 미검증 토큰 20% 초과, 헤지 없는 고위험 토큰
- **가점 요인**: 자산군 분산, 스테이블코인 보유, 일관된 DCA 패턴

### 5. FEEDBACK INTENSITY (피드백 강도)

> **규칙**: 레벨이 낮을수록 약한 roast, 높을수록 강한 roast

| 레벨 | 이름 | 강도 | 설명 |
|------|------|------|------|
| 0 | Kind | 가장 약함 🌱 | 격려와 긍정에 집중, 매우 부드러운 제안 |
| 1 | Mild | 약함 🌿 | 친절하고 가벼운 건설적 비평 |
| 2 | Medium | 중간 ⚖️ | 균형 잡힌 직접적이고 솔직한 평가 |
| 3 | Spicy | 강함 🌶️ | 날카로운 관찰과 직설적 비판 |
| 4 | Hot | 가장 강함 🔥 | 거침없는 로스트 스타일, 현실 직시 |

### 6. SCHEMA (출력 형식)
```json
{
  "overallScore": 7.5,
  "evaluation": "분산 투자는 괜찮으나 밈코인 비중이 높습니다",
  "riskLevel": "MEDIUM",
  "tradingFrequency": "주 2-3회, 적당한 빈도",
  "investmentStyleMatch": "안정형 성향 대비 공격적 포트폴리오",
  "tradeEvaluations": [
    {
      "hash": "0xabc12345",
      "coin": "PEPE",
      "type": "buy",
      "evaluation": "bad",
      "comment": "고점 매수, 타이밍 최악"
    }
  ],
  "portfolioAdvice": "ETH 비중을 40%로 늘리고...",
  "riskWarnings": ["DOGE 45% 집중 위험"],
  "improvementSuggestions": ["주간 DCA로 전환 권장"]
}
```

### 7. SAMPLING 파라미터
```
- temperature: 0.3 (일관성 유지, 약간의 창의성 허용)
- top_p: 0.9 (다양한 표현 가능)
- top_k: 40 (적절한 어휘 범위)
- max_tokens: 1500 (충분한 분석 길이)
```

## 사용 예시

```typescript
import { buildWalletAnalysisPrompt } from '@/lib/promptLoader';

const prompt = buildWalletAnalysisPrompt({
  walletAddress: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
  chainKey: 'base',
  portfolio: {
    totalValueUsd: 15000,
    tokens: [
      { symbol: 'ETH', value: 8000, percentage: 53.3 },
      { symbol: 'USDC', value: 5000, percentage: 33.3 },
      { symbol: 'DEGEN', value: 2000, percentage: 13.3 }
    ]
  },
  trades: [
    { hash: '0xabc...', type: 'buy', coin: 'DEGEN', amount: 100 }
  ],
  security: {
    riskTokens: [],
    warnings: []
  },
  userProfile: {
    investmentStyle: 'conservative',
    livingExpenseRatio: 50,
    investmentRatio: 30
  },
  feedbackLevel: 2
});
```

## 주요 특징

### ✅ 장점
1. **사용자 맞춤형**: 투자 성향과 피드백 강도 반영
2. **정량적 평가**: 0-10점 척도로 명확한 점수화
3. **실행 가능한 조언**: 7일 내 실행 가능한 구체적 제안
4. **리스크 관리**: GoPlus 보안 데이터 기반 경고

### ⚠️ 주의사항
1. JSON 출력만 생성 (마크다운 펜스 없음)
2. 평가문은 200자 이내
3. 거래 평가는 최대 10개
4. 모든 제안은 측정 가능해야 함

## 관련 파일
- `lib/promptLoader.ts` - 프롬프트 템플릿
- `lib/moralis.ts` - API 호출 로직
- `app/api/wallet/analyze/route.ts` - API 라우트

