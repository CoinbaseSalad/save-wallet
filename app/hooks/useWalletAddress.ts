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
  // 사용자가 명시적으로 로그아웃했는지 추적
  const [hasDisconnected, setHasDisconnected] = useState(false);

  const isBaseApp = !!context;

  // MiniKit 주소 가져오기 함수
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
          setHasDisconnected(false);
        }
      }
    } catch (error) {
      console.error("Failed to get MiniKit wallet address:", error);
    } finally {
      setIsMiniKitLoading(false);
    }
  };

  // 초기 로딩 시 MiniKit 주소 가져오기
  useEffect(() => {
    fetchMiniKitAddress();
  }, [isBaseApp]);

  // wagmi 연결 상태 변화 감지
  useEffect(() => {
    if (isMiniKitLoading) return;
    if (status === "connecting" || status === "reconnecting") return;

    // wagmi 연결이 끊겼을 때 → disconnect 처리
    if (!isWagmiConnected && miniKitAddress) {
      setHasDisconnected(true);
      setMiniKitAddress(null);
    }

    // wagmi가 다시 연결되었을 때 → MiniKit 주소 다시 가져오기
    if (isWagmiConnected && hasDisconnected && isBaseApp) {
      setHasDisconnected(false);
      fetchMiniKitAddress();
    }
  }, [isWagmiConnected, miniKitAddress, isMiniKitLoading, status, hasDisconnected, isBaseApp]);

  // Base 앱에서는 MiniKit 주소 우선, 아니면 wagmi 주소 사용
  const address = isBaseApp ? (miniKitAddress || wagmiAddress) : wagmiAddress;

  // 연결 상태 결정
  const isConnected = isBaseApp
    ? (!!miniKitAddress && !hasDisconnected)
    : isWagmiConnected;

  const isLoading = isMiniKitLoading || status === "connecting" || status === "reconnecting";

  return {
    address,
    isBaseApp,
    isConnected,
    isLoading,
  };
}
