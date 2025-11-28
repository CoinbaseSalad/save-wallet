"use client";

import { DollarSign, PiggyBank, TrendingUp } from "lucide-react";
import { useTranslations } from "next-intl";

interface SalaryAllocationSliderProps {
  livingExpenseRatio: number;
  investmentRatio: number;
  onLivingExpenseChange: (value: number) => void;
  onInvestmentChange: (value: number) => void;
}

export default function SalaryAllocationSlider({
  livingExpenseRatio,
  investmentRatio,
  onLivingExpenseChange,
  onInvestmentChange,
}: SalaryAllocationSliderProps) {
  const t = useTranslations("salaryAllocation");

  // 저축 비율 계산
  const savingsRatio = 100 - livingExpenseRatio - investmentRatio;

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-secondary" />
          {t("title")}
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
            <span>{t("livingExpense")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-blue-400 to-blue-500" />
            <span>{t("investment")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-linear-to-r from-emerald-400 to-emerald-500" />
            <span>{t("savings")}</span>
          </div>
        </div>

        {/* 생활비 비율 */}
        <div className="form-control mt-4">
          <label className="label">
            <span className="label-text flex items-center gap-2">
              <PiggyBank className="w-4 h-4" />
              {t("livingExpenseRatio")}
            </span>
            <span className="label-text-alt font-bold text-amber-500">{livingExpenseRatio}%</span>
          </label>
          <input
            type="range"
            min={5}
            max={90}
            value={livingExpenseRatio}
            onChange={(e) => {
              const newValue = Number(e.target.value);
              onLivingExpenseChange(newValue);
              // 투자 비율 자동 조정
              if (newValue + investmentRatio > 95) {
                onInvestmentChange(95 - newValue);
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
              {t("investmentRatio")}
            </span>
            <span className="label-text-alt font-bold text-blue-500">{investmentRatio}%</span>
          </label>
          <input
            type="range"
            min={5}
            max={Math.min(60, 95 - livingExpenseRatio)}
            value={investmentRatio}
            onChange={(e) => onInvestmentChange(Number(e.target.value))}
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
            <span className="text-base-content/70">{t("autoSavingsRatio")}</span>
            <span className="font-bold text-emerald-500">{savingsRatio}%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
