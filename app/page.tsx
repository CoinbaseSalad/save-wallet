"use client";
import { useState, useEffect } from "react";
import { useQuickAuth, useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { useConnectModal } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
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

  // RainbowKit hooks
  const { openConnectModal } = useConnectModal();
  const { isConnected } = useAccount();

  // Base 앱 환경인지 확인 (context가 있으면 Base 앱)
  const isBaseApp = !!context;

  // Initialize the  miniapp
  useEffect(() => {
    if (!isFrameReady) {
      setFrameReady();
    }
  }, [setFrameReady, isFrameReady]);

  // 지갑이 연결되면 onboard 페이지로 이동
  useEffect(() => {
    if (isConnected && !isBaseApp) {
      router.push("/onboard");
    }
  }, [isConnected, isBaseApp, router]);

  // If you need to verify the user's identity, you can use the useQuickAuth hook.
  // This hook will verify the user's signature and return the user's FID. You can update
  // this to meet your needs. See the /app/api/auth/route.ts file for more details.
  // Note: If you don't need to verify the user's identity, you can get their FID and other user data
  // via `context.user.fid`.
  // const { data, isLoading, error } = useQuickAuth<{
  //   userFid: string;
  // }>("/api/auth");

  const { data: authData, isLoading: isAuthLoading, error: authError } = useQuickAuth<AuthResponse>(
    "/api/auth",
    { method: "GET" }
  );

  const handleLogout = () => {
    console.log("Logout");
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
      <div className="flex justify-end py-4 px-4">
        <div className="badge badge-outline badge-md flex text-center items-center gap-2">
          <Wallet className="w-4 h-4 text-green-500" />
          {context?.user?.displayName || "Guest"}
          <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
        </div>
      </div>
      <div className={styles.content}>
        <div className="card card-xl w-96 bg-base-100 shadow-sm">
          <div className="card-body items-center text-center">
            <h2 className="card-title">{minikitConfig.miniapp.name.toUpperCase()}</h2>
            <div className="badge badge-outline badge-md flex text-center items-center gap-2">
              <Wallet className="w-4 h-4 text-green-500" />
              {context?.user?.displayName || "Guest"}
            </div>
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
