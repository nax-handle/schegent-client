import React from "react";
import { cn } from "@/lib/utils";
import { HomeProps } from "../instance";
import colors from "../color-event";

export default function Week({ events }: HomeProps) {
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const hour = today.getHours();
  const minute = today.getMinutes();
  const todayIndex = today.getDay();

  const topOffset = hour * 56 + (minute / 60) * 56;

  const hours = Array.from(
    { length: 24 },
    (_, i) => `${i.toString().padStart(2, "0")}:00`
  );

  const getColorByTitle = (title: string) => {
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="w-full relative rounded-tr-xl rounded-br-xl rou border-gray-300 border-t-1 border-b-1 border-r-1">
      <div className="w-full flex sticky top-0 z-50 rounded-t-lg">
        <div className="grid grid-cols-7 pl-19 border-b border-gray-200 flex-1 w-full ">
          {days.map((day, index) => {
            const date = new Date(today);
            const diff = index - todayIndex;
            date.setDate(today.getDate() + diff);

            const isToday = index === todayIndex;
            return (
              <div key={day} className="py-2 text-center ">
                <div className="font-medium">{day}</div>
                <div
                  className={cn(
                    "w-7 h-7 mx-auto mt-1 flex items-center justify-center rounded-full",
                    isToday
                      ? "dark:bg-white bg-[#3A82F6] text-white dark:text-black"
                      : ""
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="h-[69vh] relative overflow-y-auto scrollbar-hidden">
        <div className="absolute left-0 w-20 z-10 h-full">
          {Array.from({ length: 24 }, (_, i) => (
            <div
              key={i}
              className="flex h-14 items-center justify-center pr-2 border-r  text-xs "
            >
              <p className="mb-13.5">{i === 0 ? "" : `${i}:00`}</p>
            </div>
          ))}
        </div>

        <div className="flex w-full h-full relative pl-20 ">
          <div className="grid grid-cols-7 divide-x divide-gray-200 flex-1 w-full">
            {days.map((day, dayIndex) => (
              <div key={day} className="relative">
                {hours.map((hour, index) => (
                  <div
                    key={`${hour}-${index}`}
                    className={`h-14 ${
                      index === hours.length - 1
                        ? ""
                        : "border-b dark:border-gray-200 border-gray-300"
                    }`}
                  ></div>
                ))}

                {events
                  .filter((event) => {
                    return event.date === dayIndex;
                  })
                  .map((event, index) => {
                    const top = event.startHour * 56;
                    const height = event.duration * 56;
                    const bgColor = getColorByTitle(event.title);

                    return (
                      <div
                        key={index}
                        className={`absolute left-1 right-1 rounded-md p-2 overflow-hidden text-black border-l-4 ${bgColor}`}
                        style={{
                          top: `${top}px`,
                          height: `${height}px`,
                        }}
                      >
                        <div className="text-xs font-semibold truncate">
                          {event.time}
                        </div>
                        <div className="text-xs truncate">{event.title}</div>
                      </div>
                    );
                  })}

                {dayIndex === todayIndex && (
                  <div
                    className="absolute top-0 left-0 right-0 z-20"
                    style={{ top: `${topOffset}px` }}
                  >
                    <div className="relative w-full h-[1px] bg-red-500">
                      <span className="absolute -left-1 top-0 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"></span>
                    </div>
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
