"use client";

import * as React from "react";
import { Languages } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
interface LanguageSwitcherProps {
  onLanguageSelect?: () => void;
}

export default function LanguageSwitcher({
  onLanguageSelect,
}: LanguageSwitcherProps) {
  const { i18n } = useTranslation();
  const [language, setLanguage] = React.useState(i18n.language);
  const [open, setOpen] = React.useState(false);

  const handleChange = (value: string) => {
    setLanguage(value);
    i18n.changeLanguage(value);
    setOpen(false);
    if (onLanguageSelect) {
      onLanguageSelect();
    }
  };

  return (
    <div className=" py-1">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-sm hover:bg-muted"
      >
        <Languages className="w-4 h-4" />
        <span>Language</span>
        <span className="ml-auto text-xs">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="ml-6 mt-1 space-y-1">
          <button
            onClick={() => handleChange("en")}
            className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-muted ${
              language === "en" ? "font-medium text-blue-500" : ""
            }`}
          >
            English
          </button>
          <button
            onClick={() => handleChange("vi")}
            className={`block w-full text-left px-2 py-1 text-sm rounded hover:bg-muted ${
              language === "vi" ? "font-medium text-blue-500" : ""
            }`}
          >
            Tiếng Việt
          </button>
        </div>
      )}
    </div>
  );
}
