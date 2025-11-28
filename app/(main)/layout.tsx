"use client";

import Header from "@/app/components/Header";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wallet, Search, Settings } from "lucide-react";
import { useTranslations } from "next-intl";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const t = useTranslations("nav");

  const navItems = [
    { href: "/home", label: t("home"), icon: Home },
    { href: "/asset", label: t("asset"), icon: Wallet },
    { href: "/search", label: t("search"), icon: Search },
    { href: "/setting", label: t("setting"), icon: Settings },
  ];

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
