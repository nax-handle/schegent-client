import React from "react";
import { Metadata } from "next";
import AICalendarComponent from "@/components/ai-calendar/index";

export const metadata: Metadata = {
  title: "AI Calendar",
  description: "AI Calendar",
};

export default function AICalendar() {
  return (
    <div className="pt-2">
      <AICalendarComponent />
    </div>
  );
}
