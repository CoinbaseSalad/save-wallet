"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Settings, Save, RotateCcw, LogOut, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { useUserSettings } from "@/app/hooks/useUserSettings";
import { useDisconnect } from "wagmi";
import InvestmentStyleSlider from "@/app/components/InvestmentStyleSlider";
import SalaryAllocationSlider from "@/app/components/SalaryAllocationSlider";
import RoastLevelSlider from "@/app/components/RoastLevelSlider";

// Toast 타입 정의
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  message: string;
  type: ToastType;
}

export default function SettingPage() {
  const router = useRouter();
  const resetModalRef = useRef<HTMLDialogElement>(null);
  const { disconnect } = useDisconnect();

  // useUserSettings 훅 사용
  const { settings, saveSettings, resetSettings, isLoading } = useUserSettings();

  // 로컬 상태
  const [investmentStyle, setInvestmentStyle] = useState(2);
  const [livingExpenseRatio, setLivingExpenseRatio] = useState(60);
  const [investmentRatio, setInvestmentRatio] = useState(30);
  const [roastLevel, setRoastLevel] = useState(2);
  const [isSaving, setIsSaving] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Toast 상태
  const [toast, setToast] = useState<Toast | null>(null);

  // Toast 표시 함수
  const showToast = (message: string, type: ToastType = 'success', duration = 3000) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), duration);
  };

  // LocalStorage에서 불러온 데이터로 상태 동기화
  useEffect(() => {
    if (settings) {
      setInvestmentStyle(settings.investment_style);
      setLivingExpenseRatio(settings.living_expense_ratio);
      setInvestmentRatio(settings.investment_ratio);
      setRoastLevel(settings.roast_level);
    }
  }, [settings]);

  // 변경 여부 확인
  const hasChanges = settings && (
    investmentStyle !== settings.investment_style ||
    livingExpenseRatio !== settings.living_expense_ratio ||
    investmentRatio !== settings.investment_ratio ||
    roastLevel !== settings.roast_level
  );

  // 저장 핸들러
  const handleSave = async () => {
    setIsSaving(true);

    const success = saveSettings({
      investment_style: investmentStyle,
      living_expense_ratio: livingExpenseRatio,
      investment_ratio: investmentRatio,
      roast_level: roastLevel,
    });

    setIsSaving(false);
    if (success) {
      showToast('설정이 저장되었습니다!', 'success');
    } else {
      showToast('설정 저장에 실패했습니다.', 'error');
    }
  };

  // 초기화 및 로그아웃 핸들러
  const handleReset = async () => {
    setIsResetting(true);
    resetSettings();
    disconnect();
    resetModalRef.current?.close();
    router.push("/");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 max-w-lg mx-auto">
      {/* Toast 컴포넌트 - 상단 중앙 */}
      {toast && (
        <div className="toast toast-top toast-center z-50">
          <div className={`alert ${toast.type === 'success' ? 'alert-success' :
              toast.type === 'error' ? 'alert-error' :
                toast.type === 'warning' ? 'alert-warning' :
                  'alert-info'
            }`}>
            {toast.type === 'success' && <CheckCircle className="w-5 h-5" />}
            {toast.type === 'error' && <XCircle className="w-5 h-5" />}
            {toast.type === 'warning' && <AlertTriangle className="w-5 h-5" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

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
            모든 설정과 데이터를 초기화하고 로그아웃합니다.
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
            모든 설정이 삭제됩니다.
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

      <div className="pb-8" />
    </div>
  );
}
