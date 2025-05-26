"use client";
import React, { useState, useMemo } from "react";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { HomeProps } from "../instance";
import ToggleTheme from "../theme/toggle-theme";

export default function LeftSidebar({ events }: HomeProps) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOffset = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay(); // 0 = Sunday

  const miniCalendarDays = useMemo(
    () =>
      Array.from({ length: daysInMonth + firstDayOffset }, (_, i) =>
        i < firstDayOffset ? null : i - firstDayOffset + 1
      ),
    [daysInMonth, firstDayOffset]
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

  // Chuyển tháng
  const changeMonth = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(newDate.getMonth() + offset);
    setCurrentDate(newDate);
  };

  return (
    <div className="w-[15%] border-r border-gray-200 flex flex-col bg-gray/30 backdrop-blur-2xl h-[85vh] rounded-tr-2xl">
      <div className="p-3">
        <button className="w-full py-2 px-4 text-center rounded-4xl font-medium bg-[#3A82F6] text-white">
          + Create
        </button>
      </div>
      <div className="px-4 py-2">
        <ToggleTheme />
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

          <div className="grid grid-cols-7 gap-1 text-center">
            {["S", "M", "T", "W", "T", "F", "S"].map((day, i) => (
              <div key={i} className="text-xs font-medium py-1">
                {day}
              </div>
            ))}

            {miniCalendarDays.map((day, i) => {
              const isToday =
                day === today.getDate() &&
                currentDate.getMonth() === today.getMonth() &&
                currentDate.getFullYear() === today.getFullYear();

              return (
                <div
                  key={i}
                  className={`text-xs rounded-full w-7 h-7 flex items-center justify-center ${
                    isToday
                      ? "bg-blue-500 text-white"
                      : day
                      ? "hover:bg-white/20"
                      : "invisible"
                  }`}
                >
                  {day}
                </div>
              );
            })}
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
            ].map((event) => {
              const bg = getColorByTitle(event.title);
              return (
                <div key={event.id} className="flex items-center gap-3">
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
