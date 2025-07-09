import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tasks",
  description: "Your personal tasks to manage your work and life.",
};

export default function TaskLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
