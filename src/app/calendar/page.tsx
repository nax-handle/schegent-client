import React from "react";
import CalendarPage from "@/components/calendar/index";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Your personal calendar to manage events and tasks.",
};
export default function Calendar() {
  return (
    <div>
      <CalendarPage
        checked={[]}
        calendarID=""
        isEventDialogOpen={false}
        setIsEventDialogOpen={() => {}}
      />
    </div>
  );
}
