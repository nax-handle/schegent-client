"use client";

import { useState } from "react";
import Day from "@/components/calendar/day";
import Week from "@/components/calendar/week";
import Month from "@/components/calendar/month";
import NavMenu from "@/components/header-nav/nav-menu";
import Leftsidebar from "@/components/header-nav/left-sidebar";
import Header from "@/components/header-nav/header";
import SideBarIcon from "@/components/header-nav/sidebar-icon";
type CalendarView = "day" | "week" | "month";

export default function CalendarPage() {
  const [currentView, setCurrentView] = useState<CalendarView>("week");

  const events = [
    {
      id: 1,
      date: 6,
      time: "00:00",
      title: "Team Meeting",
      startHour: 0,
      duration: 1,
    },
    {
      id: 2,
      date: 6,
      time: "00:00",
      title: "Client Call",
      startHour: 0,
      duration: 0.7,
    },
    {
      id: 3,
      date: 9,
      time: "16:00",
      title: "Team Meeting",
      startHour: 16,
      duration: 1,
    },
    {
      id: 4,
      date: 20,
      time: "17:00",
      title: "Project Deadline",
      startHour: 17,
      duration: 1,
    },
    {
      id: 5,
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
    <div className="block">
      <Header />
      <div className="flex-1 flex flex-col mt-2">
        <div className="flex ">
          <SideBarIcon />
          <Leftsidebar events={events} />
          <div className="w-full">
            <NavMenu
              currentView={currentView}
              setCurrentView={setCurrentView}
            />
            <div className="flex ml-5">
              <div className="flex-1  ">
                {currentView === "day" && <Day events={events} />}
                {currentView === "week" && <Week events={events} />}
                {currentView === "month" && <Month events={events} />}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
