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

  // MiniKit 주소 가져오기
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
            setHasDisconnected(false); // 연결되면 disconnect 플래그 해제
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

  // wagmi 연결이 끊기면 disconnect 상태로 전환 (MiniKit 로딩 완료 후에만)
  useEffect(() => {
    // MiniKit 로딩 중에는 무시 (초기 상태 판단 방지)
    if (isMiniKitLoading) return;

    // wagmi가 연결 시도 중이면 무시
    if (status === "connecting" || status === "reconnecting") return;

    // wagmi 연결이 끊겼고, 이전에 miniKitAddress가 있었다면 disconnect로 간주
    if (!isWagmiConnected && miniKitAddress) {
      setHasDisconnected(true);
      setMiniKitAddress(null);
    }

    // wagmi가 다시 연결되면 disconnect 플래그 해제
    if (isWagmiConnected && hasDisconnected) {
      setHasDisconnected(false);
    }
  }, [isWagmiConnected, miniKitAddress, isMiniKitLoading, status, hasDisconnected]);

  // Base 앱에서는 MiniKit 주소 우선, 아니면 wagmi 주소 사용
  const address = isBaseApp ? (miniKitAddress || wagmiAddress) : wagmiAddress;

  // 연결 상태 결정
  // Base App: miniKitAddress가 있고, 명시적으로 disconnect하지 않은 경우
  // 일반 브라우저: wagmi 연결 상태
  const isConnected = isBaseApp
    ? (!!miniKitAddress && !hasDisconnected)
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
