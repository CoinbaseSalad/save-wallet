"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";
import { DEFAULT_SETTINGS } from "@/app/constants/settings";
import { useUserSettings } from "@/app/hooks/useUserSettings";
import InvestmentStyleSlider from "@/app/components/InvestmentStyleSlider";
import SalaryAllocationSlider from "@/app/components/SalaryAllocationSlider";
import RoastLevelSlider from "@/app/components/RoastLevelSlider";

export default function OnboardPage() {
  const router = useRouter();
  const { saveSettings } = useUserSettings();

  const [investmentStyle, setInvestmentStyle] = useState(DEFAULT_SETTINGS.investmentStyle);
  const [livingExpenseRatio, setLivingExpenseRatio] = useState(DEFAULT_SETTINGS.livingExpenseRatio);
  const [investmentRatio, setInvestmentRatio] = useState(DEFAULT_SETTINGS.investmentRatio);
  const [roastLevel, setRoastLevel] = useState(DEFAULT_SETTINGS.roastLevel);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 제출 핸들러
  const handleSubmit = async () => {
    setIsSubmitting(true);

    // LocalStorage에 저장
    const success = saveSettings({
      investment_style: investmentStyle,
      living_expense_ratio: livingExpenseRatio,
      investment_ratio: investmentRatio,
      roast_level: roastLevel,
    });

    if (success) {
      router.push("/home");
    } else {
      toast.error("설정 저장에 실패했습니다.");
    }
    setIsSubmitting(false);
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
