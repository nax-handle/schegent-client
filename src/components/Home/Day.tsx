import React, { useEffect, useState } from "react";
import { ArrowBigLeftDash, ArrowBigRightDash } from "lucide-react";

export default function Day() {
  const [topOffset, setTopOffset] = useState(0);

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

  return (
    <div className="w-full h-full">
      <div className="mx-2 flex">
        <span className="text-sm text-black border-b border-r w-[85px] px-4 py-2">
          GMT+00
        </span>
        <span className="text-sm text-black border-b p-2 w-full"></span>
      </div>

      <div className="mx-2 flex h-full overflow-y-scroll relative overflow-x-hidden">
        <div className="flex h-full w-full">
          <div className=" w-full relative">
            {Array.from({ length: 24 }, (_, i) => (
              <div className="flex h-[65px]" key={i}>
                <div className="w-[85px] z-20 border-r">
                  <p className="text-sm text-black bg-white w-18 px-4">
                    {i === 0 ? "" : `${i}:00`}
                  </p>
                </div>
              </div>
            ))}

            {Array.from({ length: 24 }, (_, j) => (
              <div
                key={j}
                className={`absolute ${j > 0 && "border-b "} w-full `}
                style={{ top: `${j * 65 + 10}px` }}
              ></div>
            ))}

            <div
              className="flex items-center sm:w-[94.5%] w-[73%] left-26 z-20 justify-right absolute right-0"
              style={{ top: `${16.5 * 65}px` }}
            >
              <span className="p-4 bg-green-300 w-[98%] rounded-md bg-opacity-25">
                note 16h30-17h10
              </span>
            </div>

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
  );
}
