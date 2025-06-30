import React from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { TaskCard } from "@/components/tasks/task-card";
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
import type { Task, Calendar } from "@/types";

interface TaskManagerProps {
  handleDragEnd: (result: DropResult) => void;
  getTasksByType: (typeId: string | null) => Task[];
  taskTypes: Calendar[];
  setIsTaskDialogOpen: (isOpen: boolean) => void;
  setSelectedTask: (task: Task) => void;
  setIsEventTypeDialogOpen: (isOpen: boolean) => void;
  setEditingEventType: (eventType: Calendar) => void;
  handleDeleteEventType: (id: string) => void;
  handleDeleteTask: (id: string) => void;
  setCalendarID?: (id: string) => void;
}

export default function TaskManager({
  handleDragEnd,
  getTasksByType,
  taskTypes,
  setCalendarID,
  setIsTaskDialogOpen,
  setSelectedTask,
  setIsEventTypeDialogOpen,
  setEditingEventType,
  handleDeleteEventType,
  handleDeleteTask,
}: TaskManagerProps) {
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
            {taskTypes.map((taskType, columnIndex) => (
              <Draggable
                key={taskType.id}
                draggableId={`column-${taskType.id}`}
                index={columnIndex}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className="dark:bg-primarydark bg-[#fcfdff] border border-gray-200 dark:border-gray-800 rounded-lg p-4 w-full md:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)] xl:w-[calc(25%-1.125rem)] "
                  >
                    <div
                      className="flex items-center justify-between mb-4"
                      {...provided.dragHandleProps}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: taskType.colorId }}
                        />
                        <h2 className="text-lg font-semibold dark:text-white">
                          {taskType.name}
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
                                setEditingEventType(taskType);
                              }, 0);
                            }}
                          >
                            {t("Edit Task")}
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => handleDeleteEventType(taskType.id)}
                            className="text-red-400"
                          >
                            {t("Delete Task")}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <Droppable droppableId={taskType.id ?? ""} type="task">
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.droppableProps}
                          className="space-y-3 min-h-[20px]"
                        >
                          {getTasksByType(taskType.id).map((task, index) => (
                            <Draggable
                              key={task.id}
                              draggableId={String(task.id)}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                >
                                  <TaskCard
                                    task={task}
                                    onEdit={() => {
                                      setSelectedTask(task);
                                      setIsTaskDialogOpen(true);
                                    }}
                                    onDelete={() => handleDeleteTask(task.id)}
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
                        setIsTaskDialogOpen(true);
                        if (setCalendarID) {
                          setCalendarID(taskType.id);
                        }
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t("Add Task")}
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
