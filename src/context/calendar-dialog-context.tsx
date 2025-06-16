"use client";

import React, { createContext, useContext, useState } from "react";
import type { Calendar } from "@/types";

interface CalendarDialogContextType {
  isEventTypeDialogOpen: boolean;
  setIsEventTypeDialogOpen: (open: boolean) => void;
  editingEventType: Calendar | null;
  setEditingEventType: (eventType: Calendar | null) => void;
}

const CalendarDialogContext = createContext<
  CalendarDialogContextType | undefined
>(undefined);

export function CalendarDialogProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isEventTypeDialogOpen, setIsEventTypeDialogOpen] = useState(false);
  const [editingEventType, setEditingEventType] = useState<Calendar | null>(
    null
  );

  return (
    <CalendarDialogContext.Provider
      value={{
        isEventTypeDialogOpen,
        setIsEventTypeDialogOpen,
        editingEventType,
        setEditingEventType,
      }}
    >
      {children}
    </CalendarDialogContext.Provider>
  );
}

export function useCalendarDialog() {
  const context = useContext(CalendarDialogContext);
  if (context === undefined) {
    throw new Error(
      "useCalendarDialog must be used within a CalendarDialogProvider"
    );
  }
  return context;
}
