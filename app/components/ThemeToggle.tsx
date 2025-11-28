"use client";

import { useTheme } from "../hooks/useTheme";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  compact?: boolean;
}

export default function ThemeToggle({ compact = false }: ThemeToggleProps) {
  const { theme, toggleTheme, mounted } = useTheme();

  // 마운트되기 전에는 빈 상태 유지 (hydration 불일치 방지)
  if (!mounted) {
    return (
      <button
        className={`btn btn-ghost btn-circle btn-sm ${compact ? "btn-xs" : ""}`}
        disabled
      >
        <Sun className={compact ? "w-3 h-3" : "w-4 h-4"} />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className={`btn btn-ghost btn-circle btn-sm ${compact ? "btn-xs" : ""}`}
      aria-label={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
      title={theme === "light" ? "다크 모드로 전환" : "라이트 모드로 전환"}
    >
      {theme === "light" ? (
        <Moon className={compact ? "w-3 h-3" : "w-4 h-4"} />
      ) : (
        <Sun className={compact ? "w-3 h-3" : "w-4 h-4"} />
      )}
    </button>
  );
}

