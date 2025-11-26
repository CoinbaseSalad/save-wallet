import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base } from "wagmi/chains";
import { http } from "wagmi";

export const config = getDefaultConfig({
  appName: "Coinbase Salad",
  projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "demo",
  chains: [base],
  transports: {
    [base.id]: http(),
  },
  ssr: true,
});

