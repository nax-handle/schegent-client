"use client";
import { useState, useEffect } from "react";
import { DropResult } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventDialog } from "@/components/events/event-dialog";
import { EventTypeDialog } from "@/components/events/calendar-dialog";
import type { Event, Calendar, SendEvent } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import {
  useGetAllCalendars,
  useDeleteCalendar,
} from "@/hooks/calendar/use.calendar";
import EventManager from "@/components/events/event-manager";
import { useGetAllEvents } from "@/hooks/calendar/use.events";

export default function EventManagement() {
  const { t } = useTranslation();
  const [eventTypes, setEventTypes] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [calendarID, setCalendarID] = useState<string>("");
  const [isEventTypeDialogOpen, setIsEventTypeDialogOpen] = useState(false);
  const { data, isLoading } = useGetAllCalendars();
  const { data: dataEvents, isLoading: loadingEvents } = useGetAllEvents();

  const { deleteCalendar } = useDeleteCalendar();
  const [editingEventType, setEditingEventType] = useState<Calendar | null>(
    null
  );

  useEffect(() => {
    if (data) {
      setEventTypes(data);
    }
    if (dataEvents) {
      setEvents(dataEvents);
    }
  }, [data, dataEvents]);

  const handleDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    if (type === "column") {
      if (source.index === destination.index) return;

      const newEventTypes = Array.from(eventTypes);
      const [removed] = newEventTypes.splice(source.index, 1);
      newEventTypes.splice(destination.index, 0, removed);

      setEventTypes(newEventTypes);
      return;
    }

    if (source.droppableId !== destination.droppableId) {
      const newEventTypeId =
        destination.droppableId === "no-type" ? null : destination.droppableId;

      setEvents(
        events.map((event) =>
          event.id === draggableId
            ? { ...event, eventTypeId: newEventTypeId }
            : event
        )
      );
    }
  };

  const getEventsByType = (eventTypeId: string | null) => {
    return events.filter((event) => event.calendarId === eventTypeId);
  };

  const handleCreateEvent = (eventData: Partial<SendEvent>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title || "",
      description: eventData.description || "",
      location: eventData.location || null,
      startTime: eventData.startTime || new Date().toISOString(),
      endTime: eventData.endTime || new Date().toISOString(),
      hangoutLink: eventData.hangoutLink || null,
      recurrence: eventData.recurrence || "",
      icon: eventData.icon || null,
      visibility: eventData.visibility || "default",
      status: eventData.status || "confirmed",
      priority: eventData.priority || "medium",
      eventCategory: eventData.eventCategory || "general",
      colorId: eventData.colorId || "bg-gray-500",
      isAllDay: eventData.isAllDay || false,
      calendarId: calendarID || "",
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (eventData: Partial<Event>) => {
    if (!selectedEvent) return;

    setEvents(
      events.map((event) =>
        event.id === selectedEvent.id ? { ...event, ...eventData } : event
      )
    );
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter((event) => event.id !== eventId));
  };

  const handleDeleteEventType = (eventTypeId: string) => {
    setEvents(events.filter((event) => event.id !== eventTypeId));
    setEventTypes(eventTypes.filter((type) => type.id !== eventTypeId));
    deleteCalendar(eventTypeId);
  };

  const handleCreateEventType = (eventTypeData: Partial<Calendar>) => {
    const newEventType: Calendar = {
      id: Date.now().toString(),
      name: eventTypeData.name || "",
      colorId: eventTypeData.colorId || "bg-gray-500",
      description: eventTypeData.description || "",
      isPrimary: eventTypeData.isPrimary || false,
      isShared: eventTypeData.isShared || false,
    };
    setEventTypes([...eventTypes, newEventType]);
  };

  const handleUpdateEventType = (eventTypeData: Partial<Calendar>) => {
    if (!editingEventType) return;

    setEventTypes(
      eventTypes.map((type) =>
        type.id === editingEventType.id ? { ...type, ...eventTypeData } : type
      )
    );
    setEditingEventType(null);
  };

  if (isLoading || loadingEvents) {
    return <div>Đang tải dữ liệu...</div>;
  }
  if (!eventTypes) return <div>Không có thông tin lịch</div>;

  return (
    <div
      className=" p-6 overflow-y-scroll scrollbar-hidden border-none dark:bg-slate-900 bg-slate-50 "
      style={{ height: "calc(100vh - 85px)" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="md:flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold dark:text-white text-black">
              {t("Event Management")}
            </h1>
            <p className="dark:text-white text-black mt-2">
              {t("Manage your events and event types efficiently.")}
            </p>
          </div>
          <Button
            variant={"decorate"}
            onClick={() => setIsEventTypeDialogOpen(true)}
            className="w-fit dark:text-white "
          >
            <Plus className="w-4 h-4 mr-2 dark:text-white" />
            {t("Add Event Type")}
          </Button>
        </div>

        <EventManager
          setCalendarID={setCalendarID}
          handleDragEnd={handleDragEnd}
          getEventsByType={getEventsByType}
          eventTypes={eventTypes}
          setIsEventDialogOpen={setIsEventDialogOpen}
          setSelectedEvent={setSelectedEvent}
          setIsEventTypeDialogOpen={setIsEventTypeDialogOpen}
          setEditingEventType={setEditingEventType}
          handleDeleteEventType={handleDeleteEventType}
          handleDeleteEvent={handleDeleteEvent}
        />

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
