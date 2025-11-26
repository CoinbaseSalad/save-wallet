## ✅ `lib/moralis.ts` 코드 정리 완료!

flock.io AI 분석에 필요한 모든 데이터를 포함하도록 코드가 업데이트되었습니다.

---

### 📁 파일 구조 (1,201줄)

```
lib/moralis.ts
├── [1-144]     Moralis 초기화 & 토큰 로고 헬퍼
├── [146-479]   Moralis API 호출 함수
├── [481-537]   위험도 분석 유틸리티 (로컬 폴백용)
├── [539-749]   GoPlus Security API 연동
│
├── [751-1062]  🆕 flock.io AI 연동 (확장됨)
│               ├── UserSettings 타입
│               ├── FlockAIAnalysisInput 타입 (상세)
│               ├── FlockAIAnalysisResult 타입
│               ├── buildFlockAIPrompt() - 상세 프롬프트 생성
│               ├── callFlockAI() - API 호출 함수
│               └── performWalletAnalysis() - 통합 분석 함수
│
└── [1064-1201] 타입 정의
```

---

### 🔧 flock.io AI에 전달되는 데이터

#### 1. 지갑 코인 현황 (Moralis)

```typescript
walletData: {
  totalValueUsd: number;           // 총 자산 가치
  portfolioCoins: PortfolioCoin[]; // 보유 코인 목록 (비중, 가격, 24h 변동)
  recentTransfers: TokenTransfer[]; // 최근 일주일 거래 내역
  nativeBalance: NativeBalance;    // 네이티브 토큰 잔고
  summary: WalletSummary;          // 요약 (토큰 수, 매수/매도 건수)
}
```

#### 2. 코인 위험 정보 (GoPlus)

```typescript
tokenSecurityData: Map<string, GoPlusTokenSecurity>;
// 각 토큰별: 허니팟 여부, 판매세, 보안점수, 위험 요소들
```

#### 3. 사용자 설정

```typescript
userSettings: {
  investmentStyle: number; // 0: 안정형 ~ 4: 공격투자형
  livingExpenseRatio: number; // 생활비 비율 (%)
  investmentRatio: number; // 투자 비율 (%)
  roastLevel: number; // 0: Kind ~ 4: Hot
}
```

---

### 📝 생성되는 AI 프롬프트 예시

```
═══════════════════════════════════════════
📊 지갑 정보
═══════════════════════════════════════════
- 지갑 주소: 0x1234...5678
- 체인: base
- 총 자산 가치: $12,500.00
- 보유 토큰 수: 5개
- 일주일간 거래: 매수 3건, 매도 2건

═══════════════════════════════════════════
💰 포트폴리오 현황
═══════════════════════════════════════════
  - ETH (Ethereum)
    · 비중: 45.2% | 가치: $5,650.00
    · 가격: $3,420.00 | 24h 변동: +2.3%
    · 보안점수: 95/100

  - USDC (USD Coin)
    · 비중: 30.0% | 가치: $3,750.00
    ...

═══════════════════════════════════════════
👤 사용자 프로필
═══════════════════════════════════════════
- 투자 성향: ⚖️ 위험중립형
- 월 급여 배분:
  · 생활비: 60%
  · 투자금: 30%
  · 저축: 10%
- 피드백 강도: 😐 Medium
```

---

### 🚀 통합 분석 함수 사용 예시

```typescript
import { performWalletAnalysis, UserSettings } from "@/lib/moralis";

const userSettings: UserSettings = {
  investmentStyle: 2, // 위험중립형
  livingExpenseRatio: 60, // 생활비 60%
  investmentRatio: 30, // 투자 30%
  roastLevel: 2, // Medium
};

const result = await performWalletAnalysis(
  "0x1234...5678",
  "base",
  userSettings
);

// result.walletData  - Moralis 지갑 데이터
// result.securityData - GoPlus 보안 데이터
// result.aiAnalysis   - flock.io AI 분석 결과
```

---

### 🔑 필요한 환경 변수

```bash
# .env.local
MORALIS_API_KEY=your_moralis_api_key
GOPLUS_API_KEY=your_goplus_api_key      # 선택사항
FLOCK_API_KEY=your_flock_api_key        # x-litellm-api-key 형식
```
