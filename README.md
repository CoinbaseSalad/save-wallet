# SaveWallet - AI 암호화폐 지갑 분석 미니앱

SaveWallet은 AI 기반의 암호화폐 지갑 분석 도구입니다. 사용자의 투자 성향에 맞춰 포트폴리오를 분석하고, 위험도 평가 및 투자 조언을 제공합니다.

🌐 **한국어** | [English](./README.en.md) | [中文](./README.zh.md) | [日本語](./README.ja.md)

---

## 목차

- [주요 기능](#주요-기능)
- [기술 스택](#기술-스택)
- [시작하기](#시작하기)
- [환경 변수 설정](#환경-변수-설정)
- [프로젝트 구조](#프로젝트-구조)
- [배포](#배포)
- [라이선스](#라이선스)

---

## 주요 기능

### 📊 지갑 건강도 분석

- AI 기반 종합 점수 (0-10점)
- 포트폴리오 위험도 평가
- 맞춤형 투자 조언 제공
- 위험 경고 알림

### 💰 자산 현황

- 보유 토큰 목록 및 가치
- 24시간 가격 변동 추적
- 토큰별 위험도 분석
- 포트폴리오 배분 시각화

### 🔍 지갑 검색

- 다른 지갑 주소 분석
- 투자 성향 및 패턴 파악
- 거래 내역 평가

### ⚙️ 개인화 설정

- **투자 성향**: 안정형 ~ 공격투자형 (5단계)
- **급여 배분 비율**: 생활비/투자/저축 비율 설정
- **평가 스타일 (Roast Level)**: Kind ~ Hot (5단계)
- **다국어 지원**: 한국어, 영어, 중국어, 일본어

### 🔐 지원 체인

- Base (메인)
- Ethereum
- Polygon
- Arbitrum

---

## 기술 스택

| 카테고리            | 기술                              |
| ------------------- | --------------------------------- |
| **프레임워크**      | Next.js 15, React 19, TypeScript  |
| **스타일링**        | Tailwind CSS 4, DaisyUI 5         |
| **지갑 연결**       | Wagmi 2, RainbowKit 2, OnchainKit |
| **블록체인 데이터** | Moralis API                       |
| **AI 분석**         | flock.io                          |
| **다국어**          | next-intl                         |
| **알림**            | Sonner                            |
| **배포**            | Vercel / Cloudflare Pages         |

---

## 시작하기

### 필수 조건

- Node.js 18+
- npm 또는 yarn
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API 키
- [Moralis](https://moralis.io/) API 키
- [flock.io](https://flock.io/) API 키 (선택)

### 설치

```bash
# 저장소 클론
git clone https://github.com/your-username/savewallet.git
cd savewallet

# 의존성 설치
npm install
```

### 로컬 실행

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

---

## 환경 변수 설정

`.env.local` 파일을 생성하고 다음 변수들을 설정하세요:

```bash
# 앱 설정
NEXT_PUBLIC_PROJECT_NAME="SaveWallet"
NEXT_PUBLIC_URL=http://localhost:3000

# Coinbase OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Moralis API
MORALIS_API_KEY=your_moralis_api_key

# flock.io AI API (선택)
FLOCK_API_KEY=your_flock_api_key

# 개발용 목업 모드 (true면 실제 API 호출 없이 목업 데이터 사용)
USE_MOCK_DATA=false
```

---

## 프로젝트 구조

```
├── app/
│   ├── (main)/              # 메인 레이아웃 그룹
│   │   ├── home/            # 홈 화면 (지갑 건강도)
│   │   ├── asset/           # 자산 현황
│   │   ├── search/          # 지갑 검색
│   │   ├── setting/         # 설정
│   │   └── onboard/         # 온보딩
│   ├── api/
│   │   ├── auth/            # 인증 API
│   │   └── wallet/
│   │       ├── analyze/     # 지갑 분석 API
│   │       └── assets/      # 자산 조회 API
│   ├── components/          # 공통 컴포넌트
│   ├── hooks/               # 커스텀 훅
│   └── utils/               # 유틸리티 함수
├── lib/
│   ├── moralis.ts           # Moralis API 래퍼
│   ├── promptLoader.ts      # AI 프롬프트 로더
│   └── prompts/             # AI 프롬프트 템플릿
├── messages/                # 다국어 번역 파일
│   ├── ko.json              # 한국어
│   ├── en.json              # 영어
│   ├── zh.json              # 중국어
│   └── ja.json              # 일본어
├── i18n/                    # 다국어 설정
└── public/                  # 정적 파일
```

---

## 배포

### Vercel 배포

```bash
# Vercel CLI 설치
npm i -g vercel

# 배포
vercel --prod
```

### Cloudflare Pages 배포

```bash
# 빌드
npm run pages:build

# 프리뷰
npm run pages:preview
```

### 환경 변수 업로드 (Vercel)

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
vercel env add MORALIS_API_KEY production
```

---

## Farcaster Mini App 설정

### 매니페스트 서명

1. [Farcaster Manifest 도구](https://farcaster.xyz/~/developers/mini-apps/manifest) 접속
2. 배포된 도메인 입력
3. `accountAssociation` 생성 후 `minikit.config.ts`에 추가

### 앱 미리보기

[base.dev/preview](https://base.dev/preview)에서 앱 검증

---

## 주의사항

> ⚠️ **면책조항**: 이 프로젝트는 해커톤 데모 목적으로 제작되었습니다. SaveWallet과 관련된 토큰이나 투자 상품은 존재하지 않습니다. 제공되는 분석 결과는 참고용이며, 실제 투자 결정의 근거로 사용해서는 안 됩니다.

---

## 라이선스

MIT License

---

## 기여 방법

1. 이 저장소를 Fork
2. 기능 브랜치 생성 (`git checkout -b feature/amazing-feature`)
3. 변경사항 커밋 (`git commit -m 'Add amazing feature'`)
4. 브랜치에 Push (`git push origin feature/amazing-feature`)
5. Pull Request 생성
