import React from "react";
import { Metadata } from "next";
export const metadata: Metadata = {
  title: "Tasks",
  description: "Your personal tasks to manage your work and life.",
};
import TaskCP from "@/components/tasks/index";

export default function Task() {
  return (
    <div className="bg-primarydark ">
      <TaskCP />
    </div>
  );
}
