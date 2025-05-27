import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";
import { Calendar, CheckSquare } from "lucide-react";

interface HeaderProps {
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
}
export default function NavMenu({ currentView, setCurrentView }: HeaderProps) {
  const [activeTab, setActiveTab] = useState("scheduler");

  const today = new Date();
  const currentMonth = today.toLocaleString("default", {
    month: "long",
  });
  const currentYear = today.getFullYear();

  return (
    <div className="flex items-center justify-between border-gray-300   w-full pl-6">
      <div className="flex items-center gap-4">
        <h1 className="text-md border-2 px-4 py-2 rounded-full ">Today</h1>
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
      <div className="flex items-center">
        <div className="hidden md:flex items-center border gap-1 p-1 rounded-lg">
          <Button
            variant={activeTab === "scheduler" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("scheduler")}
            className={`gap-2 ${
              activeTab === "scheduler"
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "dark:hover:bg-white/10 hover:bg-blue-200"
            }`}
          >
            <Calendar className="h-4 w-4" />
            Scheduler
          </Button>

          <Button
            variant={activeTab === "task" ? "default" : "ghost"}
            size="sm"
            onClick={() => setActiveTab("task")}
            className={`gap-2 ${
              activeTab === "task"
                ? "bg-blue-500 text-white hover:bg-blue-400"
                : "dark:hover:bg-white/10 hover:bg-blue-200"
            }`}
          >
            <CheckSquare className="h-4 w-4" />
            Tasks
          </Button>
        </div>
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
