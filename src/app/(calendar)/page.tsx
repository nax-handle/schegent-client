"use client";

import { useState, useEffect } from "react";
import Day from "@/components/calendar/day";
import Week from "@/components/calendar/week";
import Month from "@/components/calendar/month";
import NavMenu from "@/components/header-nav/nav-menu";
type CalendarView = "day" | "week" | "month";
import { useMultiCalendarEvents } from "@/hooks/calendar/use.events";
import { Event } from "@/types";

export default function CalendarPage({ checked }: { checked: string[] }) {
  const [currentView, setCurrentView] = useState<CalendarView>("month");
  const currentDate = new Date().toISOString().split("T")[0];
  const [events, setEvents] = useState<Event[] | null>([]);
  const queryResults = useMultiCalendarEvents(
    checked,
    currentView,
    currentDate
  );
  const data = queryResults.map((result) => result.data).filter(Boolean);

  useEffect(() => {
    const mergedEvents = data
      .flat()
      .filter((event): event is Event => event !== undefined);

    const mergedIds = mergedEvents
      .map((e) => e.id)
      .sort()
      .join(",");
    const currentIds = (events || [])
      .map((e) => e.id)
      .sort()
      .join(",");

    if (mergedIds !== currentIds) {
      setEvents(mergedEvents);
    }
  }, [data]);

  return (
    <div className="w-full">
      <NavMenu currentView={currentView} setCurrentView={setCurrentView} />
      <div className={`flex`}>
        <div className={`flex-1  mr-1 `}>
          {currentView === "day" && <Day eventsdata={events ?? []} />}
          {currentView === "week" && <Week eventsdata={events ?? []} />}
          {currentView === "month" && <Month eventsdata={events ?? []} />}
        </div>
      </div>
    </div>
  );
}
