const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    "header": "eyJmaWQiOjE1NDA2MTEsInR5cGUiOiJjdXN0b2R5Iiwia2V5IjoiMHgwNjE3NEI5YWQ2QTg4MTAyQTNhM2E2MUI2MWE4OUU1NTA5OTUyM2IyIn0",
    "payload": "eyJkb21haW4iOiJzYXZlLXdhbGxldC52ZXJjZWwuYXBwIn0",
    "signature": "agyLVjfUovsvgks6lV1QQdGTuvd1lcdbiJl8uMlMZ2hcdYqWgw7fSI4UJL44Ge2aIquOY29NR3RkIeF8UHif9xs="
  },
  miniapp: {
    version: "1",
    name: "SaveWallet",
    subtitle: "Your AI Investment Assistant",
    description: "Investment",
    screenshotUrls: [`${ROOT_URL}/screenshot-portrait.png`],
    iconUrl: `${ROOT_URL}/save-wallet-icon.png`,
    splashImageUrl: `${ROOT_URL}/save-wallet-splash.png`,
    splashBackgroundColor: "#FFFFFF",
    homeUrl: ROOT_URL,
    webhookUrl: `${ROOT_URL}/api/webhook`,
    primaryCategory: "social",
    tags: ["marketing", "ads", "quickstart", "waitlist"],
    heroImageUrl: `${ROOT_URL}/save-wallet-hero.png`,
    tagline: "",
    ogTitle: "",
    ogDescription: "",
    ogImageUrl: `${ROOT_URL}/save-wallet-hero.png`,
  },
} as const;

