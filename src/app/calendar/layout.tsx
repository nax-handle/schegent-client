import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Calendar",
  description: "Your personal calendar to manage events and tasks.",
};

export default function CalendarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
