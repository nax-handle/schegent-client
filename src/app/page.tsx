import React from "react";
import type { Metadata } from "next";
import Calendar from "./calendar/page";

export const metadata: Metadata = {
  title: "Calendar App",
  description: "Calendar application UI",
};

export default function Home() {
  return (
    <div>
      <Calendar />
    </div>
  );
}
