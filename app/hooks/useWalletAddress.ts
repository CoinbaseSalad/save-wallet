"use client";

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import sdk from "@farcaster/miniapp-sdk";

export function useWalletAddress() {
  const { context } = useMiniKit();
  const { address: wagmiAddress, isConnected } = useAccount();
  const [miniKitAddress, setMiniKitAddress] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isBaseApp = !!context;

  useEffect(() => {
    const fetchMiniKitAddress = async () => {
      if (!isBaseApp) {
        setIsLoading(false);
        return;
      }

      try {
        const provider = await sdk.wallet.getEthereumProvider();
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' });
          if (accounts && accounts.length > 0) {
            setMiniKitAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error("Failed to get MiniKit wallet address:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMiniKitAddress();
  }, [isBaseApp]);

  // Base 앱에서는 MiniKit 주소 우선, 아니면 wagmi 주소 사용
  const address = isBaseApp ? (miniKitAddress || wagmiAddress) : wagmiAddress;

  return {
    address,
    isBaseApp,
    isConnected: isBaseApp ? !!miniKitAddress : isConnected,
    isLoading,
  };
}
