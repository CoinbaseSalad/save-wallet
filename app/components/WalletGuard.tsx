"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAccount } from "wagmi";
import { toast } from "sonner";

// 지갑 연결 없이 접근 가능한 경로
const PUBLIC_PATHS = ["/", "/success"];

interface WalletGuardProps {
  children: React.ReactNode;
}

export default function WalletGuard({ children }: WalletGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isConnected, isConnecting, isReconnecting } = useAccount();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // 연결 중이거나 재연결 중(hydration)일 때는 체크하지 않음
    if (isConnecting || isReconnecting) {
      return;
    }

    // 공개 경로는 체크하지 않음
    if (PUBLIC_PATHS.includes(pathname)) {
      setIsChecking(false);
      return;
    }

    // 지갑이 연결되지 않은 경우
    if (!isConnected) {
      toast.error("지갑 연결이 필요합니다", {
        description: "서비스를 이용하려면 먼저 지갑을 연결해주세요.",
      });
      router.replace("/");
      return;
    }

    setIsChecking(false);
  }, [isConnected, isConnecting, isReconnecting, pathname, router]);

  // 연결 확인 중이거나 연결/재연결 중일 때 로딩 표시
  if (isChecking || isConnecting || isReconnecting) {
    // 공개 경로는 바로 렌더링
    if (PUBLIC_PATHS.includes(pathname)) {
      return <>{children}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
      </div>
    );
  }

  // 비공개 경로인데 연결되지 않은 경우 아무것도 렌더링하지 않음 (리다이렉트 중)
  if (!PUBLIC_PATHS.includes(pathname) && !isConnected) {
    return null;
  }

  return <>{children}</>;
}

