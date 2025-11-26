'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAccount } from 'wagmi';
import { DEFAULT_SETTINGS } from '@/app/constants/settings';

export interface UserSettings {
  investment_style: number;
  living_expense_ratio: number;
  investment_ratio: number;
  roast_level: number;
}

const STORAGE_KEY_PREFIX = 'savewallet_settings_';

function getStorageKey(address: string): string {
  return `${STORAGE_KEY_PREFIX}${address.toLowerCase()}`;
}

export function useUserSettings() {
  const { address, isConnected } = useAccount();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // LocalStorage에서 설정 불러오기
  const loadSettings = useCallback(() => {
    if (!address) {
      setSettings(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const key = getStorageKey(address);
      const stored = localStorage.getItem(key);

      if (stored) {
        setSettings(JSON.parse(stored));
      } else {
        // 저장된 설정이 없으면 기본값 사용
        const defaultSettings: UserSettings = {
          investment_style: DEFAULT_SETTINGS.investmentStyle,
          living_expense_ratio: DEFAULT_SETTINGS.livingExpenseRatio,
          investment_ratio: DEFAULT_SETTINGS.investmentRatio,
          roast_level: DEFAULT_SETTINGS.roastLevel,
        };
        setSettings(defaultSettings);
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setSettings(null);
    } finally {
      setIsLoading(false);
    }
  }, [address]);

  // 지갑 연결 상태 변경 시 설정 로드
  useEffect(() => {
    loadSettings();
  }, [loadSettings]);

  // 설정 저장
  const saveSettings = useCallback((newSettings: Partial<UserSettings>): boolean => {
    if (!address) return false;

    try {
      const key = getStorageKey(address);
      const updatedSettings = {
        ...settings,
        ...newSettings,
      } as UserSettings;

      localStorage.setItem(key, JSON.stringify(updatedSettings));
      setSettings(updatedSettings);
      return true;
    } catch (error) {
      console.error('Failed to save settings:', error);
      return false;
    }
  }, [address, settings]);

  // 설정 초기화 (삭제)
  const resetSettings = useCallback((): boolean => {
    if (!address) return false;

    try {
      const key = getStorageKey(address);
      localStorage.removeItem(key);
      setSettings(null);
      return true;
    } catch (error) {
      console.error('Failed to reset settings:', error);
      return false;
    }
  }, [address]);

  // 저장된 설정이 있는지 확인 (온보딩 완료 여부)
  const hasCompletedOnboarding = useCallback((): boolean => {
    if (!address) return false;

    try {
      const key = getStorageKey(address);
      return localStorage.getItem(key) !== null;
    } catch {
      return false;
    }
  }, [address]);

  return {
    settings,
    isLoading,
    isConnected,
    walletAddress: address,
    saveSettings,
    resetSettings,
    hasCompletedOnboarding,
    reload: loadSettings,
  };
}
