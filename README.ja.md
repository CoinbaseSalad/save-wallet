# SaveWallet - AI 暗号ウォレット分析ミニアプリ

SaveWallet は、AI 搭載の暗号通貨ウォレット分析ツールです。投資傾向に基づいてポートフォリオを分析し、リスク評価と投資アドバイスを提供します。

🌐 [한국어](./README.md) | [English](./README.en.md) | [中文](./README.zh.md) | **日本語**

---

## 目次

- [主な機能](#主な機能)
- [技術スタック](#技術スタック)
- [始め方](#始め方)
- [環境変数](#環境変数)
- [プロジェクト構造](#プロジェクト構造)
- [デプロイ](#デプロイ)
- [ライセンス](#ライセンス)

---

## 主な機能

### 📊 ウォレットヘルス分析

- AI ベースの総合スコア (0-10)
- ポートフォリオリスク評価
- パーソナライズされた投資アドバイス
- リスク警告アラート

### 💰 資産概要

- トークン保有量と評価額
- 24時間価格変動追跡
- トークン別リスク分析
- ポートフォリオ配分の可視化

### 🔍 ウォレット検索

- 他のウォレットアドレスを分析
- 投資傾向とパターン分析
- 取引履歴評価

### ⚙️ パーソナライズ設定

- **投資スタイル**: 安定型 ～ 積極投資型 (5段階)
- **給与配分**: 生活費/投資/貯蓄の比率
- **評価スタイル (Roast Level)**: Kind ～ Hot (5段階)
- **多言語対応**: 韓国語、英語、中国語、日本語

### 🔐 対応チェーン

- Base (メイン)
- Ethereum
- Polygon
- Arbitrum

---

## 技術スタック

| カテゴリ             | 技術                              |
| -------------------- | --------------------------------- |
| **フレームワーク**   | Next.js 15, React 19, TypeScript  |
| **スタイリング**     | Tailwind CSS 4, DaisyUI 5         |
| **ウォレット接続**   | Wagmi 2, RainbowKit 2, OnchainKit |
| **ブロックチェーンデータ** | Moralis API                 |
| **AI 分析**          | flock.io                          |
| **i18n**             | next-intl                         |
| **通知**             | Sonner                            |
| **デプロイ**         | Vercel / Cloudflare Pages         |

---

## 始め方

### 前提条件

- Node.js 18+
- npm または yarn
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API キー
- [Moralis](https://moralis.io/) API キー
- [flock.io](https://flock.io/) API キー (オプション)

### インストール

```bash
# リポジトリをクローン
git clone https://github.com/your-username/savewallet.git
cd savewallet

# 依存関係をインストール
npm install
```

### ローカル実行

```bash
npm run dev
```

ブラウザで `http://localhost:3000` を開く

---

## 環境変数

`.env.local` ファイルを作成し、以下の変数を設定してください:

```bash
# アプリ設定
NEXT_PUBLIC_PROJECT_NAME="SaveWallet"
NEXT_PUBLIC_URL=http://localhost:3000

# Coinbase OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Moralis API
MORALIS_API_KEY=your_moralis_api_key

# flock.io AI API (オプション)
FLOCK_API_KEY=your_flock_api_key

# 開発用モックモード (true = 実際の API 呼び出しなしでモックデータを使用)
USE_MOCK_DATA=false
```

---

## プロジェクト構造

```
├── app/
│   ├── (main)/              # メインレイアウトグループ
│   │   ├── home/            # ホーム画面 (ウォレットヘルス)
│   │   ├── asset/           # 資産概要
│   │   ├── search/          # ウォレット検索
│   │   ├── setting/         # 設定
│   │   └── onboard/         # オンボーディング
│   ├── api/
│   │   ├── auth/            # 認証 API
│   │   └── wallet/
│   │       ├── analyze/     # ウォレット分析 API
│   │       └── assets/      # 資産照会 API
│   ├── components/          # 共通コンポーネント
│   ├── hooks/               # カスタムフック
│   └── utils/               # ユーティリティ関数
├── lib/
│   ├── moralis.ts           # Moralis API ラッパー
│   ├── promptLoader.ts      # AI プロンプトローダー
│   └── prompts/             # AI プロンプトテンプレート
├── messages/                # i18n 翻訳ファイル
│   ├── ko.json              # 韓国語
│   ├── en.json              # 英語
│   ├── zh.json              # 中国語
│   └── ja.json              # 日本語
├── i18n/                    # i18n 設定
└── public/                  # 静的ファイル
```

---

## デプロイ

### Vercel デプロイ

```bash
# Vercel CLI をインストール
npm i -g vercel

# デプロイ
vercel --prod
```

### Cloudflare Pages デプロイ

```bash
# ビルド
npm run pages:build

# プレビュー
npm run pages:preview
```

### 環境変数のアップロード (Vercel)

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
vercel env add MORALIS_API_KEY production
```

---

## Farcaster Mini App 設定

### マニフェスト署名

1. [Farcaster Manifest ツール](https://farcaster.xyz/~/developers/mini-apps/manifest)にアクセス
2. デプロイされたドメインを入力
3. `accountAssociation` を生成し、`minikit.config.ts` に追加

### アプリプレビュー

[base.dev/preview](https://base.dev/preview) でアプリを検証

---

## 免責事項

> ⚠️ **免責事項**: このプロジェクトはハッカソンのデモ目的で作成されました。SaveWallet に関連するトークンや投資商品は存在しません。提供される分析結果は参考情報であり、実際の投資判断の根拠として使用すべきではありません。

---

## ライセンス

MIT License

---

## コントリビュート

1. このリポジトリを Fork
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. Pull Request を作成

