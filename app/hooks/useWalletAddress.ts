"use client";

import { useEffect, useState } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useAccount } from "wagmi";
import sdk from "@farcaster/miniapp-sdk";

export function useWalletAddress() {
  const { context } = useMiniKit();
  const { address: wagmiAddress, isConnected: isWagmiConnected, status } = useAccount();
  const [miniKitAddress, setMiniKitAddress] = useState<string | null>(null);
  const [isMiniKitLoading, setIsMiniKitLoading] = useState(true);

  const isBaseApp = !!context;

  useEffect(() => {
    const fetchMiniKitAddress = async () => {
      if (!isBaseApp) {
        setIsMiniKitLoading(false);
        return;
      }

      try {
        const provider = await sdk.wallet.getEthereumProvider();
        if (provider) {
          const accounts = await provider.request({ method: 'eth_accounts' }) as string[];
          if (accounts && accounts.length > 0) {
            setMiniKitAddress(accounts[0]);
          }
        }
      } catch (error) {
        console.error("Failed to get MiniKit wallet address:", error);
      } finally {
        setIsMiniKitLoading(false);
      }
    };

    fetchMiniKitAddress();
  }, [isBaseApp]);

  // ✅ 핵심 수정: wagmi 연결이 끊기면 miniKitAddress도 초기화
  useEffect(() => {
    if (!isWagmiConnected && miniKitAddress) {
      setMiniKitAddress(null);
    }
  }, [isWagmiConnected, miniKitAddress]);

  // Base 앱에서는 MiniKit 주소 우선, 아니면 wagmi 주소 사용
  const address = isBaseApp ? (miniKitAddress || wagmiAddress) : wagmiAddress;

  // ✅ 핵심 수정: Base App에서도 wagmi 연결 상태를 함께 고려
  // miniKitAddress가 있더라도 wagmi가 disconnect되면 연결 해제로 간주
  const isConnected = isBaseApp
    ? (!!miniKitAddress && isWagmiConnected)
    : isWagmiConnected;

  // 로딩 상태: MiniKit 초기화 중이거나 Wagmi가 연결 시도 중일 때
  const isLoading = isMiniKitLoading || status === "connecting" || status === "reconnecting";

  return {
    address,
    isBaseApp,
    isConnected,
    isLoading,
  };
}
