import React from "react";
import { cn } from "@/lib/utils";
import LunarJS from "lunar-javascript";
import type { Event } from "@/types";

export default function Month({ eventsdata }: { eventsdata: Event[] }) {
  const { Lunar } = LunarJS;
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const year = today.getFullYear();
  const month = today.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const todayDate = today.getDate();

  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const calendarDates = Array.from({ length: daysInMonth }, (_, i) => {
    const gregorianDate = new Date(year, month, i + 1);
    const lunar = Lunar.fromDate(gregorianDate);
    return {
      date: i + 1,
      weekNumber: Math.ceil((i + 1 + firstDayOfMonth) / 7),
      lunarDay: lunar.getDay(),
      lunarMonth: lunar.getMonth(),
      isFirstDayOfLunarMonth: lunar.getDay() === 1,
    };
  });

  const addOpacityToHex = (color: string) => {
    const alpha = Math.round(255 * 0.19)
      .toString(16)
      .padStart(2, "0");
    return color + alpha;
  };

  const totalCells = Math.ceil((daysInMonth + firstDayOfMonth) / 7) * 7;

  return (
    <div className="inset-0 bg-gray/30 backdrop-blur-sm border-gray-300 border-t-1 border-r-1 border-b-1 rounded-tr-xl rounded-br-xl">
      <div className="grid grid-cols-7 border-b ">
        {days.map((day) => (
          <div
            key={day}
            className="py-2 text-center font-medium dark:text-white  text-black"
          >
            {day}
          </div>
        ))}
      </div>

      <div
        className="grid grid-cols-7 grid-rows-5 "
        style={{ height: "calc(100vh - 227px)" }}
      >
        {Array.from({ length: totalCells }, (_, i) => {
          const date = i - firstDayOfMonth + 1;
          const isCurrentMonth = date > 0 && date <= daysInMonth;
          const isToday = date === todayDate;
          const dateObj = isCurrentMonth ? calendarDates[date - 1] : null;

          const dateEvents = eventsdata.filter(
            (event) => new Date(event.startTime).getDate() === date
          );

          return (
            <div
              key={i}
              className={cn(
                `${
                  (i + 1) % 7 === 0 ? "" : "border-r"
                } border-t border-gray-200 p-1 relative h-full dark:text-white text-black`,
                !isCurrentMonth && "opacity-50"
              )}
            >
              {isCurrentMonth && (
                <>
                  <div className="flex justify-between items-start p-1">
                    <div className="flex flex-col items-center">
                      {isToday ? (
                        <div className="w-7 h-7 rounded-full bg-[#3A82F6] text-white font-bold flex items-center justify-center">
                          {date}
                        </div>
                      ) : (
                        <div className="w-7 h-7 flex items-center justify-center dark:text-white text-black">
                          {date}
                        </div>
                      )}
                    </div>
                    {/* lunar day */}
                    {dateObj && (
                      <div className="text-xs text-orange-500">
                        {dateObj.isFirstDayOfLunarMonth
                          ? `${dateObj.lunarDay}/${dateObj.lunarMonth}`
                          : dateObj.lunarDay}
                      </div>
                    )}
                  </div>

                  <div className="mt-1">
                    {dateEvents.map((event, idx) => {
                      return (
                        <div
                          key={idx}
                          className={`text-xs text-black dark:text-white px-3 py-1 border-l-4 rounded-md truncate bg-opacity-20`}
                          style={{
                            borderLeftColor: event.colorId,
                            backgroundColor: addOpacityToHex(event.colorId),
                          }}
                        >
                          <span className="font-semibold">{event.title}</span>
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
