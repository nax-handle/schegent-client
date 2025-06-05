import React, { useEffect, useState } from "react";
import { colors } from "@/lib/constants/constants";
import events from "@/constant/events";

export default function Day() {
  const [topOffset, setTopOffset] = useState(0);
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );
  const todayDate = today.getDate();
  const daysVN = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const date = new Date();
  const weekday = daysVN[date.getDay()];

  const calculateTopOffset = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const offset = hours * 65 + minutes * (65 / 60);
    setTopOffset(offset);
  };

  useEffect(() => {
    calculateTopOffset();
    const interval = setInterval(calculateTopOffset, 60000);
    return () => clearInterval(interval);
  }, []);

  const getColorByTitle = (title: string) => {
    let sum = 0;
    for (let i = 0; i < title.length; i++) {
      sum += title.charCodeAt(i);
    }
    return colors[sum % colors.length];
  };

  return (
    <div className="w-full inset-0 bg-gray/30 backdrop-blur-xl black overflow-hidden  border-gray-300 border-t-1 border-r-1 border-b-1 rounded-tr-xl rounded-br-xl">
      <p className="p-2 pl-6 text-2xl  dark:text-white w-fit rounded-full">
        {weekday}, {todayDate}
      </p>
      <div className="h-full w-full ">
        <div className="mx-2 flex">
          <span className="text-sm dark:text-white border-b border-r w-[85px] px-4">
            GMT+00
          </span>
          <span className="text-sm text-white border-b p-2 w-full"></span>
        </div>
        <div
          className="mx-2 flex overflow-y-scroll relative overflow-x-hidden scrollbar-hidden "
          style={{ height: "calc(100vh - 245px)" }}
        >
          <div className="flex h-full w-full">
            <div className=" w-full relative">
              {/* Giờ bên trái */}
              <div className="absolute -top-[10px] left-0 z-10">
                {Array.from({ length: 24 }, (_, i) => (
                  <div className="flex h-[65px]" key={i}>
                    <div className="w-[85px] z-20 border-r">
                      <p className="text-sm dark:text-white text-black w-18 px-4">
                        {i === 0 ? "" : `${i}:00`}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              {/* Vạch ngang */}
              {Array.from({ length: 24 }, (_, j) => (
                <div
                  key={j}
                  className={`absolute ${j > 0 && "border-b "} w-full left-18`}
                  style={{ top: `${j * 65}px` }}
                ></div>
              ))}

              {events.map((event, index) => {
                const top = event.startHour * 65;
                const bgColor = getColorByTitle(event.title);

                return (
                  <div
                    key={index}
                    className="flex items-center sm:w-[94.5%] w-[73%] left-26 z-20 justify-right absolute right-0 "
                    style={{ top: `${top}px` }}
                  >
                    <span
                      className={`px-3 py-2 border-l-4 ${bgColor} w-[98%] rounded-md text-black flex flex-col h-[65px]`}
                    >
                      <span className="text-xs font-semibold">
                        {event.title}
                      </span>
                      <span className="text-xs">{event.time}</span>
                    </span>
                  </div>
                );
              })}

              <div
                className="flex items-center w-full z-20 justify-right absolute right-0 left-19.5"
                style={{ top: `${topOffset}px` }}
              >
                <span className="bg-red-500 h-[1px] w-full flex items-center">
                  <span className="w-3 h-3 rounded-full p-1 bg-red-500"></span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
