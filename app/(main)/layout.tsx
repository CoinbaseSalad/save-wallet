"use client";

import Header from "@/app/components/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Search, Settings } from "lucide-react";

const navItems = [
  { href: "/home", label: "Home", icon: Home },
  { href: "/asset", label: "Asset", icon: Wallet },
  { href: "/search", label: "Search", icon: Search },
  { href: "/setting", label: "Setting", icon: Settings },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex flex-col">
      {/* 모든 하위 페이지 최상단에 고정적으로 표시됨 */}
      <Header />
      <main className="flex-1 pb-20">
        {children}
      </main>

      {/* Bottom Tab Navigation - onboard 페이지에서는 숨김 */}
      {pathname !== "/onboard" && (
        <div className="dock dock-md">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={isActive ? "dock-active" : ""}
              >
                <Icon className="size-[1.2em]" />
                <span className="dock-label">{item.label}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
