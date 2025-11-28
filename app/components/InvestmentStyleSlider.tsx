"use client";

import { Shield } from "lucide-react";
import { useTranslations } from "next-intl";
import { INVESTMENT_STYLES } from "@/app/constants/settings";

interface InvestmentStyleSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function InvestmentStyleSlider({ value, onChange }: InvestmentStyleSliderProps) {
  const t = useTranslations("investmentStyle");

  // 번역된 라벨과 설명
  const getLocalizedStyle = (index: number) => {
    const keys = ["stable", "conservative", "neutral", "active", "aggressive"];
    const key = keys[index];
    return {
      label: t(key),
      description: t(`${key}Description`),
    };
  };

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary" />
          {t("title")}
        </h2>

        {/* 투자 성향 Input - 그라데이션 적용 */}
        <div className="w-full mt-4">
          {/* 그라데이션 배경 바 */}
          <div className="relative">
            <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-success via-warning to-error opacity-30" />
            <input
              type="range"
              min={0}
              max={4}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="range range-md relative z-10 w-full"
              step={1}
              style={{
                "--range-thumb": INVESTMENT_STYLES[value].thumbColor,
                "--range-fill": 0,
              } as React.CSSProperties}
            />
          </div>
          {/* 단계 표시 - 그라데이션 점 */}
          <div className="flex justify-between px-1 mt-2">
            {INVESTMENT_STYLES.map((style, idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  idx === value
                    ? "scale-125 border-base-content shadow-lg"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor: style.thumbColor,
                  opacity: idx <= value ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          {/* 라벨 표시 */}
          <div className="flex justify-between mt-2 text-[10px]">
            <span className="text-success font-medium">{t("stableLabel")}</span>
            <span className="text-warning font-medium">{t("neutralLabel")}</span>
            <span className="text-error font-medium">{t("aggressiveLabel")}</span>
          </div>
        </div>

        {/* 투자 성향 설명 */}
        <div
          className="mt-4 p-4 rounded-lg bg-base-100 transition-all border-l-4"
          style={{ borderColor: INVESTMENT_STYLES[value].thumbColor }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{INVESTMENT_STYLES[value].emoji}</span>
            <div>
              <div className={`font-bold ${INVESTMENT_STYLES[value].color}`}>
                {getLocalizedStyle(value).label}
              </div>
              <p className="text-sm text-base-content/70 mt-1">
                {getLocalizedStyle(value).description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
