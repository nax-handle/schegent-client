"use client";

import { useState, useEffect } from "react";
import Day from "./day";
import Week from "./week";
import Month from "./month";
import NavMenu from "@/components/header-nav/nav-menu";
type CalendarView = "day" | "week" | "month";
import {
  useMultiCalendarEvents,
  useDeleteEvent,
} from "@/hooks/calendar/use.events";
import { Event, SendEvent, Calendar } from "@/types";
import { EventDialog } from "@/components/events/event-dialog";
import {
  useUpdateCalendar,
  useCreateCalendar,
} from "@/hooks/calendar/use.calendar";
import { EventTypeDialog } from "@/components/events/calendar-dialog";
import { useCalendarDialog } from "@/context/calendar-dialog-context";

export default function CalendarPage({
  checked,
  calendarID,
  isEventDialogOpen,
  setIsEventDialogOpen,
  setCurrentView,
  currentView,
}: {
  checked: string[];
  calendarID: string;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  setCurrentView?: (view: CalendarView) => void;
  currentView?: CalendarView;
}) {
  const [internalView, setInternalView] = useState<CalendarView>("day");
  const view = currentView ?? internalView;
  const setView = setCurrentView ?? setInternalView;
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const navigateToPrevious = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "day":
        newDate.setDate(currentDate.getDate() - 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() - 7);
        break;
      case "month":
        newDate.setMonth(currentDate.getMonth() - 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateToNext = () => {
    const newDate = new Date(currentDate);
    switch (view) {
      case "day":
        newDate.setDate(currentDate.getDate() + 1);
        break;
      case "week":
        newDate.setDate(currentDate.getDate() + 7);
        break;
      case "month":
        newDate.setMonth(currentDate.getMonth() + 1);
        break;
    }
    setCurrentDate(newDate);
  };

  const navigateToToday = () => {
    setCurrentDate(new Date());
  };

  const navigateToDate = (date: Date) => {
    setCurrentDate(date);
  };

  const { deleteEvent, deleteEventError } = useDeleteEvent();

  const { updateCalendar } = useUpdateCalendar();
  const { createCalendar } = useCreateCalendar();
  const {
    isEventTypeDialogOpen,
    setIsEventTypeDialogOpen,
    editingEventType,
    setEditingEventType,
  } = useCalendarDialog();

  const currentDateString = currentDate.toLocaleDateString("en-CA");
  const [events, setEvents] = useState<Event[] | null>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [, setSelectedCalendarID] = useState<string>("");

  const queryResults = useMultiCalendarEvents(checked, view, currentDateString);

  const data = queryResults.map((result) => result.data).filter(Boolean);

  useEffect(() => {
    const mergedEvents = data
      .flat()
      .filter((event): event is Event => event !== undefined);

    const mergedIds = mergedEvents
      .map((e) => e.id)
      .sort()
      .join(",");
    const currentIds = (events || [])
      .map((e) => e.id)
      .sort()
      .join(",");

    if (mergedIds !== currentIds) {
      setEvents(mergedEvents);
    }
  }, [data, events]);

  const handleCreateEvent = (eventData: Partial<SendEvent>) => {
    if (typeof eventData.title === "string") {
      console.log("Event created successfully, React Query will refresh data");
    } else {
      console.error("Event title is required");
    }
  };

  const handleUpdateEvent = () => {
    if (!selectedEvent) return;
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    deleteEvent(eventId);
  };

  useEffect(() => {
    if (deleteEventError) {
      console.error("Failed to delete event:", deleteEventError);
    }
  }, [deleteEventError]);

  const handleCreateEventType = (eventTypeData: Partial<Calendar>) => {
    if (typeof eventTypeData.name === "string") {
      createCalendar({
        ...eventTypeData,
        name: eventTypeData.name,
        description: eventTypeData.description ?? "",
        colorId: eventTypeData.colorId ?? "",
        isPrimary: eventTypeData.isPrimary ?? false,
        isShared: eventTypeData.isShared ?? false,
      } as { name: string; description: string; colorId: string; isPrimary: boolean; isShared: boolean } & Partial<Calendar>);
      setIsEventTypeDialogOpen(false);
    } else {
      console.error("Event type name is required");
    }
  };

  const handleUpdateEventType = (eventTypeData: Partial<Calendar>) => {
    if (!editingEventType) return;
    updateCalendar({
      id: editingEventType.id,
      data: {
        ...editingEventType,
        ...eventTypeData,
      },
    });
    setEditingEventType(null);
    setIsEventTypeDialogOpen(false);
  };

  return (
    <div className="w-full sm:mt-0 mt-4">
      <NavMenu
        currentView={view}
        setCurrentView={setView}
        currentDate={currentDate}
        onNavigatePrevious={navigateToPrevious}
        onNavigateNext={navigateToNext}
        onNavigateToday={navigateToToday}
        onNavigateToDate={navigateToDate}
      />
      <div className={`flex`}>
        <div className={`flex-1`}>
          {view === "day" && (
            <Day
              eventsData={events ?? []}
              setCalendarID={setSelectedCalendarID}
              setIsEventDialogOpen={setIsEventDialogOpen}
              handleUpdateEvent={handleUpdateEvent}
              setSelectedEvent={setSelectedEvent}
              handleDeleteEvent={handleDeleteEvent}
              currentDate={currentDate}
            />
          )}
          {view === "week" && (
            <Week
              eventsdata={events ?? []}
              setCalendarID={setSelectedCalendarID}
              setIsEventDialogOpen={setIsEventDialogOpen}
              handleUpdateEvent={handleUpdateEvent}
              setSelectedEvent={setSelectedEvent}
              handleDeleteEvent={handleDeleteEvent}
              currentDate={currentDate}
            />
          )}
          {view === "month" && (
            <Month
              eventsdata={events ?? []}
              currentDate={currentDate}
              setSelectedEvent={setSelectedEvent}
              setIsEventDialogOpen={setIsEventDialogOpen}
              onChangeMonth={setCurrentDate}
              onSelectDay={(date) => {
                setCurrentDate(date);
                setView("day");
              }}
            />
          )}
        </div>
        <EventDialog
          calendarID={calendarID}
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          event={selectedEvent}
        />
        <EventTypeDialog
          isOpen={isEventTypeDialogOpen}
          onClose={() => {
            setIsEventTypeDialogOpen(false);
            setEditingEventType(null);
          }}
          eventType={editingEventType}
          handleCreateEventType={handleCreateEventType}
          handleUpdateEventType={handleUpdateEventType}
        />
      </div>
    </div>
  );
}
