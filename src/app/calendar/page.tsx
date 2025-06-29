"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CalendarPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to root since calendar is handled in layout
    router.replace("/");
  }, [router]);

  return null;
}
