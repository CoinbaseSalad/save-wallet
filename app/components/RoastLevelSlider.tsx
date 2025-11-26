"use client";

import { Flame } from "lucide-react";
import { ROAST_LEVELS } from "@/app/constants/settings";

interface RoastLevelSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export default function RoastLevelSlider({ value, onChange }: RoastLevelSliderProps) {
  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <Flame className="w-5 h-5 text-accent" />
          평가 스타일 (Roast 강도)
        </h2>

        {/* Roast 강도 Input - 그라데이션 적용 */}
        <div className="w-full mt-4">
          {/* 그라데이션 배경 바 */}
          <div className="relative">
            <div className="absolute inset-0 h-2 top-1/2 -translate-y-1/2 rounded-full bg-linear-to-r from-sky-400 via-amber-400 to-red-500 opacity-30" />
            <input
              type="range"
              min={0}
              max={4}
              value={value}
              onChange={(e) => onChange(Number(e.target.value))}
              className="range range-md relative z-10 w-full"
              step={1}
              style={{
                "--range-thumb": ROAST_LEVELS[value].thumbColor,
                "--range-fill": 0,
              } as React.CSSProperties}
            />
          </div>
          {/* 단계 표시 - 그라데이션 점 */}
          <div className="flex justify-between px-1 mt-2">
            {ROAST_LEVELS.map((level, idx) => (
              <div
                key={idx}
                className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${
                  idx === value
                    ? "scale-125 border-base-content shadow-lg"
                    : "border-transparent"
                }`}
                style={{
                  backgroundColor: level.thumbColor,
                  opacity: idx <= value ? 1 : 0.3,
                }}
              />
            ))}
          </div>
          {/* 라벨 표시 */}
          <div className="flex justify-between mt-2 text-[10px]">
            <span className="text-sky-500 font-medium">Kind 🤗</span>
            <span className="text-amber-500 font-medium">Medium</span>
            <span className="text-red-500 font-medium">Hot 🔥</span>
          </div>
        </div>

        {/* Roast 강도 설명 */}
        <div
          className="mt-4 p-4 rounded-lg bg-base-100 border-l-4"
          style={{ borderColor: ROAST_LEVELS[value].thumbColor }}
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">{ROAST_LEVELS[value].emoji}</span>
            <div>
              <div className="font-bold" style={{ color: ROAST_LEVELS[value].thumbColor }}>
                {ROAST_LEVELS[value].label} Roast
              </div>
              <p className="text-sm text-base-content/70 mt-1">
                {ROAST_LEVELS[value].description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

