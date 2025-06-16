// src/hooks/useEventDragResize.ts
import { useCallback, useState } from "react";
import type { Event } from "@/types";

function clamp(num: number, min: number, max: number) {
  return Math.max(min, Math.min(num, max));
}

type UpdateEvent = (params: { id: string; data: Event }) => void;

// Constants for different views
const HOUR_HEIGHT = {
  day: 65,
  week: 56,
};

export function useEventDragResize({
  updateEvent,
  view = "week",
  onUpdate,
}: {
  updateEvent: UpdateEvent;
  view?: "day" | "week";
  onUpdate?: () => void;
}) {
  const [dragIndicator, setDragIndicator] = useState<{
    top: number;
    column: number;
  } | null>(null);
  const hourHeight = HOUR_HEIGHT[view];

  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = e.clientY;
      const initialEndTime = new Date(event.endTime);
      const eventBlock = e.currentTarget.parentElement;
      const container = eventBlock?.closest(".overflow-y-auto");
      let scrollInterval: NodeJS.Timeout | null = null;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diffY = moveEvent.clientY - startY;
        const minutesDiff = Math.round((diffY / hourHeight) * 60);
        const newEndTime = new Date(initialEndTime);
        newEndTime.setMinutes(initialEndTime.getMinutes() + minutesDiff);

        const maxTime = new Date(initialEndTime);
        maxTime.setHours(23, 59, 59, 999);
        const startTime = new Date(event.startTime);

        if (newEndTime > maxTime) newEndTime.setTime(maxTime.getTime());
        if (newEndTime <= startTime)
          newEndTime.setTime(startTime.getTime() + 60000);

        if (eventBlock) {
          const duration = newEndTime.getTime() - startTime.getTime();
          const height = (duration / (1000 * 60)) * (hourHeight / 60);
          eventBlock.style.height = `${height}px`;
        }

        if (container) {
          const containerRect = container.getBoundingClientRect();
          const mouseY = moveEvent.clientY;
          const scrollThreshold = 50;

          if (mouseY > containerRect.bottom - scrollThreshold) {
            if (!scrollInterval) {
              scrollInterval = setInterval(() => {
                container.scrollTop += 10;
              }, 16);
            }
          } else {
            if (scrollInterval) {
              clearInterval(scrollInterval);
              scrollInterval = null;
            }
          }
        }
      };

      const onMouseUp = (upEvent: MouseEvent) => {
        const diffY = upEvent.clientY - startY;
        const minutesDiff = Math.round((diffY / hourHeight) * 60);
        const newEndTime = new Date(initialEndTime);
        newEndTime.setMinutes(initialEndTime.getMinutes() + minutesDiff);

        const maxTime = new Date(initialEndTime);
        maxTime.setHours(23, 59, 59, 999);
        const startTime = new Date(event.startTime);

        if (newEndTime > maxTime) newEndTime.setTime(maxTime.getTime());
        if (newEndTime <= startTime)
          newEndTime.setTime(startTime.getTime() + 60000);

        updateEvent({
          id: event.id,
          data: {
            ...event,
            endTime: newEndTime.toISOString(),
          },
        });

        onUpdate?.();

        if (scrollInterval) clearInterval(scrollInterval);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateEvent, hourHeight, view, onUpdate]
  );

  const handleMouseDownMoveBlock = useCallback(
    (e: React.MouseEvent<HTMLSpanElement>, event: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = e.clientY;
      const initialStart = new Date(event.startTime);
      const initialEnd = new Date(event.endTime);
      const duration = initialEnd.getTime() - initialStart.getTime();
      const eventBlock = e.currentTarget;
      const container = eventBlock.closest(".overflow-y-auto");
      let scrollInterval: NodeJS.Timeout | null = null;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diffY = moveEvent.clientY - startY;
        const minutesDiff = Math.round((diffY / hourHeight) * 60);

        const newStart = new Date(initialStart);
        newStart.setMinutes(initialStart.getMinutes() + minutesDiff);
        const newEnd = new Date(newStart.getTime() + duration);

        const minTime = new Date(initialStart);
        minTime.setHours(0, 0, 0, 0);
        const maxTime = new Date(initialEnd);
        maxTime.setHours(23, 59, 59, 999);

        if (newStart < minTime) {
          const diff = minTime.getTime() - newStart.getTime();
          newStart.setTime(minTime.getTime());
          newEnd.setTime(newEnd.getTime() + diff);
        }

        if (newEnd > maxTime) {
          const diff = newEnd.getTime() - maxTime.getTime();
          newEnd.setTime(maxTime.getTime());
          newStart.setTime(newStart.getTime() - diff);
        }

        const top =
          newStart.getHours() * hourHeight +
          (newStart.getMinutes() / 60) * hourHeight;
        const height = (duration / (1000 * 60)) * (hourHeight / 60);

        if (eventBlock && eventBlock.parentElement) {
          const parent = eventBlock.parentElement as HTMLDivElement;
          parent.style.top = `${top}px`;
          parent.style.height = `${height}px`;
        }

        if (container) {
          const containerRect = container.getBoundingClientRect();
          const mouseY = moveEvent.clientY;
          const scrollThreshold = 50;

          if (mouseY < containerRect.top + scrollThreshold) {
            if (!scrollInterval) {
              scrollInterval = setInterval(() => {
                container.scrollTop -= 10;
              }, 16);
            }
          } else if (mouseY > containerRect.bottom - scrollThreshold) {
            if (!scrollInterval) {
              scrollInterval = setInterval(() => {
                container.scrollTop += 10;
              }, 16);
            }
          } else {
            if (scrollInterval) {
              clearInterval(scrollInterval);
              scrollInterval = null;
            }
          }
        }
      };

      const onMouseUp = (upEvent: MouseEvent) => {
        const diffY = upEvent.clientY - startY;
        const minutesDiff = Math.round((diffY / hourHeight) * 60);

        const newStart = new Date(initialStart);
        newStart.setMinutes(initialStart.getMinutes() + minutesDiff);
        const newEnd = new Date(newStart.getTime() + duration);

        const minTime = new Date(initialStart);
        minTime.setHours(0, 0, 0, 0);
        const maxTime = new Date(initialEnd);
        maxTime.setHours(23, 59, 59, 999);

        if (newStart < minTime) {
          const diff = minTime.getTime() - newStart.getTime();
          newStart.setTime(minTime.getTime());
          newEnd.setTime(newEnd.getTime() + diff);
        }

        if (newEnd > maxTime) {
          const diff = newEnd.getTime() - maxTime.getTime();
          newEnd.setTime(maxTime.getTime());
          newStart.setTime(newStart.getTime() - diff);
        }

        updateEvent({
          id: event.id,
          data: {
            ...event,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString(),
          },
        });

        onUpdate?.();

        if (scrollInterval) clearInterval(scrollInterval);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateEvent, hourHeight, view, onUpdate]
  );

  const handleMouseDownDragToOtherDay = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = e.clientY;
      const initialStart = new Date(event.startTime);
      const initialEnd = new Date(event.endTime);
      const duration = initialEnd.getTime() - initialStart.getTime();
      const eventBlock = e.currentTarget;

      const parent = eventBlock.closest(".grid-cols-7") as HTMLDivElement;
      if (!parent) return;

      const columns = Array.from(parent.children);
      const currentDayIndex = columns.findIndex((col) =>
        col.contains(eventBlock.parentElement)
      );
      const columnWidth = columns[0]?.getBoundingClientRect().width || 100;

      const initialTop =
        initialStart.getHours() * hourHeight +
        (initialStart.getMinutes() / 60) * hourHeight;
      const initialLeft = currentDayIndex * columnWidth;

      if (eventBlock.parentElement) {
        const el = eventBlock.parentElement as HTMLDivElement;
        el.style.transform = `translate(${initialLeft}px, ${initialTop}px)`;
        el.style.transition = "none";
        el.style.opacity = "0";
      }

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diffY = moveEvent.clientY - startY;

        const gridRect = parent.getBoundingClientRect();
        const relativeX = moveEvent.clientX - gridRect.left;
        let targetColumn = Math.floor(relativeX / columnWidth);
        targetColumn = clamp(targetColumn, 0, 6);
        const minutesMoved = Math.round((diffY / hourHeight) * 60);

        const newStart = new Date(initialStart);
        newStart.setDate(
          initialStart.getDate() + (targetColumn - currentDayIndex)
        );
        newStart.setMinutes(initialStart.getMinutes() + minutesMoved);
        const newEnd = new Date(newStart.getTime() + duration);

        const top =
          newStart.getHours() * hourHeight +
          (newStart.getMinutes() / 60) * hourHeight;

        updateEvent({
          id: event.id,
          data: {
            ...event,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString(),
          },
        });

        setDragIndicator({ top, column: targetColumn });
      };

      const onMouseUp = (upEvent: MouseEvent) => {
        const diffY = upEvent.clientY - startY;

        const gridRect = parent.getBoundingClientRect();
        const relativeX = upEvent.clientX - gridRect.left;
        let targetColumn = Math.floor(relativeX / columnWidth);
        targetColumn = clamp(targetColumn, 0, 6);
        const minutesMoved = Math.round((diffY / hourHeight) * 60);

        const newStart = new Date(initialStart);
        newStart.setDate(
          initialStart.getDate() + (targetColumn - currentDayIndex)
        );
        newStart.setMinutes(initialStart.getMinutes() + minutesMoved);
        const newEnd = new Date(newStart.getTime() + duration);

        updateEvent({
          id: event.id,
          data: {
            ...event,
            startTime: newStart.toISOString(),
            endTime: newEnd.toISOString(),
          },
        });

        onUpdate?.();

        if (eventBlock.parentElement) {
          const el = eventBlock.parentElement as HTMLDivElement;
          el.style.opacity = "1";
          el.style.transform = "";
          el.style.transition = "";
        }

        setDragIndicator(null);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateEvent, hourHeight, view, onUpdate]
  );

  return {
    handleMouseDownResize,
    handleMouseDownMoveBlock,
    handleMouseDownDragToOtherDay,
    dragIndicator,
  };
}
