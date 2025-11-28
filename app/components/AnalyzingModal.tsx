"use client";

import { useEffect, useRef } from "react";
import { useTranslations } from "next-intl";

interface AnalyzingModalProps {
  isOpen: boolean;
}

export default function AnalyzingModal({ isOpen }: AnalyzingModalProps) {
  const modalRef = useRef<HTMLDialogElement>(null);
  const t = useTranslations("analyzing");

  useEffect(() => {
    if (isOpen) {
      modalRef.current?.showModal();
    } else {
      modalRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog ref={modalRef} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        {/* 로딩 인디케이터 */}
        <div className="flex flex-col items-center justify-center py-6">
          <span className="loading loading-spinner loading-lg text-primary"></span>

          {/* 제목 */}
          <h3 className="font-bold text-lg mt-6 text-center">
            {t("title")}
          </h3>

          {/* 설명 */}
          <p className="text-base-content/70 text-sm text-center mt-2">
            {t("description")}
          </p>

          {/* 소요 시간 안내 */}
          <div className="alert alert-info mt-6">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-current shrink-0 w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span className="text-xs">{t("timeNotice")}</span>
          </div>

          {/* 진행 상태 텍스트 */}
          <div className="flex items-center gap-2 mt-4 text-xs text-base-content/50">
            <span className="loading loading-dots loading-xs"></span>
            <span>{t("progress")}</span>
          </div>
        </div>
      </div>

      {/* 배경 클릭으로 닫기 방지 - 분석 중에는 닫을 수 없음 */}
      <div className="modal-backdrop bg-base-300/30"></div>
    </dialog>
  );
}

