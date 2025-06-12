import { useMutation, useQuery, useQueries } from "@tanstack/react-query";
import * as events from "@/lib/services/events";
import { SendEvent, ResponseEvent } from "@/types";

// Create a new event
export const useCreateEvent = () => {
  const mutation = useMutation({
    mutationFn: events.createEvent,
  });
  return {
    createEvent: mutation.mutate,
    createEventError: mutation.error,
    isCreatingEvent: mutation.isPending,
    isEventCreated: mutation.isSuccess,
  };
};

//Get all events
export const useGetAllEvents = () => {
  return useQuery({
    queryKey: ["events"],
    queryFn: events.getAllEvents,
    select: (res) => res.data,
  });
};

// Get all events by calendar ID
export const useMultiCalendarEvents = (
  calendarIds: string[],
  calendarBy: string,
  currentDate: string
) => {
  return useQueries({
    queries: calendarIds.map((id) => ({
      queryKey: ["eventsByCalendarId", id, calendarBy, currentDate],
      queryFn: (): Promise<ResponseEvent> =>
        events.getAllEventsByCalendarId(id, calendarBy, currentDate),
      select: (res: ResponseEvent) => res.data,
      enabled: !!id && !!calendarBy && !!currentDate,
    })),
  });
};

// Get detail event by ID
export const useGetDetailEvent = () => {
  return useQuery({
    queryKey: ["eventDetail"],
    queryFn: ({ queryKey }) => {
      const [id] = queryKey;
      return events.getDetailEvents(id as string);
    },
    select: (res) => res.data,
  });
};

// Update an existing event
export const useUpdateEvent = () => {
  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: SendEvent; id: string }) =>
      events.updateEvent(data, id),
  });
  return {
    updateEvent: mutation.mutate,
    updateEventError: mutation.error,
    isUpdatingEvent: mutation.isPending,
    isEventUpdated: mutation.isSuccess,
  };
};

// Delete an existing event
export const useDeleteEvent = () => {
  const mutation = useMutation({
    mutationFn: events.deleteEvent,
  });
  return {
    deleteEvent: mutation.mutate,
    deleteEventError: mutation.error,
    isDeletingEvent: mutation.isPending,
    isEventDeleted: mutation.isSuccess,
  };
};
