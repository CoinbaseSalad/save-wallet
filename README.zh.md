# SaveWallet - AI 加密钱包分析迷你应用

SaveWallet 是一款基于 AI 的加密货币钱包分析工具。根据您的投资偏好分析投资组合，并提供风险评估和投资建议。

🌐 [한국어](./README.md) | [English](./README.en.md) | **中文** | [日本語](./README.ja.md)

---

## 目录

- [主要功能](#主要功能)
- [技术栈](#技术栈)
- [快速开始](#快速开始)
- [环境变量](#环境变量)
- [项目结构](#项目结构)
- [部署](#部署)
- [许可证](#许可证)

---

## 主要功能

### 📊 钱包健康分析

- 基于 AI 的综合评分 (0-10)
- 投资组合风险评估
- 个性化投资建议
- 风险预警提醒

### 💰 资产概览

- 代币持有量及估值
- 24小时价格变动追踪
- 代币风险分析
- 投资组合分配可视化

### 🔍 钱包搜索

- 分析其他钱包地址
- 投资倾向和模式分析
- 交易历史评估

### ⚙️ 个性化设置

- **投资风格**: 稳健型 ~ 激进型 (5级)
- **薪资分配**: 生活费/投资/储蓄比例
- **评价风格 (Roast Level)**: Kind ~ Hot (5级)
- **多语言**: 韩语、英语、中文、日语

### 🔐 支持的链

- Base (主要)
- Ethereum
- Polygon
- Arbitrum

---

## 技术栈

| 类别         | 技术                              |
| ------------ | --------------------------------- |
| **框架**     | Next.js 15, React 19, TypeScript  |
| **样式**     | Tailwind CSS 4, DaisyUI 5         |
| **钱包连接** | Wagmi 2, RainbowKit 2, OnchainKit |
| **区块链数据** | Moralis API                     |
| **AI分析**   | flock.io                          |
| **国际化**   | next-intl                         |
| **通知**     | Sonner                            |
| **部署**     | Vercel / Cloudflare Pages         |

---

## 快速开始

### 前提条件

- Node.js 18+
- npm 或 yarn
- [Coinbase Developer Platform](https://portal.cdp.coinbase.com/) API 密钥
- [Moralis](https://moralis.io/) API 密钥
- [flock.io](https://flock.io/) API 密钥 (可选)

### 安装

```bash
# 克隆仓库
git clone https://github.com/your-username/savewallet.git
cd savewallet

# 安装依赖
npm install
```

### 本地运行

```bash
npm run dev
```

在浏览器中打开 `http://localhost:3000`

---

## 环境变量

创建 `.env.local` 文件并设置以下变量:

```bash
# 应用设置
NEXT_PUBLIC_PROJECT_NAME="SaveWallet"
NEXT_PUBLIC_URL=http://localhost:3000

# Coinbase OnchainKit
NEXT_PUBLIC_ONCHAINKIT_API_KEY=your_onchainkit_api_key

# Moralis API
MORALIS_API_KEY=your_moralis_api_key

# flock.io AI API (可选)
FLOCK_API_KEY=your_flock_api_key

# 开发模拟模式 (true = 使用模拟数据，不调用真实 API)
USE_MOCK_DATA=false
```

---

## 项目结构

```
├── app/
│   ├── (main)/              # 主布局组
│   │   ├── home/            # 首页 (钱包健康度)
│   │   ├── asset/           # 资产概览
│   │   ├── search/          # 钱包搜索
│   │   ├── setting/         # 设置
│   │   └── onboard/         # 引导页
│   ├── api/
│   │   ├── auth/            # 认证 API
│   │   └── wallet/
│   │       ├── analyze/     # 钱包分析 API
│   │       └── assets/      # 资产查询 API
│   ├── components/          # 公共组件
│   ├── hooks/               # 自定义 Hooks
│   └── utils/               # 工具函数
├── lib/
│   ├── moralis.ts           # Moralis API 封装
│   ├── promptLoader.ts      # AI 提示词加载器
│   └── prompts/             # AI 提示词模板
├── messages/                # 国际化翻译文件
│   ├── ko.json              # 韩语
│   ├── en.json              # 英语
│   ├── zh.json              # 中文
│   └── ja.json              # 日语
├── i18n/                    # 国际化配置
└── public/                  # 静态文件
```

---

## 部署

### Vercel 部署

```bash
# 安装 Vercel CLI
npm i -g vercel

# 部署
vercel --prod
```

### Cloudflare Pages 部署

```bash
# 构建
npm run pages:build

# 预览
npm run pages:preview
```

### 上传环境变量 (Vercel)

```bash
vercel env add NEXT_PUBLIC_PROJECT_NAME production
vercel env add NEXT_PUBLIC_ONCHAINKIT_API_KEY production
vercel env add NEXT_PUBLIC_URL production
vercel env add MORALIS_API_KEY production
```

---

## Farcaster Mini App 设置

### 清单签名

1. 访问 [Farcaster Manifest 工具](https://farcaster.xyz/~/developers/mini-apps/manifest)
2. 输入已部署的域名
3. 生成 `accountAssociation` 并添加到 `minikit.config.ts`

### 应用预览

在 [base.dev/preview](https://base.dev/preview) 验证您的应用

---

## 免责声明

> ⚠️ **免责声明**: 本项目是为黑客松演示目的而创建的。SaveWallet 不存在任何相关的代币或投资产品。提供的分析结果仅供参考，不应作为实际投资决策的依据。

---

## 许可证

MIT License

---

## 贡献

1. Fork 本仓库
2. 创建您的功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交您的更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开 Pull Request

