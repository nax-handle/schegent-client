import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";

interface HeaderProps {
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
}
export default function NavMenu({ currentView, setCurrentView }: HeaderProps) {
  const { t } = useTranslation();

  const today = new Date();
  const currentMonth = today.toLocaleString("default", {
    month: "long",
  });
  const currentYear = today.getFullYear();
  const handleCurrentView = (currentView: string) => {
    localStorage.setItem("currentView", currentView);
    setCurrentView(currentView as "day" | "week" | "month");
  };

  return (
    <div className="flex items-center justify-between border-gray-300   w-full pl-6 pb-6">
      <div className="flex items-center gap-4 ml-8">
        <h1 className="text-md border-2 px-4 py-2 rounded-full">
          {t("Today")}
        </h1>
        <div className="flex items-center ">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-2xl font-bold ">
          {currentMonth}, {currentYear}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-8 pb-6 mt-6 flex justify-center">
          <div className="inline-flex rounded-md overflow-hidden">
            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "day"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("day")}
            >
              {t("Day")}
            </button>
            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "week"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("week")}
            >
              {t("Week")}
            </button>

            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "month"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("month")}
            >
              {t("Month")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
