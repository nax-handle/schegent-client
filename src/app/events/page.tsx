"use client";
import { useState, useEffect } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { EventCard } from "@/components/events/event-card";
import { EventDialog } from "@/components/events/event-dialog";
import { EventTypeDialog } from "@/components/events/event-type-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Event, Calendar } from "@/types";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import {
  useGetAllCalendars,
  useDeleteCalendar,
} from "@/hooks/calendar/use.calendar";
import { getPriorityColor } from "@/utils";

const initialEvents: Event[] = [
  {
    id: "1",
    title: "Họp team hàng tuần",
    description: "Họp review công việc tuần",
    eventTypeId: "8aa01e9-6916-4fb3-8600-0c67ec1a2557",
    priority: "medium",
    startDate: "2024-12-25",
    startTime: "09:00",
    duration: 60,
    participants: ["Nguyễn Văn A", "Trần Thị B"],
    attachments: ["Thảo luận về tiến độ dự án.pdf"],
    notes: "Thảo luận về tiến độ dự án",
    isRecurring: true,
    recurringType: "weekly",
    reminders: [15, 60],
    status: "accepted",
  },
];

export default function EventManagement() {
  const { t } = useTranslation();
  const [eventTypes, setEventTypes] = useState<Calendar[]>([]);
  const [events, setEvents] = useState<Event[]>(initialEvents);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [isEventTypeDialogOpen, setIsEventTypeDialogOpen] = useState(false);
  const [editingEventType, setEditingEventType] = useState<Calendar | null>(
    null
  );
  const { data, isLoading, error } = useGetAllCalendars();
  const { deleteCalendar } = useDeleteCalendar();

  useEffect(() => {
    if (data) {
      setEventTypes(data);
      console.log("Fetched event types:", data);
      console.log("Color:", data[0]?.colorId);
    }
  }, [data]);

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
    return events.filter((event) => event.eventTypeId === eventTypeId);
  };

  const handleCreateEvent = (eventData: Partial<Event>) => {
    const newEvent: Event = {
      id: Date.now().toString(),
      title: eventData.title || "",
      description: eventData.description || "",
      eventTypeId: eventData.eventTypeId || null,
      priority: eventData.priority || "medium",
      startDate: eventData.startDate || new Date().toISOString().split("T")[0],
      startTime: eventData.startTime || "09:00",
      duration: eventData.duration || 60,
      participants: eventData.participants || [],
      attachments: eventData.attachments || [],
      notes: eventData.notes || "",
      isRecurring: eventData.isRecurring || false,
      recurringType: eventData.recurringType,
      reminders: eventData.reminders || [],
      status: "pending",
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
    setEvents(events.filter((event) => event.eventTypeId !== eventTypeId));
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

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Không thể tải lịch</div>;
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

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="columns" direction="horizontal" type="column">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="flex flex-wrap gap-6 items-start"
              >
                {/* Việc cần làm column */}
                <div className="dark:bg-slate-800 bg-[#fcfdff] border border-gray-200 dark:border-slate-900 rounded-lg p-4 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold dark:text-white">
                      {t("Work to be done")}
                    </h2>
                    {/* menu setting*/}

                    {/*<DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-black hover:bg-gray-200 dark:text-slate-400 dark:hover:text-white dark:hover:bg-slate-700"
                        >
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() => setIsEventDialogOpen(true)}
                        >
                          <span></span>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu> */}
                  </div>

                  <Droppable droppableId="no-type" type="event">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="space-y-3 min-h-[20px] h-auto"
                      >
                        {getEventsByType(null).map((event, index) => (
                          <Draggable
                            key={event.id}
                            draggableId={event.id}
                            index={index}
                          >
                            {(provided) => (
                              <div
                                className="h-fit"
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                              >
                                <EventCard
                                  event={event}
                                  onEdit={() => {
                                    setSelectedEvent(event);
                                    setIsEventDialogOpen(true);
                                  }}
                                  onDelete={() => handleDeleteEvent(event.id)}
                                  getPriorityColor={getPriorityColor}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>

                  <Button
                    variant="ghost"
                    className="w-full mt-3  dark:hover:text-white text-black dark:text-white dark:hover:bg-slate-700 hover:bg-slate-200"
                    onClick={() => setIsEventDialogOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t("Add Event")}
                  </Button>
                </div>

                {/* List Calendar type*/}
                {eventTypes.map((eventType, columnIndex) => (
                  <Draggable
                    key={eventType.id}
                    draggableId={`column-${eventType.id}`}
                    index={columnIndex}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className="dark:bg-slate-800 bg-[#fcfdff] border border-gray-200 rounded-lg p-4 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] "
                      >
                        <div
                          className="flex items-center justify-between mb-4"
                          {...provided.dragHandleProps}
                        >
                          <div className="flex items-center gap-2">
                            <div
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: eventType.colorId }}
                            />
                            <h2 className="text-lg font-semibold dark:text-white">
                              {eventType.name}
                            </h2>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-400 dark:hover:text-white hover:text-black"
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem
                                onClick={() => {
                                  setTimeout(() => {
                                    setIsEventTypeDialogOpen(true);
                                    setEditingEventType(eventType);
                                  }, 0);
                                }}
                              >
                                {t("Edit Event Table")}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  handleDeleteEventType(eventType.id)
                                }
                                className="text-red-400"
                              >
                                {t("Delete Event Table")}
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <Droppable
                          droppableId={eventType.id ?? ""}
                          type="event"
                        >
                          {(provided) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.droppableProps}
                              className="space-y-3 min-h-[20px]"
                            >
                              {getEventsByType(eventType.id).map(
                                (event, index) => (
                                  <Draggable
                                    key={event.id}
                                    draggableId={event.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <div
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                      >
                                        <EventCard
                                          event={event}
                                          onEdit={() => {
                                            setSelectedEvent(event);
                                            setIsEventDialogOpen(true);
                                          }}
                                          onDelete={() =>
                                            handleDeleteEvent(event.id)
                                          }
                                          getPriorityColor={getPriorityColor}
                                        />
                                      </div>
                                    )}
                                  </Draggable>
                                )
                              )}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>

                        <Button
                          variant="ghost"
                          className="w-full mt-3  dark:hover:text-white text-black dark:text-white dark:hover:bg-slate-700 hover:bg-slate-200"
                          onClick={() => setIsEventDialogOpen(true)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          {t("Add Event")}
                        </Button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <EventDialog
          isOpen={isEventDialogOpen}
          onClose={() => {
            setIsEventDialogOpen(false);
            setSelectedEvent(null);
          }}
          onSave={selectedEvent ? handleUpdateEvent : handleCreateEvent}
          event={selectedEvent}
          eventTypes={eventTypes}
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
