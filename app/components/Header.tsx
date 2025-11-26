"use client";

import { useMiniKit } from "@coinbase/onchainkit/minikit";
import { LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const { context } = useMiniKit();
  const router = useRouter();

  const handleLogout = () => {
    console.log("Logout");
    // 로그아웃 처리 로직 추가 (예: 토큰 삭제 등)
    router.push("/"); // 홈으로 리다이렉트
  };

  return (
    <div className="flex justify-between items-center bg-transparent py-4 px-4">
      <Wallet className="w-4 h-4 text-green-500" />
      {/* 실제 유저 정보가 없으면 test 표시, context에서 가져옴 */}
      {context?.user?.displayName || "User"}
      <LogOut className="w-4 h-4 cursor-pointer" onClick={handleLogout} />
    </div>
  );
}
