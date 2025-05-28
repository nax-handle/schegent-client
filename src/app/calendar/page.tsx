"use client";

import { useState } from "react";
import Day from "@/components/calendar/day";
import Week from "@/components/calendar/week";
import Month from "@/components/calendar/month";
import NavMenu from "@/components/header-nav/nav-menu";
type CalendarView = "day" | "week" | "month";

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState<CalendarView>("day");
  return (
    <div className="w-full">
      <NavMenu currentView={currentView} setCurrentView={setCurrentView} />
      <div className={`flex`}>
        <div className={`flex-1  mr-1 `}>
          {currentView === "day" && <Day />}
          {currentView === "week" && <Week />}
          {currentView === "month" && <Month />}
        </div>
      </div>
    </div>
  );
}
