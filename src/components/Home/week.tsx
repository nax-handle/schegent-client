import React from "react";
import { cn } from "@/lib/utils";
import { HomeProps } from "../interface";

export default function Week({ events }: HomeProps) {
  const now = new Date();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const todayIndex = now.getDay(); // 0 (Sun) -> 6 (Sat)

  const topOffset = hour * 56 + (minute / 60) * 56;
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

  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const getColorByTitle = (title) => {
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full relative inset-0 bg-gray/30 backdrop-blur-xl rounded-lg border-gray-300 border-1">
      <div className="w-full flex sticky  top-0 z-50  rounded-t-lg">
        <div className="grid grid-cols-7 pl-19 border-b border-gray-200 flex-1 w-full ">
          {days.map((day, index) => {
            const date = new Date(2025, 4, 4 + index);
            const isToday = index === todayIndex;
            return (
              <div key={day} className="py-2 text-center text-white">
                <div className="font-medium">{day}</div>
                <div
                  className={cn(
                    "w-7 h-7 mx-auto mt-1 flex items-center justify-center rounded-full",
                    isToday ? "bg-white text-black" : ""
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-[81vh] relative overflow-y-auto scrollbar-hidden">
        <div className="absolute left-0 w-20 z-10 h-full">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex h-14 items-center justify-center pr-2 border-r text-xs text-white"
            >
              <p className="mb-13.5">{i === 0 ? "" : `${i}:00`}</p>
            </div>
          ))}
        </div>

        <div className="flex w-full h-full relative pl-20 ">
          <div className="grid grid-cols-7 divide-x divide-gray-200 flex-1  w-full">
            {days.map((day, dayIndex) => (
              <div key={day} className="relative">
                {hours.map((hour, index) => (
                  <div
                    key={`${hour}-${index}`}
                    className={`h-14 ${
                      index === hours.length - 1 ? "" : "border-b"
                    }`}
                  ></div>
                ))}

                {events
                  .filter((event) => {
                    return (
                      event.date === dayIndex + 4 ||
                      (dayIndex === 4 && event.date === 8)
                    );
                  })
                  .map((event) => {
                    const top = event.startHour * 56;
                    const height = event.duration * 56;
                    const bgColor = getColorByTitle(event.title);

                    return (
                      <div
                        key={event.id}
                        className={`absolute left-1 right-1 text-white rounded-sm p-1 overflow-hidden ${bgColor}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                      >
                        <div className="text-xs font-medium truncate">
                          {event.time}
                        </div>
                        <div className="text-xs truncate">{event.title}</div>
                      </div>
                    );
                  })}

                {dayIndex === todayIndex && (
                  <div
                    className="flex items-center w-full z-20 justify-right absolute left-0 "
                    style={{ top: `${topOffset}px` }}
                  >
                    <span className="bg-red-500 h-[0.5px] w-full flex items-center">
                      <span className="w-1 h-1 rounded-full mb-0 p-1 bg-red-500"></span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
