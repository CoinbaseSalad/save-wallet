"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, RotateCcw, LogOut, AlertTriangle } from "lucide-react";
import { DEFAULT_SETTINGS } from "@/app/constants/settings";
import InvestmentStyleSlider from "@/app/components/InvestmentStyleSlider";
import SalaryAllocationSlider from "@/app/components/SalaryAllocationSlider";
import RoastLevelSlider from "@/app/components/RoastLevelSlider";

export default function SettingPage() {
  const router = useRouter();
  const resetModalRef = useRef<HTMLDialogElement>(null);

  // 저장된 설정값 불러오기 (실제로는 localStorage/API에서)
  const [investmentStyle, setInvestmentStyle] = useState(DEFAULT_SETTINGS.investmentStyle);
  const [livingExpenseRatio, setLivingExpenseRatio] = useState(DEFAULT_SETTINGS.livingExpenseRatio);
  const [investmentRatio, setInvestmentRatio] = useState(DEFAULT_SETTINGS.investmentRatio);
  const [roastLevel, setRoastLevel] = useState(DEFAULT_SETTINGS.roastLevel);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [showSaveSuccess, setShowSaveSuccess] = useState(false);

  // 변경 여부 확인
  const hasChanges =
    investmentStyle !== DEFAULT_SETTINGS.investmentStyle ||
    livingExpenseRatio !== DEFAULT_SETTINGS.livingExpenseRatio ||
    investmentRatio !== DEFAULT_SETTINGS.investmentRatio ||
    roastLevel !== DEFAULT_SETTINGS.roastLevel;

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
      <InvestmentStyleSlider
        value={investmentStyle}
        onChange={setInvestmentStyle}
      />

      {/* 투자 금액 비율 설정 영역 */}
      <SalaryAllocationSlider
        livingExpenseRatio={livingExpenseRatio}
        investmentRatio={investmentRatio}
        onLivingExpenseChange={setLivingExpenseRatio}
        onInvestmentChange={setInvestmentRatio}
      />

      {/* 평가 Roast 강도 영역 */}
      <RoastLevelSlider
        value={roastLevel}
        onChange={setRoastLevel}
      />

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
