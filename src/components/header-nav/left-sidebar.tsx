"use client";
import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import events from "@/constant/events";
interface menuOpen {
  menuOpen: boolean;
}

export default function LeftSidebar({ menuOpen }: menuOpen) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const colors = [
    "bg-green-500",
    "bg-blue-500",
    "bg-red-500",
    "bg-purple-500",
    "bg-yellow-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-emerald-500",
  ];
  const getColorByTitle = (title: string) => {
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  // Chuyển tháng
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div
      className={` top-[11vh] left-0  w-[20%] border-r border-gray-200 bg-gray/30 backdrop-blur-2xl rounded-tr-2xl transition-all duration-300 ease-in-out transform ${
        menuOpen
          ? "translate-x-0 opacity-100 block"
          : "-translate-x-full opacity-0 fixed"
      }`}
      style={{ height: "calc(100vh - 85px)" }}
    >
      <div className="p-3">
        <button className="w-full py-2 px-4 text-center rounded-4xl font-medium bg-[#3A82F6] text-white">
          + Create
        </button>
      </div>
      <nav className="flex-1">
        <div className="my-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{currentMonth}</h3>
            <div className="flex gap-1">
              <button
                className="p-1 rounded-full hover:bg-white/20"
                onClick={() => changeMonth(-1)}
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                className="p-1 rounded-full hover:bg-white/20"
                onClick={() => changeMonth(1)}
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="px-4">
          <h3 className="font-medium mb-3">My calendars</h3>
          <div className="space-y-2">
            {[
              ...new Map(
                events
                  .filter((item) => item.title)
                  .map((item) => [item.title, item])
              ).values(),
            ].map((event, index) => {
              const bg = getColorByTitle(event.title);
              return (
                <div key={index} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-sm ${bg}`}></div>
                  <span className="text-sm">{event.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
