"use client";
import { useTranslation } from "react-i18next";
import "@/../i18n";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const isEnglish = i18n.language === "en";
  const setIsEnglish = (value: boolean) => {
    if (value) {
      i18n.changeLanguage("en");
    } else {
      i18n.changeLanguage("vi");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div
        className={`relative w-21 h-10 rounded-full cursor-pointer transition-all duration-300 shadow-inner bg-cover bg-center ${
          isEnglish
            ? "bg-[url('/images/Flag_of_the_United_Kingdom.png')]"
            : "bg-[url('/images/Flag_of_Vietnam.png')]"
        }`}
        onClick={() => setIsEnglish(!isEnglish)}
      >
        <div
          className={`absolute top-1 w-8 h-8 bg-white rounded-full shadow-lg transition-all duration-300 flex items-center justify-center ${
            isEnglish ? "left-1" : "left-12"
          }`}
        >
          {isEnglish ? (
            <div className="w-8 h-6 rounded-full overflow-hidden">
              <svg viewBox="0 0 60 30" className="w-full h-full">
                <clipPath id="uk-flag">
                  <circle cx="30" cy="15" r="15" />
                </clipPath>
                <rect
                  width="60"
                  height="30"
                  fill="#012169"
                  clipPath="url(#uk-flag)"
                />
                <path
                  d="m0,0 60,30 m0,-30 -60,30"
                  stroke="#fff"
                  strokeWidth="6"
                  clipPath="url(#uk-flag)"
                />
                <path
                  d="m0,0 60,30 m0,-30 -60,30"
                  stroke="#C8102E"
                  strokeWidth="4"
                  clipPath="url(#uk-flag)"
                />
                <path
                  d="m30,0 0,30 m-30,-15 60,0"
                  stroke="#fff"
                  strokeWidth="10"
                  clipPath="url(#uk-flag)"
                />
                <path
                  d="m30,0 0,30 m-30,-15 60,0"
                  stroke="#C8102E"
                  strokeWidth="6"
                  clipPath="url(#uk-flag)"
                />
              </svg>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full overflow-hidden">
              <svg viewBox="0 0 30 20" className="w-full h-full">
                <clipPath id="vn-flag-1">
                  <circle cx="15" cy="10" r="10" />
                </clipPath>
                <rect
                  width="30"
                  height="20"
                  fill="#DA020E"
                  clipPath="url(#vn-flag-1)"
                />
                <polygon
                  points="15,3 16.5,8.5 22,8.5 17.5,12 19,17.5 15,14 11,17.5 12.5,12 8,8.5 13.5,8.5"
                  fill="#FFFF00"
                  clipPath="url(#vn-flag-1)"
                />
              </svg>
              <span className="text-xs">VI</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
