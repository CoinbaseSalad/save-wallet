"use client";

import { LogOut, Wallet, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAccount, useDisconnect } from "wagmi";
import LanguageSelector from "./LanguageSelector";
import ThemeToggle from "./ThemeToggle";

export default function Header() {
  const router = useRouter();
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  const [copied, setCopied] = useState(false);

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

  // 클릭/터치 시 주소 복사
  const handleCopyAddress = async () => {
    if (!address) return;
    try {
      await navigator.clipboard.writeText(address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy address:", err);
    }
  };

  return (
    <div className="flex justify-between items-center bg-transparent py-4 px-4">
      <div className="flex items-center gap-2 relative">
        <Wallet className="w-4 h-4 text-green-500" />
        {/* 지갑 주소 표시 - 클릭/터치 시 전체 주소 복사 */}
        <button
          onClick={handleCopyAddress}
          className="text-sm cursor-pointer hover:text-primary transition-colors flex items-center gap-1"
          title={address || "지갑 주소"}
        >
          {formatAddress(address)}
          {copied && <Check className="w-3 h-3 text-success" />}
        </button>

        {/* 복사 완료 토스트 */}
        {copied && (
          <div className="absolute left-0 top-full mt-2 z-50 animate-in fade-in-0 slide-in-from-top-2 duration-200">
            <div className="bg-success text-success-content text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
              주소가 복사되었습니다!
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-2">
        <ThemeToggle compact />
        <LanguageSelector compact />
        <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
      </div>
    </div>
  );
}
