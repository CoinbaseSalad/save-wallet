"use client";

import { Globe, Check } from "lucide-react";
import { useLocaleSettings } from "@/app/hooks/useLocaleSettings";
import { useTranslations } from "next-intl";
import type { Locale } from "@/i18n/routing";

interface LanguageSelectorProps {
  showLabel?: boolean;
  compact?: boolean;
}

export default function LanguageSelector({ showLabel = true, compact = false }: LanguageSelectorProps) {
  const { locale, locales, localeNames, localeFlags, changeLocale, isPending } = useLocaleSettings();
  const t = useTranslations("setting");

  if (compact) {
    return (
      <div className="dropdown dropdown-end">
        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm gap-1">
          <Globe className="w-4 h-4" />
          <span>{localeFlags[locale]}</span>
        </div>
        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-200 rounded-box w-40">
          {locales.map((loc) => (
            <li key={loc}>
              <button
                onClick={() => changeLocale(loc as Locale)}
                disabled={isPending}
                className={locale === loc ? "active" : ""}
              >
                <span>{localeFlags[loc as Locale]}</span>
                <span>{localeNames[loc as Locale]}</span>
                {locale === loc && <Check className="w-4 h-4 ml-auto" />}
              </button>
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="card bg-base-200 shadow-lg">
      <div className="card-body">
        <h2 className="card-title text-lg flex items-center gap-2">
          <Globe className="w-5 h-5 text-info" />
          {t("language")}
        </h2>
        {showLabel && (
          <p className="text-sm text-base-content/60 mb-2">
            {t("languageDescription")}
          </p>
        )}
        
        <div className="grid grid-cols-2 gap-2 mt-2">
          {locales.map((loc) => (
            <button
              key={loc}
              onClick={() => changeLocale(loc as Locale)}
              disabled={isPending}
              className={`btn btn-outline gap-2 ${
                locale === loc ? "btn-primary" : ""
              }`}
            >
              <span className="text-lg">{localeFlags[loc as Locale]}</span>
              <span>{localeNames[loc as Locale]}</span>
              {locale === loc && <Check className="w-4 h-4" />}
            </button>
          ))}
        </div>

        {isPending && (
          <div className="flex items-center justify-center mt-2">
            <span className="loading loading-spinner loading-sm"></span>
          </div>
        )}
      </div>
    </div>
  );
}

