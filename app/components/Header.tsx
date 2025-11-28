"use client";

import { LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAccount, useDisconnect } from "wagmi";
import LanguageSelector from "./LanguageSelector";

export default function Header() {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();

  // 지갑 주소 축약 표시 (0x1234...5678 형식)
  const formatAddress = (addr: string | undefined) => {
    if (!addr) return "User";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const handleLogout = () => {
    // wagmi disconnect를 통해 지갑 연결 해제
    disconnect();
    // 홈으로 리다이렉트
    router.push("/");
  };

  return (
    <div className="flex justify-between items-center bg-transparent py-4 px-4">
      <div className="flex items-center gap-2">
        <Wallet className="w-4 h-4 text-green-500" />
        {/* 지갑 주소 표시 (축약형) */}
        <span className="text-sm">{formatAddress(address)}</span>
      </div>
      <div className="flex items-center gap-2">
        <LanguageSelector compact />
        <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
      </div>
    </div>
  );
}
