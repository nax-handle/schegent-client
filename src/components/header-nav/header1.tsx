import React from "react";
import ToggleTheme from "@/components/theme/toggle-theme";

export default function header1() {
  return (
    <div className=" px-6 py-3 flex items-center gap-4 ">
      <button className="px-3 py-1 font-medium  border-b-2 border-white">
        <div className="flex items-center gap-2">
          <svg
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
            <line x1="16" y1="2" x2="16" y2="6" />
            <line x1="8" y1="2" x2="8" y2="6" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          Calendar
        </div>
      </button>
      <button className="px-3 py-1 font-medium text-gray-600 dark:text-gray-200">
        Tasks
      </button>
      <ToggleTheme />
    </div>
  );
}
