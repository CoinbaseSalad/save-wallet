"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Shield, TrendingUp, Flame, DollarSign, PiggyBank, Settings, Save, RotateCcw, LogOut, AlertTriangle } from "lucide-react";

// 투자 성향 타입
const investmentStyles = [
  {
    label: "안정형",
    description: "원금 보존을 최우선으로 하며, 낮은 수익률도 감수합니다.",
    emoji: "🛡️",
    color: "text-success",
    thumbColor: "#22c55e",
  },
  {
    label: "안정추구형",
    description: "안정적인 수익을 추구하며, 소폭의 손실은 감수할 수 있습니다.",
    emoji: "🌿",
    color: "text-success",
    thumbColor: "#84cc16",
  },
  {
    label: "위험중립형",
    description: "적정한 위험과 수익의 균형을 추구합니다.",
    emoji: "⚖️",
    color: "text-warning",
    thumbColor: "#f59e0b",
  },
  {
    label: "적극투자형",
    description: "높은 수익을 위해 상당한 위험을 감수할 수 있습니다.",
    emoji: "🚀",
    color: "text-orange-500",
    thumbColor: "#f97316",
  },
  {
    label: "공격투자형",
    description: "최대 수익을 위해 높은 변동성과 손실 위험을 감수합니다.",
    emoji: "🔥",
    color: "text-error",
    thumbColor: "#ef4444",
  },
];

// Roast 강도 타입
const roastLevels = [
  {
    label: "Kind",
    description: "부드럽고 격려하는 피드백을 제공합니다.",
    emoji: "😊",
    thumbColor: "#38bdf8",
  },
  {
    label: "Mild",
    description: "친절하지만 솔직한 피드백을 제공합니다.",
    emoji: "🙂",
    thumbColor: "#22d3ee",
  },
  {
    label: "Medium",
    description: "균형 잡힌 현실적인 피드백을 제공합니다.",
    emoji: "😐",
    thumbColor: "#f59e0b",
  },
  {
    label: "Spicy",
    description: "직설적이고 날카로운 피드백을 제공합니다.",
    emoji: "😤",
    thumbColor: "#f97316",
  },
  {
    label: "Hot",
    description: "매우 직설적인 피드백으로 현실을 직시하게 합니다.",
    emoji: "🔥",
    thumbColor: "#ef4444",
  },
];

// 초기 설정값 (실제로는 저장소에서 불러옴)
const defaultSettings = {
  investmentStyle: 2,
  livingExpenseRatio: 60,
  investmentRatio: 30,
  roastLevel: 2,
};

export default function SettingPage() {
  const router = useRouter();
  const resetModalRef = useRef<HTMLDialogElement>(null);

  // 저장된 설정값 불러오기 (실제로는 localStorage/API에서)
  const [investmentStyle, setInvestmentStyle] = useState(defaultSettings.investmentStyle);
  const [livingExpenseRatio, setLivingExpenseRatio] = useState(defaultSettings.livingExpenseRatio);
  const [investmentRatio, setInvestmentRatio] = useState(defaultSettings.investmentRatio);
  const [roastLevel, setRoastLevel] = useState(defaultSettings.roastLevel);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // 저축 비율 계산
  const savingsRatio = 100 - livingExpenseRatio - investmentRatio;

  // 변경 여부 확인
  const hasChanges =
    investmentStyle !== defaultSettings.investmentStyle ||
    livingExpenseRatio !== defaultSettings.livingExpenseRatio ||
    investmentRatio !== defaultSettings.investmentRatio ||
    roastLevel !== defaultSettings.roastLevel;

  // 저장 핸들러
  const handleSave = async () => {
    setIsSaving(true);
    // 실제로는 API 호출하여 데이터 저장
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaveSuccess(true);
    setTimeout(() => setShowSaveSuccess(false), 3000);
  };

  // 초기화 및 로그아웃 핸들러
  const handleReset = async () => {
    setIsResetting(true);
    // 실제로는 API 호출하여 데이터 초기화 및 로그아웃
    await new Promise((resolve) => setTimeout(resolve, 1500));
    resetModalRef.current?.close();
    router.push("/");
  };

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      {/* 헤더 */}
      <div className="text-center py-4">
        <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Settings className="w-6 h-6 text-primary" />
          설정
        </h1>
        <p className="text-sm text-base-content/60 mt-2">
          투자 평가에 사용되는 설정을 변경할 수 있습니다
        </p>
      </div>

      {/* 저장 성공 알림 */}
      {showSaveSuccess && (
        <div className="alert alert-success">
          <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>설정이 저장되었습니다!</span>
        </div>
      )}

      {/* 투자 성향 영역 */}
      <div className="card bg-base-200 shadow-lg">
        <div className="card-body">
          <h2 className="card-title text-lg flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            투자 성향
          </h2>

          {/* 투자 성향 Input */}
          <div className="w-full mt-4">
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

          {/* Roast 강도 Input */}
          <div className="w-full mt-4">
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

      {/* 저장 버튼 */}
      <div className="pt-2">
        <button
          className="btn btn-primary btn-block btn-lg"
          onClick={handleSave}
          disabled={isSaving || !hasChanges}
        >
          {isSaving ? (
            <>
              <span className="loading loading-spinner"></span>
              저장 중...
            </>
          ) : (
            <>
              <Save className="w-5 h-5" />
              변경사항 저장
            </>
          )}
        </button>
      </div>

      {/* 구분선 */}
      <div className="divider text-base-content/40">위험 영역</div>

      {/* 초기화 버튼 */}
      <div className="card bg-error/10 border border-error/30">
        <div className="card-body">
          <h3 className="font-bold text-error flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            계정 초기화
          </h3>
          <p className="text-sm text-base-content/70">
            모든 설정과 데이터를 초기화하고 로그아웃합니다. 이 작업은 되돌릴 수 없습니다.
          </p>
          <div className="card-actions justify-end mt-2">
            <button
              className="btn btn-error btn-outline"
              onClick={() => resetModalRef.current?.showModal()}
            >
              <RotateCcw className="w-4 h-4" />
              초기화 및 로그아웃
            </button>
          </div>
        </div>
      </div>

      {/* 초기화 확인 모달 */}
      <dialog ref={resetModalRef} className="modal modal-bottom sm:modal-middle">
        <div className="modal-box">
          <h3 className="font-bold text-lg text-error flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            정말 초기화하시겠습니까?
          </h3>
          <p className="py-4 text-base-content/70">
            모든 설정과 저장된 데이터가 삭제됩니다.
            <br />
            이 작업은 <strong className="text-error">되돌릴 수 없습니다.</strong>
          </p>
          <div className="modal-action">
            <form method="dialog">
              <button className="btn btn-ghost">취소</button>
            </form>
            <button
              className="btn btn-error"
              onClick={handleReset}
              disabled={isResetting}
            >
              {isResetting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  초기화 중...
                </>
              ) : (
                <>
                  <LogOut className="w-4 h-4" />
                  초기화 및 로그아웃
                </>
              )}
            </button>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>

      {/* 하단 여백 */}
      <div className="pb-8" />
    </div>
  );
}
