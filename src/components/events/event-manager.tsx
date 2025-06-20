import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { EventCard } from "@/components/events/event-card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Plus, MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { getPriorityColor } from "@/utils";
import type { Event, Calendar } from "@/types";

interface EventManagerProps {
  handleDragEnd: (result: DropResult) => void;
  getEventsByType: (typeId: string | null) => Event[];
  eventTypes: Calendar[];
  setIsEventDialogOpen: (isOpen: boolean) => void;
  setSelectedEvent: (event: Event) => void;
  setIsEventTypeDialogOpen: (isOpen: boolean) => void;
  setEditingEventType: (eventType: Calendar) => void;
  handleDeleteEventType: (id: string) => void;
  handleDeleteEvent: (id: string) => void;
  setCalendarID?: (id: string) => void;
}
export default function EventManager({
  handleDragEnd,
  getEventsByType,
  eventTypes,
  setCalendarID,
  setIsEventDialogOpen,
  setSelectedEvent,
  setIsEventTypeDialogOpen,
  setEditingEventType,
  handleDeleteEventType,
  handleDeleteEvent,
}: EventManagerProps) {
  const { t } = useTranslation();

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="columns" direction="horizontal" type="column">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-wrap gap-6 items-start"
          >
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
                            onClick={() => handleDeleteEventType(eventType.id)}
                            className="text-red-400"
                          >
                            {t("Delete Event Table")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {/* event card  */}
                    <Droppable droppableId={eventType.id ?? ""} type="event">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-3 min-h-[20px]"
                        >
                          {getEventsByType(eventType.id).map((event, index) => (
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
                      onClick={() => {
                        setIsEventDialogOpen(true);
                        if (setCalendarID) {
                          setCalendarID(eventType.id);
                        }
                      }}
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
  );
}
