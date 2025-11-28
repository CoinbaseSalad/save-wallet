const ROOT_URL =
  process.env.NEXT_PUBLIC_URL ||
  (process.env.CLOUDFLARE_PAGES_PRODUCTION_URL ? `https://${process.env.CLOUDFLARE_PAGES_PRODUCTION_URL}` : 'http://localhost:3000');

/**
 * MiniApp configuration object. Must follow the Farcaster MiniApp specification.
 *
 * @see {@link https://miniapps.farcaster.xyz/docs/guides/publishing}
 */
export const minikitConfig = {
  accountAssociation: {
    header: "",
    payload: "",
    signature: ""
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

