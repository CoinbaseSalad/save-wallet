# SaveWallet - AI Crypto Wallet Analysis Mini App

SaveWallet is an AI-powered cryptocurrency wallet analysis tool. It analyzes your portfolio based on your investment preferences and provides risk assessments and investment advice.

🌐 [한국어](./README.md) | **English** | [中文](./README.zh.md) | [日本語](./README.ja.md)

---

## Table of Contents

- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Deployment](#deployment)
- [License](#license)

---

## Key Features

### 📊 Wallet Health Analysis

- AI-based comprehensive score (0-10)
- Portfolio risk assessment
- Personalized investment advice
- Risk warning alerts

### 💰 Asset Overview

- Token holdings and valuations
- 24-hour price change tracking
- Per-token risk analysis
- Portfolio allocation visualization

### 🔍 Wallet Search

- Analyze other wallet addresses
- Investment tendency and pattern analysis
- Transaction history evaluation

### ⚙️ Personalization Settings

- **Investment Style**: Stable ~ Aggressive (5 levels)
- **Salary Allocation**: Living expenses/Investment/Savings ratio
- **Evaluation Style (Roast Level)**: Kind ~ Hot (5 levels)
- **Multi-language**: Korean, English, Chinese, Japanese

### 🔐 Supported Chains

- Base (Main)
- Ethereum
- Polygon
- Arbitrum

---

## Tech Stack

| Category            | Technology                        |
| ------------------- | --------------------------------- |
| **Framework**       | Next.js 15, React 19, TypeScript  |
| **Styling**         | Tailwind CSS 4, DaisyUI 5         |
| **Wallet Connect**  | Wagmi 2, RainbowKit 2, OnchainKit |
| **Blockchain Data** | Moralis API                       |
| **AI Analysis**     | flock.io                          |
| **i18n**            | next-intl                         |
| **Notifications**   | Sonner                            |
| **Deployment**      | Vercel / Cloudflare Pages         |

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API Key
- [Moralis](https://moralis.io/) API Key
- [flock.io](https://flock.io/) API Key (Optional)

### Installation

```bash
# Clone repository
git clone https://github.com/your-username/savewallet.git
cd savewallet

# Install dependencies
npm install
```

### Run Locally

```bash
npm run dev
```

Open `http://localhost:3000` in your browser

---

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# App Settings
NEXT_PUBLIC_PROJECT_NAME="SaveWallet"
NEXT_PUBLIC_URL=http://localhost:3000

# Coinbase OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Moralis API
MORALIS_API_KEY=your_moralis_api_key

# flock.io AI API (Optional)
FLOCK_API_KEY=your_flock_api_key

# Development Mock Mode (true = use mock data without real API calls)
USE_MOCK_DATA=false
```

---

## Project Structure

```
├── app/
│   ├── (main)/              # Main layout group
│   │   ├── home/            # Home screen (Wallet Health)
│   │   ├── asset/           # Asset Overview
│   │   ├── search/          # Wallet Search
│   │   ├── setting/         # Settings
│   │   └── onboard/         # Onboarding
│   ├── api/
│   │   ├── auth/            # Auth API
│   │   └── wallet/
│   │       ├── analyze/     # Wallet Analysis API
│   │       └── assets/      # Asset Query API
│   ├── components/          # Shared Components
│   ├── hooks/               # Custom Hooks
│   └── utils/               # Utility Functions
├── lib/
│   ├── moralis.ts           # Moralis API Wrapper
│   ├── promptLoader.ts      # AI Prompt Loader
│   └── prompts/             # AI Prompt Templates
├── messages/                # i18n Translation Files
│   ├── ko.json              # Korean
│   ├── en.json              # English
│   ├── zh.json              # Chinese
│   └── ja.json              # Japanese
├── i18n/                    # i18n Configuration
└── public/                  # Static Files
```

---

## Deployment

### Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Cloudflare Pages Deployment

```bash
# Build
npm run pages:build

# Preview
npm run pages:preview
```

### Upload Environment Variables (Vercel)

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
vercel env add MORALIS_API_KEY production
```

---

## Farcaster Mini App Setup

### Manifest Signing

1. Visit [Farcaster Manifest Tool](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. Enter your deployed domain
3. Generate `accountAssociation` and add to `minikit.config.ts`

### App Preview

Validate your app at [base.dev/preview](https://base.dev/preview)

---

## Disclaimer

> ⚠️ **Disclaimer**: This project was created for hackathon demo purposes. There are no tokens or investment products associated with SaveWallet. The analysis results provided are for reference only and should not be used as a basis for actual investment decisions.

---

## License

MIT License

---

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

