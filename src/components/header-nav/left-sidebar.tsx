"use client";
import React, { useState, useEffect } from "react";
interface menuOpen {
  menuOpen: boolean;
  setChecked?: React.Dispatch<React.SetStateAction<string[]>>;
}
import { useGetAllCalendars } from "@/hooks/calendar/use.calendar";
import { Checkbox } from "@/components/ui/checkbox";

export default function LeftSidebar({ menuOpen, setChecked }: menuOpen) {
  const { data } = useGetAllCalendars();
  const [calendar, setCalendar] = useState(data || []);

  useEffect(() => {
    if (data) {
      setCalendar(data);
    }
  }, [data]);

  useEffect(() => {
    if (data) {
      setCalendar(data);
      if (setChecked) {
        const defaultCheckedIds = data.map((c) => c.id);
        setChecked(defaultCheckedIds);
      }
    }
  }, [data]);

  return (
    <div
      className={` top-[11vh] left-0  w-[18%] border-r border-gray-200 bg-gray/30 backdrop-blur-2xl rounded-tr-2xl transition-all duration-300 ease-in-out transform ${
        menuOpen
          ? "translate-x-0 opacity-100 block"
          : "-translate-x-full opacity-0 fixed"
      }`}
      style={{ height: "calc(100vh - 85px)" }}
    >
      <div className="p-3">
        <button className="w-full py-2 px-4 text-center rounded-4xl font-medium bg-[#3A82F6] text-white">
          + Create
        </button>
      </div>
      <nav className="flex-1">
        <div className="px-4">
          <h3 className="font-medium mb-3">My calendars</h3>
          <div className="space-y-2">
            {calendar.map((calendar) => {
              return (
                <div key={calendar.id} className="flex items-center gap-3">
                  <Checkbox
                    id={calendar.id}
                    defaultChecked
                    className="w-4 h-4 rounded-sm border-none"
                    style={{ backgroundColor: calendar.colorId }}
                    onCheckedChange={(checked) => {
                      if (setChecked) {
                        setChecked((prev) =>
                          checked
                            ? [...prev, calendar.id]
                            : prev.filter((id) => id !== calendar.id)
                        );
                      }
                    }}
                  />
                  <span className="text-sm">{calendar.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </nav>
    </div>
  );
}
