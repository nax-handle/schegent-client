import React from "react";
import { cn } from "@/lib/utils";
import { HomeProps } from "../interface";

export default function Month({ events }: HomeProps) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const calendarDates = Array.from({ length: 31 }, (_, i) => ({
    date: i + 1,
    weekNumber: Math.ceil((i + 1) / 7),
    lunarDay: i + 4, // Simplified lunar date calculation
  }));
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
    <div className="inset-0 bg-gray/30 backdrop-blur-sm border-gray-300 border-1 rounded-lg">
      <div className="grid grid-cols-7 border-b ">
        {days.map((day) => (
          <div key={day} className="py-2 text-center font-medium text-white ">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 grid-rows-5 h-full">
        {Array.from({ length: 35 }, (_, i) => {
          const date = i - 3;
          const isCurrentMonth = date > 0 && date <= 31;
          const isToday = date === 8;
          const dateObj = isCurrentMonth ? calendarDates[date - 1] : null;
          const dateEvents = events.filter((event) => event.date === date);

          return (
            <div
              key={i}
              className={cn(
                `${
                  (i + 1) % 7 == 0 ? "" : "border-r"
                } border-t border-gray-200 p-1 relative h-[220px] text-white`,
                !isCurrentMonth && ""
              )}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex justify-between items-start p-1">
                    <div className="flex flex-col items-center">
                      {isToday ? (
                        <div className="w-7 h-7 rounded-full bg-white text-black font-bold flex items-center justify-center">
                          {date}
                        </div>
                      ) : (
                        <div className="w-7 h-7 flex items-center justify-center text-white">
                          {date}
                        </div>
                      )}
                    </div>
                    {dateObj && (
                      <div className="text-xs text-orange-500">
                        {Math.floor(Math.random() * 30) + 1}
                      </div>
                    )}
                  </div>

                  <div className="mt-1">
                    {dateEvents.map((event, idx) => {
                      const bgColor = getColorByTitle(event.title);
                      return (
                        <div
                          key={idx}
                          className={`text-xs bg-green-500 text-white p-1 rounded-sm mb-1 truncate ${bgColor}`}
                        >
                          {event.time} {event.title}
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
