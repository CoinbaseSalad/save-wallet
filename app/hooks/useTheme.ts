"use client";

import { useState, useEffect, useCallback } from "react";

export type Theme = "light" | "night";

const THEME_STORAGE_KEY = "theme";

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>("light");
  const [mounted, setMounted] = useState(false);

  // 초기 테마 설정 (localStorage 또는 시스템 설정 기반)
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    let initialTheme: Theme;

    if (savedTheme) {
      initialTheme = savedTheme;
    } else {
      // 시스템 설정 확인
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      initialTheme = prefersDark ? "night" : "light";
    }

    setThemeState(initialTheme);
    document.documentElement.setAttribute("data-theme", initialTheme);
    // 브라우저 강제 다크모드 방지
    document.documentElement.style.colorScheme = initialTheme === "night" ? "dark" : "light";

    setMounted(true);
  }, []);

  // 테마 변경 함수
  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
    // 브라우저 강제 다크모드 방지
    document.documentElement.style.colorScheme = newTheme === "night" ? "dark" : "light";
  }, []);

  // 테마 토글 함수
  const toggleTheme = useCallback(() => {
    const newTheme = theme === "light" ? "night" : "light";
    setTheme(newTheme);
  }, [theme, setTheme]);

  return {
    theme,
    setTheme,
    toggleTheme,
    isDark: theme === "night",
    mounted,
  };
}

