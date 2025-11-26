"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield, TrendingUp, Flame, DollarSign, PiggyBank, Sparkles } from "lucide-react";

// 투자 성향 타입
const investmentStyles = [
  {
    label: "안정형",
    description: "원금 보존을 최우선으로 하며, 낮은 수익률도 감수합니다.",
    emoji: "🛡️",
    color: "text-success",
    thumbColor: "#22c55e", // success
  },
  {
    label: "안정추구형",
    description: "안정적인 수익을 추구하며, 소폭의 손실은 감수할 수 있습니다.",
    emoji: "🌿",
    color: "text-success",
    thumbColor: "#84cc16", // lime
  },
  {
    label: "위험중립형",
    description: "적정한 위험과 수익의 균형을 추구합니다.",
    emoji: "⚖️",
    color: "text-warning",
    thumbColor: "#f59e0b", // warning
  },
  {
    label: "적극투자형",
    description: "높은 수익을 위해 상당한 위험을 감수할 수 있습니다.",
    emoji: "🚀",
    color: "text-orange-500",
    thumbColor: "#f97316", // orange
  },
  {
    label: "공격투자형",
    description: "최대 수익을 위해 높은 변동성과 손실 위험을 감수합니다.",
    emoji: "🔥",
    color: "text-error",
    thumbColor: "#ef4444", // error
  },
];

// Roast 강도 타입
const roastLevels = [
  {
    label: "Kind",
    description: "부드럽고 격려하는 피드백을 제공합니다.",
    emoji: "😊",
    thumbColor: "#38bdf8", // sky
  },
  {
    label: "Mild",
    description: "친절하지만 솔직한 피드백을 제공합니다.",
    emoji: "🙂",
    thumbColor: "#22d3ee", // cyan
  },
  {
    label: "Medium",
    description: "균형 잡힌 현실적인 피드백을 제공합니다.",
    emoji: "😐",
    thumbColor: "#f59e0b", // warning
  },
  {
    label: "Spicy",
    description: "직설적이고 날카로운 피드백을 제공합니다.",
    emoji: "😤",
    thumbColor: "#f97316", // orange
  },
  {
    label: "Hot",
    description: "매우 직설적인 피드백으로 현실을 직시하게 합니다.",
    emoji: "🔥",
    thumbColor: "#ef4444", // error
  },
];

export default function OnboardPage() {
  const router = useRouter();
  const [investmentStyle, setInvestmentStyle] = useState(2); // 0-4
  const [livingExpenseRatio, setLivingExpenseRatio] = useState(60);
  const [investmentRatio, setInvestmentRatio] = useState(30);
  const [roastLevel, setRoastLevel] = useState(2); // 0-4
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 저축 비율 계산
  const savingsRatio = 100 - livingExpenseRatio - investmentRatio;

  // 제출 핸들러
  const handleSubmit = async () => {
    setIsSubmitting(true);
    // 실제로는 API 호출하여 데이터 저장
    await new Promise((resolve) => setTimeout(resolve, 1000));
    router.push("/home");
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" />
          프로필 설정
        </h1>
        <p className="text-sm text-base-content/60 mt-2">
          더 정확한 투자 평가를 위해 정보를 입력해주세요
        </p>
      </div>

      {/* 투자 성향 영역 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            투자 성향
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
                value={investmentStyle}
                onChange={(e) => setInvestmentStyle(Number(e.target.value))}
                className="range range-md relative z-10 w-full"
                step={1}
                style={{
                  "--range-thumb": investmentStyles[investmentStyle].thumbColor,
                  "--range-fill": 0,
                } as React.CSSProperties}
              />
            </div>
            {/* 단계 표시 - 그라데이션 점 */}
            <div className="flex justify-between px-1 mt-2">
              {investmentStyles.map((style, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${idx === investmentStyle
                    ? "scale-125 border-base-content shadow-lg"
                    : "border-transparent"
                    }`}
                  style={{
                    backgroundColor: style.thumbColor,
                    opacity: idx <= investmentStyle ? 1 : 0.3,
                  }}
                />
              ))}
            </div>
            {/* 라벨 표시 */}
            <div className="flex justify-between mt-2 text-[10px]">
              <span className="text-success font-medium">안정</span>
              <span className="text-warning font-medium">중립</span>
              <span className="text-error font-medium">공격</span>
            </div>
          </div>

          {/* 투자 성향 설명 */}
          <div
            className="mt-4 p-4 rounded-lg bg-base-100 transition-all border-l-4"
            style={{ borderColor: investmentStyles[investmentStyle].thumbColor }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{investmentStyles[investmentStyle].emoji}</span>
              <div>
                <div className={`font-bold ${investmentStyles[investmentStyle].color}`}>
                  {investmentStyles[investmentStyle].label}
                </div>
                <p className="text-sm text-base-content/70 mt-1">
                  {investmentStyles[investmentStyle].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 투자 금액 비율 설정 영역 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <DollarSign className="w-5 h-5 text-secondary" />
            급여 배분 비율
          </h2>

          {/* 비율 시각화 */}
          <div className="flex h-8 rounded-full overflow-hidden mt-4 shadow-inner">
            <div
              className="bg-linear-to-r from-amber-400 to-amber-500 transition-all duration-300 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${livingExpenseRatio}%` }}
            >
              {livingExpenseRatio > 15 && `${livingExpenseRatio}%`}
            </div>
            <div
              className="bg-linear-to-r from-blue-400 to-blue-500 transition-all duration-300 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${investmentRatio}%` }}
            >
              {investmentRatio > 15 && `${investmentRatio}%`}
            </div>
            <div
              className="bg-linear-to-r from-emerald-400 to-emerald-500 transition-all duration-300 flex items-center justify-center text-xs font-bold text-white"
              style={{ width: `${savingsRatio}%` }}
            >
              {savingsRatio > 15 && `${savingsRatio}%`}
            </div>
          </div>

          {/* 범례 */}
          <div className="flex justify-center gap-4 mt-3 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-amber-400 to-amber-500" />
              <span>생활비</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-400 to-blue-500" />
              <span>투자</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-linear-to-r from-emerald-400 to-emerald-500" />
              <span>저축</span>
            </div>
          </div>

          {/* 생활비 비율 */}
          <div className="form-control mt-4">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <PiggyBank className="w-4 h-4" />
                생활비 비율
              </span>
              <span className="label-text-alt font-bold text-amber-500">{livingExpenseRatio}%</span>
            </label>
            <input
              type="range"
              min={30}
              max={90}
              value={livingExpenseRatio}
              onChange={(e) => {
                const newValue = Number(e.target.value);
                setLivingExpenseRatio(newValue);
                // 투자 비율 자동 조정
                if (newValue + investmentRatio > 95) {
                  setInvestmentRatio(95 - newValue);
                }
              }}
              className="range range-sm w-full"
              step={5}
              style={{
                "--range-thumb": "#f59e0b",
              } as React.CSSProperties}
            />
          </div>

          {/* 투자 비율 */}
          <div className="form-control mt-2">
            <label className="label">
              <span className="label-text flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                투자 비율
              </span>
              <span className="label-text-alt font-bold text-blue-500">{investmentRatio}%</span>
            </label>
            <input
              type="range"
              min={5}
              max={Math.min(60, 95 - livingExpenseRatio)}
              value={investmentRatio}
              onChange={(e) => setInvestmentRatio(Number(e.target.value))}
              className="range range-sm w-full"
              step={5}
              style={{
                "--range-thumb": "#3b82f6",
              } as React.CSSProperties}
            />
          </div>

          {/* 저축 비율 표시 */}
          <div className="mt-3 p-3 bg-base-100 rounded-lg border-l-4 border-emerald-500">
            <div className="flex items-center justify-between text-sm">
              <span className="text-base-content/70">자동 저축 비율</span>
              <span className="font-bold text-emerald-500">{savingsRatio}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 평가 Roast 강도 영역 */}
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
                value={roastLevel}
                onChange={(e) => setRoastLevel(Number(e.target.value))}
                className="range range-md relative z-10 w-full"
                step={1}
                style={{
                  "--range-thumb": roastLevels[roastLevel].thumbColor,
                  "--range-fill": 0,
                } as React.CSSProperties}
              />
            </div>
            {/* 단계 표시 - 그라데이션 점 */}
            <div className="flex justify-between px-1 mt-2">
              {roastLevels.map((level, idx) => (
                <div
                  key={idx}
                  className={`w-4 h-4 rounded-full transition-all duration-300 border-2 ${idx === roastLevel
                    ? "scale-125 border-base-content shadow-lg"
                    : "border-transparent"
                    }`}
                  style={{
                    backgroundColor: level.thumbColor,
                    opacity: idx <= roastLevel ? 1 : 0.3,
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
            style={{ borderColor: roastLevels[roastLevel].thumbColor }}
          >
            <div className="flex items-center gap-3">
              <span className="text-3xl">{roastLevels[roastLevel].emoji}</span>
              <div>
                <div className="font-bold" style={{ color: roastLevels[roastLevel].thumbColor }}>
                  {roastLevels[roastLevel].label} Roast
                </div>
                <p className="text-sm text-base-content/70 mt-1">
                  {roastLevels[roastLevel].description}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 제출 버튼 */}
      <div className="pt-4 pb-8">
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <>
              <span className="loading loading-spinner"></span>
              설정 저장 중...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              설정 완료
            </>
          )}
        </button>
        <p className="text-center text-xs text-base-content/50 mt-3">
          설정은 프로필에서 언제든지 변경할 수 있습니다
        </p>
      </div>
    </div>
  );
}
