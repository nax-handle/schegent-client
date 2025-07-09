"use client";

import React, { useState, useEffect } from "react";
import CalendarPage from "@/components/calendar/index";
import { useGetAllCalendars } from "@/hooks/calendar/use.calendar";

export default function Calendar() {
  const [checked, setChecked] = useState<string[]>([]);
  const [calendarID, setCalendarID] = useState<string>("");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);

  const { data: calendars } = useGetAllCalendars();

  useEffect(() => {
    if (calendars && calendars.length > 0) {
      const calendarIds = calendars.map((cal) => cal.id);
      setChecked(calendarIds);
      if (calendars[0]) setCalendarID(calendars[0].id);
    }
  }, [calendars]);

  return (
    <div>
      <CalendarPage
        checked={checked}
        calendarID={calendarID}
        isEventDialogOpen={isEventDialogOpen}
        setIsEventDialogOpen={setIsEventDialogOpen}
      />
    </div>
  );
}
