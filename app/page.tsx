"use client";
import { useState, useEffect } from "react";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect } from "wagmi";
import { useUserSettings } from "@/app/hooks/useUserSettings";
import { minikitConfig } from "../minikit.config";
import styles from "./page.module.css";
import { LogOut, Wallet } from "lucide-react";

interface AuthResponse {
  success: boolean;
  user?: {
    fid: number; // FID is the unique identifier for the user
    issuedAt?: number;
    expiresAt?: number;
  };
  message?: string; // Error messages come as 'message' not 'error'
}


export default function Home() {
  const { isFrameReady, setFrameReady, context } = useMiniKit();
  const [error, setError] = useState("");
  const router = useRouter();
  const { openConnectModal } = useConnectModal();
  const { isConnected, address } = useAccount();
  const { disconnect } = useDisconnect();

  // useUserSettings 훅 사용
  const { hasCompletedOnboarding, isLoading } = useUserSettings();

  const isBaseApp = !!context;

  // 지갑 주소 축약 표시 (0x1234...5678 형식)
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "Connecting...";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };


  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // 지갑 연결 후 자동 리다이렉트
  useEffect(() => {
    if (isConnected && !isLoading) {
      // 온보딩 완료 여부에 따라 분기
      if (hasCompletedOnboarding()) {
        router.push("/home");
      } else {
        router.push("/onboard");
      }
    }
  }, [isConnected, isLoading, hasCompletedOnboarding, router]);


  const handleLogout = () => {
    disconnect();
  };

  const handleConnectWallet = () => {
    setError("");

    // Base 앱이 아닌 경우 RainbowKit 모달 열기
    if (!isBaseApp) {
      if (openConnectModal) {
        openConnectModal();
      }
      return;
    }

    // Base 앱인 경우 기존 로직 사용
    router.push("/onboard");
  };

  return (
    <div className={styles.container}>
      {isBaseApp && (
        <div className="flex justify-end py-4 px-4">
          <div className="badge badge-outline badge-md flex text-center items-center gap-2">
            <Wallet className="w-4 h-4 text-green-500" />
            {formatAddress(address)}
            <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
          </div>
        </div>
      )}
      <div className={styles.content}>
        <div className="card card-xl w-96 bg-base-100 shadow-sm">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{minikitConfig.miniapp.name.toUpperCase()}</h2>
            {isBaseApp && (
              <div className="badge badge-outline badge-md flex text-center items-center gap-2">
                <Wallet className="w-4 h-4 text-green-500" />
                {formatAddress(address)}
              </div>
            )}
            <div className="text-center">
              여기에 설명 넣기
            </div>
            <div className="card-actions">
              <button
                type="button"
                onClick={handleConnectWallet}
                className="btn btn-primary mt-4">
                {isBaseApp ? "Connect Wallet" : "Connect Wallet with RainbowKit"}
              </button>
            </div>
            {error && <p className={styles.error}>{error}</p>}
            {!isBaseApp && (
              <p className="text-sm text-gray-500 mt-2">
                일반 브라우저에서 접속 중입니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
