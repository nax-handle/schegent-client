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
  useUpdateEvent,
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
  selectedCalendarColor,
}: {
  checked: string[];
  calendarID: string;
  isEventDialogOpen: boolean;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  selectedCalendarColor: string;
}) {
  const [currentView, setCurrentView] = useState<CalendarView>("day");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  useEffect(() => {
    const storedView = localStorage.getItem("currentView") as CalendarView;
    if (storedView) setCurrentView(storedView);
  }, []);

  useEffect(() => {
    localStorage.setItem("currentView", currentView);
  }, [currentView]);

  // Navigation functions
  const navigateToPrevious = () => {
    const newDate = new Date(currentDate);
    switch (currentView) {
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
    switch (currentView) {
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

  const { deleteEvent, deleteEventError } = useDeleteEvent();
  const { updateEvent: updateEventAPI, updateEventError } = useUpdateEvent();

  const { updateCalendar } = useUpdateCalendar();
  const { createCalendar } = useCreateCalendar();
  const {
    isEventTypeDialogOpen,
    setIsEventTypeDialogOpen,
    editingEventType,
    setEditingEventType,
  } = useCalendarDialog();

  const currentDateString = currentDate.toISOString().split("T")[0];
  const [events, setEvents] = useState<Event[] | null>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [, setSelectedCalendarID] = useState<string>("");
  const [optimisticUpdates, setOptimisticUpdates] = useState<
    Map<string, Event>
  >(new Map());

  const queryResults = useMultiCalendarEvents(
    checked,
    currentView,
    currentDateString
  );

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
      const newEvent: Event = {
        id: Date.now().toString(),
        title: eventData.title,
        description: eventData.description ?? "",
        location: eventData.location ?? null,
        startTime: eventData.startTime ?? new Date().toISOString(),
        endTime: eventData.endTime ?? new Date().toISOString(),
        hangoutLink: eventData.hangoutLink ?? null,
        recurrence: eventData.recurrence ?? "",
        icon: eventData.icon ?? null,
        visibility: eventData.visibility ?? "default",
        status: eventData.status ?? "confirmed",
        priority: eventData.priority ?? "medium",
        eventCategory: eventData.eventCategory ?? "general",
        colorId: eventData.colorId ?? "",
        isAllDay: eventData.isAllDay ?? false,
        calendarId: calendarID,
      };

      setEvents((prevEvents) => [...(prevEvents || []), newEvent]);
      setIsEventDialogOpen(false);
    } else {
      console.error("Event title is required");
    }
  };

  const handleUpdateEvent = (eventData: Partial<Event>) => {
    if (!selectedEvent) return;

    const originalEvent = events?.find((e) => e.id === selectedEvent.id);
    if (originalEvent) {
      setOptimisticUpdates(
        (prev) => new Map(prev.set(selectedEvent.id, originalEvent))
      );
    }

    setEvents((prevEvents) => {
      if (!prevEvents) return prevEvents;
      return prevEvents.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...eventData } : event
      );
    });

    updateEventAPI({
      id: selectedEvent.id,
      data: {
        ...selectedEvent,
        ...eventData,
      } as SendEvent,
    });

    setSelectedEvent(null);
  };

  useEffect(() => {
    if (updateEventError) {
      setEvents((prevEvents) => {
        if (!prevEvents) return prevEvents;
        return prevEvents.map((event) => {
          const originalEvent = optimisticUpdates.get(event.id);
          return originalEvent || event;
        });
      });
      setOptimisticUpdates(new Map());
    }
  }, [updateEventError, optimisticUpdates]);

  const handleDeleteEvent = (eventId: string) => {
    // Optimistic update - remove from local state immediately
    setEvents((prevEvents) => {
      if (!prevEvents) return prevEvents;
      return prevEvents.filter((event) => event.id !== eventId);
    });

    // Call API to delete
    deleteEvent(eventId);
  };

  // Handle delete error - restore the event if deletion failed
  useEffect(() => {
    if (deleteEventError) {
      console.error("Failed to delete event:", deleteEventError);
      // The query invalidation will restore the event from server data
    }
  }, [deleteEventError]);

  const handleOptimisticUpdate = (eventId: string, updatedEvent: Event) => {
    setEvents((prevEvents) => {
      if (!prevEvents) return prevEvents;
      return prevEvents.map((event) =>
        event.id === eventId ? updatedEvent : event
      );
    });
  };

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
    <div className="w-full">
      <NavMenu
        currentView={currentView}
        setCurrentView={setCurrentView}
        currentDate={currentDate}
        onNavigatePrevious={navigateToPrevious}
        onNavigateNext={navigateToNext}
        onNavigateToday={navigateToToday}
      />
      <div className={`flex`}>
        <div className={`flex-1  mr-1 `}>
          {currentView === "day" && (
            <Day
              eventsData={events ?? []}
              setCalendarID={setSelectedCalendarID}
              setIsEventDialogOpen={setIsEventDialogOpen}
              handleUpdateEvent={handleUpdateEvent}
              setSelectedEvent={setSelectedEvent}
              handleDeleteEvent={handleDeleteEvent}
              onOptimisticUpdate={handleOptimisticUpdate}
              currentDate={currentDate}
            />
          )}
          {currentView === "week" && (
            <Week
              eventsdata={events ?? []}
              setCalendarID={setSelectedCalendarID}
              setIsEventDialogOpen={setIsEventDialogOpen}
              handleUpdateEvent={handleUpdateEvent}
              setSelectedEvent={setSelectedEvent}
              handleDeleteEvent={handleDeleteEvent}
              onOptimisticUpdate={handleOptimisticUpdate}
              currentDate={currentDate}
            />
          )}
          {currentView === "month" && (
            <Month
              eventsdata={events ?? []}
              currentDate={currentDate}
              setSelectedEvent={setSelectedEvent}
              setIsEventDialogOpen={setIsEventDialogOpen}
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
          colorId={selectedCalendarColor}
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
