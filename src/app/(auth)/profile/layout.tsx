import type React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "User Profile",
  description: "View and edit your profile information",
};

export default function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen">{children}</div>;
}
