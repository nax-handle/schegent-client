import React, { useEffect, useState } from "react";
import { HomeProps } from "../interface";

export default function Day({ events }: HomeProps) {
  const [topOffset, setTopOffset] = useState(0);

  const calculateTopOffset = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const offset = hours * 65 + minutes * (65 / 60);
    setTopOffset(offset);
  };
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
    <div className="w-full  h-[87vh] inset-0 bg-gray/30 backdrop-blur-xl black overflow-hidden rounded-lg border-gray-300 border-1">
      <div className="h-full w-full pb-10">
        <div className="mx-2 flex">
          <span className="text-sm text-white border-b border-r w-[85px] px-4 py-2">
            GMT+00
          </span>
          <span className="text-sm text-white border-b p-2 w-full"></span>
        </div>
        <div className="mx-2 flex h-full overflow-y-scroll relative overflow-x-hidden scrollbar-hidden">
          <div className="flex h-full w-full">
            <div className=" w-full relative">
              {Array.from({ length: 24 }, (_, i) => (
                <div className="flex h-[65px]" key={i}>
                  <div className="w-[85px] z-20 border-r">
                    <p className="text-sm text-white w-18 px-4">
                      {i === 0 ? "" : `${i}:00`}
                    </p>
                  </div>
                </div>
              ))}

              {Array.from({ length: 24 }, (_, j) => (
                <div
                  key={j}
                  className={`absolute ${j > 0 && "border-b "} w-full left-18`}
                  style={{ top: `${j * 65 + 10}px` }}
                ></div>
              ))}

              {events.map((event) => {
                const top = event.startHour * 65;
                const bgColor = getColorByTitle(event.title);

                return (
                  <div
                    key={event.id}
                    className="flex items-center sm:w-[94.5%] w-[73%] left-26 z-20 justify-right absolute right-0"
                    style={{ top: `${top}px` }}
                  >
                    <span
                      className={`p-4 ${bgColor} w-[98%] rounded-md bg-opacity-25`}
                    >
                      {event.title} {event.time}
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
