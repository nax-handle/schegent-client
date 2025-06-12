import React from "react";
import { cn } from "@/lib/config/utils";
import type { Event } from "@/types";

export default function Week({ eventsdata }: { eventsdata: Event[] }) {
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

  const addOpacityToHex = (color: string) => {
    const alpha = Math.round(255 * 0.19)
      .toString(16)
      .padStart(2, "0");
    return color + alpha;
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

      <div
        className="relative overflow-y-auto scrollbar-hidden"
        style={{ height: "calc(100vh - 250px)" }}
      >
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
            {days.map((day, dayIndex) => {
              const date = new Date(today);
              const diff = dayIndex - todayIndex;
              date.setDate(today.getDate() + diff);
              const currentDate = date;

              return (
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

                  {eventsdata
                    .filter((event) => {
                      const eventDate = new Date(event.startTime);
                      return (
                        eventDate.getDate() === currentDate.getDate() &&
                        eventDate.getMonth() === currentDate.getMonth() &&
                        eventDate.getFullYear() === currentDate.getFullYear()
                      );
                    })
                    .map((event, index) => {
                      const stateTime = new Date(event.startTime);
                      const hourStartTime = stateTime.getHours();
                      const minuteStartTime = stateTime.getMinutes();
                      const top =
                        hourStartTime * 56 + (minuteStartTime / 60) * 56;

                      const endTime = new Date(event.endTime);
                      const hourEndTime = endTime.getHours();
                      const minuteEndTime = endTime.getMinutes();
                      const height =
                        (hourEndTime - hourStartTime) * 56 +
                        (minuteEndTime - minuteStartTime) * (56 / 60);

                      return (
                        <div
                          key={index}
                          className={`absolute left-1 right-1 rounded-md p-2 overflow-hidden text-black border-l-4 bg-opacity-20`}
                          style={{
                            top: `${top}px`,
                            height: `${height}px`,
                            borderLeftColor: event.colorId,
                            backgroundColor: addOpacityToHex(event.colorId),
                          }}
                        >
                          <div className="text-xs font-semibold truncate">
                            {event.title}
                          </div>
                          <div className="text-xs truncate">
                            {new Date(event.startTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}{" "}
                            -{" "}
                            {new Date(event.endTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
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
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
