import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
  setLunarCalendarEnabled: (enabled: boolean) => void;
  lunarCalendarEnabled: boolean;
}
export default function header({
  setLunarCalendarEnabled,
  lunarCalendarEnabled,
}: HeaderProps) {
  return (
    <div className="px-6 py-4 flex items-center justify-between">
      <h1 className="text-2xl font-bold">May 2025</h1>

      <div className="flex items-center gap-4">
        {/* <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2v8m0 0l-4-4m4 4l4-4" />
            <circle cx="12" cy="14" r="8" />
          </svg>
          <span>Lunar Calendar</span>
          <div
            className={`w-12 h-6 rounded-full p-1 cursor-pointer ${
              lunarCalendarEnabled ? "bg-black" : "bg-gray-300"
            }`}
            onClick={() => setLunarCalendarEnabled(!lunarCalendarEnabled)}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transform transition-transform ${
                lunarCalendarEnabled ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </div>
        </div> */}

        <div className="flex items-center">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-3 py-1 mx-2 rounded-md">Today</button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
