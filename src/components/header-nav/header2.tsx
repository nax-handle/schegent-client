import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface HeaderProps {
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
}
export default function header({ currentView, setCurrentView }: HeaderProps) {
  return (
    <div className="flex items-center justify-between border-gray-300 border-b mb-3 absolute top-10  w-[86.9%] pl-6">
      <h1 className="text-2xl font-bold ">May 2025</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center ">
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="px-3 py-1 mx-2 rounded-md">Today</button>
          <button className="p-2 rounded-md hover:bg-gray-100">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <div className="px-8 pb-6 mt-6 flex justify-center">
          <div className="inline-flex rounded-md overflow-hidden">
            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "day"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => setCurrentView("day")}
            >
              Day
            </button>
            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "week"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => setCurrentView("week")}
            >
              Week
            </button>

            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "month"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => setCurrentView("month")}
            >
              Month
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
