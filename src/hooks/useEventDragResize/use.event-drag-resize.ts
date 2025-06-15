// src/hooks/useEventDragResize.ts
import { useCallback } from "react";
import type { Event } from "@/types";

type UpdateEvent = (params: { id: string; data: Event }) => void;

export function useEventDragResize({
  updateEvent,
}: {
  updateEvent: UpdateEvent;
}) {
  const handleMouseDownResize = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const startY = e.clientY;
      const initialEndTime = new Date(event.endTime);
      const eventBlock = e.currentTarget.parentElement;
      const container = eventBlock?.closest(".overflow-y-scroll");
      let scrollInterval: NodeJS.Timeout | null = null;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diffY = moveEvent.clientY - startY;
        const minutesDiff = Math.round((diffY / 65) * 60);
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
          const height = (duration / (1000 * 60)) * (65 / 60);
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
        const minutesDiff = Math.round((diffY / 65) * 60);
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

        window.location.reload();
        if (scrollInterval) clearInterval(scrollInterval);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateEvent]
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
      const container = eventBlock.closest(".overflow-y-scroll");
      let scrollInterval: NodeJS.Timeout | null = null;

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diffY = moveEvent.clientY - startY;
        const minutesDiff = Math.round((diffY / 65) * 60);

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
          newStart.getHours() * 65 + (newStart.getMinutes() / 60) * 65;
        const height = (duration / (1000 * 60)) * (65 / 60);

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
        const minutesDiff = Math.round((diffY / 65) * 60);

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

        window.location.reload();
        if (scrollInterval) clearInterval(scrollInterval);
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateEvent]
  );

  const handleMouseDownDragToOtherDay = useCallback(
    (e: React.MouseEvent<HTMLDivElement>, event: Event) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
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

      let lastColumn = currentDayIndex;
      let lastTop = initialStart.getHours() * 65 + (initialStart.getMinutes() / 60) * 65;

      // Set initial position
      if (eventBlock.parentElement) {
        const el = eventBlock.parentElement as HTMLDivElement;
        el.style.transform = `translate(${currentDayIndex * columnWidth}px, ${lastTop}px)`;
        el.style.transition = 'none';
      }

      const onMouseMove = (moveEvent: MouseEvent) => {
        const diffX = moveEvent.clientX - startX;
        const diffY = moveEvent.clientY - startY;
        
        // Calculate the target column based on mouse position
        const targetColumn = Math.floor(diffX / columnWidth);
        const minutesMoved = Math.round((diffY / 65) * 60);

        // Calculate new position
        const newStart = new Date(initialStart);
        newStart.setDate(initialStart.getDate() + targetColumn);
        newStart.setMinutes(initialStart.getMinutes() + minutesMoved);
        const newEnd = new Date(newStart.getTime() + duration);

        const top = newStart.getHours() * 65 + (newStart.getMinutes() / 60) * 65;
        const left = targetColumn * columnWidth;

        if (eventBlock.parentElement) {
          const el = eventBlock.parentElement as HTMLDivElement;
          el.style.transform = `translate(${left}px, ${top}px)`;
        }

        lastColumn = targetColumn;
        lastTop = top;
      };

      const onMouseUp = (upEvent: MouseEvent) => {
        const diffX = upEvent.clientX - startX;
        const diffY = upEvent.clientY - startY;
        
        // Calculate final position
        const targetColumn = Math.floor(diffX / columnWidth);
        const minutesMoved = Math.round((diffY / 65) * 60);

        const newStart = new Date(initialStart);
        newStart.setDate(initialStart.getDate() + targetColumn);
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

        if (eventBlock.parentElement) {
          const el = eventBlock.parentElement as HTMLDivElement;
          el.style.transform = '';
          el.style.transition = '';
        }

        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);

        // Reload the page after dropping
        window.location.reload();
      };

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    },
    [updateEvent]
  );

  return {
    handleMouseDownResize,
    handleMouseDownMoveBlock,
    handleMouseDownDragToOtherDay,
  };
}
