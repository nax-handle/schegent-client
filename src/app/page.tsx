"use client";

import { useState } from "react";
import Day from "@/components/Home/Day";
import Week from "@/components/Home/week";
import Month from "@/components/Home/month";
import Header from "@/components/common/header";
import Leftsidebar from "@/components/common/leftsidebar";

type CalendarView = "day" | "week" | "month";

export default function CalendarPage() {
  const [lunarCalendarEnabled, setLunarCalendarEnabled] = useState(false);
  const [showLunarNotification, setShowLunarNotification] = useState(true);
  const [currentView, setCurrentView] = useState<CalendarView>("week");

  const events = [
    {
      date: 6,
      time: "00:00",
      title: "Team Meeting",
      startHour: 0,
      duration: 1,
    },
    {
      date: 8,
      time: "14:00",
      title: "Client Call",
      startHour: 14,
      duration: 0.5,
    },
    {
      date: 9,
      time: "16:00",
      title: "Team Meeting",
      startHour: 16,
      duration: 1,
    },
    {
      date: 20,
      time: "17:00",
      title: "Project Deadline",
      startHour: 17,
      duration: 1,
    },
    {
      date: 21,
      time: "10:00",
      title: "Weekly Review",
      startHour: 10,
      duration: 1.5,
    },
  ];

  // Generate calendar dates for May 2025

  // Get events for the current day (May 8)

  return (
    <div className="flex h-screen bg-white">
      {/* Left Sidebar */}
      <Leftsidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        <div className="border-b border-gray-200 px-6 py-3 flex items-center gap-4">
          <button className="px-3 py-1 font-medium text-black border-b-2 border-black">
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
          <button className="px-3 py-1 font-medium text-gray-500">Tasks</button>
        </div>

        {/* Calendar Header */}
        <Header
          setLunarCalendarEnabled={setLunarCalendarEnabled}
          lunarCalendarEnabled={lunarCalendarEnabled}
        />

        {/* View Selector */}
        <div className="px-8 pb-6 flex justify-center">
          <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
            <button
              className={`px-6 py-2 text-ld ${
                currentView === "day" ? "bg-black text-white" : ""
              }`}
              onClick={() => setCurrentView("day")}
            >
              Day
            </button>
            <button
              className={`px-6 py-2 text-ld border-x ${
                currentView === "week" ? "bg-black text-white" : ""
              }`}
              onClick={() => setCurrentView("week")}
            >
              Week
            </button>
            <button
              className={`px-6 py-2 text-ld ${
                currentView === "month" ? "bg-black text-white" : ""
              }`}
              onClick={() => setCurrentView("month")}
            >
              Month
            </button>
          </div>
        </div>

        {/* Calendar Content */}
        <div className="flex-1 px-6 pb-6 overflow-auto">
          {currentView === "month" && <Month events={events} />}
          {currentView === "day" && <Day />}
          {currentView === "week" && <Week events={events} />}
        </div>
        {showLunarNotification && lunarCalendarEnabled && (
          <div className="absolute bottom-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-80">
            <h3 className="font-medium mb-2">Lunar calendar enabled</h3>
            <p className="text-sm text-gray-600">
              Calendar will now show both Gregorian and lunar dates
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
