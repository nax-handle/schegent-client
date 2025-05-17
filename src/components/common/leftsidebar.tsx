"use client";
import React, { useState } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { HomeProps } from "../interface";

export default function LeftSidebar({ events }: HomeProps) {
  const [currentMonth, setCurrentMonth] = useState("March 2025");
  const daysInMonth = 31;
  const firstDayOffset = 5;
  const miniCalendarDays = Array.from(
    { length: daysInMonth + firstDayOffset },
    (_, i) => (i < firstDayOffset ? null : i - firstDayOffset + 1)
  );
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
  return (
    <div className="w-[15%] border-r border-gray-200 flex flex-col bg-gray/30 backdrop-blur-2xl  h-[95.5vh] border-tr rounded-tr-2xl">
      <div className="p-3">
        <button className="w-full py-2 px-4 text-center rounded-4xl  text-white font-medium bg-[#3A82F6]">
          + Create
        </button>
      </div>

      <nav className="flex-1">
        <div className="my-4 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">{currentMonth}</h3>
            <div className="flex gap-1">
              <button className="p-1 rounded-full hover:bg-white/20">
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button className="p-1 rounded-full hover:bg-white/20">
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs text-white/70 font-medium py-1">
                {day}
              </div>
            ))}

            {miniCalendarDays.map((day, i) => (
              <div
                key={i}
                className={`text-xs rounded-full w-7 h-7 flex items-center justify-center ${
                  day === 5
                    ? "bg-blue-500 text-white"
                    : "text-white hover:bg-white/20"
                } ${!day ? "invisible" : ""}`}
              >
                {day}
              </div>
            ))}
          </div>
        </div>
        <div className="px-4">
          <h3 className="text-white font-medium mb-3">My calendars</h3>
          <div className="space-y-2">
            {[
              ...new Map(
                events
                  .filter((item) => item.title)
                  .map((item) => [item.title, item])
              ).values(),
            ].map((event) => {
              const bg = getColorByTitle(event.title);
              return (
                <div key={event.id} className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-sm ${bg}`}></div>
                  <span className="text-white text-sm">{event.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
