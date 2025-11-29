"use client";
import { useEffect } from "react";
import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { useRouter } from "next/navigation";
import { useDisconnect } from "wagmi";
import { useUserSettings } from "@/app/hooks/useUserSettings";
import { minikitConfig } from "../minikit.config";
import { LogOut, Wallet as WalletIcon } from "lucide-react";
import { useWalletAddress } from "@/app/hooks/useWalletAddress";
import {
  ConnectWallet,
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from "@coinbase/onchainkit/wallet";
import {
  Address,
  Avatar,
  Name,
  Identity,
} from "@coinbase/onchainkit/identity";

export default function Home() {
  const { isFrameReady, setFrameReady } = useMiniKit();
  const { address, isBaseApp, isConnected, isLoading } = useWalletAddress();
  const router = useRouter();
  const { disconnect } = useDisconnect();

  // useUserSettings 훅 사용
  const { hasCompletedOnboarding } = useUserSettings();

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
    if (isConnected && !isLoading && !isBaseApp) {
      // 온보딩 완료 여부에 따라 분기
      if (hasCompletedOnboarding()) {
        router.push("/home");
      } else {
        router.push("/onboard");
      }
    }
  }, [isConnected, isLoading, hasCompletedOnboarding, router]);

  // 초기 로딩 상태 처리 추가
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-base-100">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  const handleLogout = () => {
    disconnect();
  };

  return (
    <div className="flex flex-col min-h-screen">
      {isBaseApp && (
        <div className="flex justify-end py-4 px-4">
          <div className="badge badge-outline badge-md flex text-center items-center gap-2">
            <WalletIcon className="w-4 h-4 text-green-500" />
            {isLoading ? "Not Connected" : formatAddress(address)}
            <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
          </div>
        </div>
      )}
      <div className="flex flex-col items-center justify-center flex-1 p-8">
        <div className="card card-border card-xl w-96 bg-base-100 shadow-md">
          <div className="card-body items-center text-center">
            <h2 className="card-title">
              {minikitConfig.miniapp.name.toUpperCase()}
            </h2>
            {isBaseApp && (
              <div className="badge badge-outline badge-md flex text-center items-center gap-2">
                <WalletIcon className="w-4 h-4 text-green-500" />
                {isLoading ? "Not Connected" : formatAddress(address)}
              </div>
            )}
            <p className="text-base-content/70 text-sm leading-relaxed">
              AI 기반 암호화폐 지갑 분석 도구
            </p>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              <span className="badge badge-outline badge-sm">📊 건강도 분석</span>
              <span className="badge badge-outline badge-sm">💰 자산 현황</span>
              <span className="badge badge-outline badge-sm">🎯 맞춤 조언</span>
            </div>
            <div className="card-actions flex justify-center mt-4 w-full">
              {/* 
                  Base App 환경 로직:
                  1. 연결됨 -> "Save My Wallet" 버튼 (다음 페이지 이동)
                  2. 연결 안됨 -> Wallet 컴포넌트 (연결 시도)
               */}
              {isBaseApp && isConnected ? (
                <button
                  type="button"
                  onClick={() => {
                    if (hasCompletedOnboarding()) {
                      router.push("/home");
                    } else {
                      router.push("/onboard");
                    }
                  }}
                  className="btn btn-primary"
                >
                  Save My Wallet
                </button>
              ) : (
                // Base App에서 연결이 안 되었거나, 일반 브라우저인 경우
                <Wallet>
                  <ConnectWallet className="bg-blue-800">
                    <Avatar className="h-6 w-6" />
                    <Name className="text-base-content font-bold" />
                  </ConnectWallet>
                  <WalletDropdown>
                    <Identity className="px-4 pt-3 pb-2 hover:bg-blue-200" hasCopyAddressOnClick>
                      <Avatar />
                      <Name />
                      <Address />
                    </Identity>
                    <WalletDropdownLink
                      className='hover:bg-blue-200'
                      icon="wallet"
                      href="https://keys.coinbase.com"
                    >
                      Wallet
                    </WalletDropdownLink>
                    <WalletDropdownDisconnect className='hover:bg-blue-200' />
                  </WalletDropdown>
                </Wallet>
              )}
            </div>
            {!isBaseApp && (
              <p className="text-sm text-base-content/50 mt-2">
                일반 브라우저에서 접속 중입니다
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
