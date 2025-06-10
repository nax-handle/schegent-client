import { useMutation, useQuery } from "@tanstack/react-query";
import * as calendar from "@/lib/services/calendar";
import { SendCalendar } from "@/types";

// Create a new calendar
export const useCreateCalendar = () => {
  const mutation = useMutation({
    mutationFn: calendar.createCalendar,
  });
  return {
    createCalendar: mutation.mutate,
    createCalendarError: mutation.error,
    isCreatingCalendar: mutation.isPending,
    isCalendarCreated: mutation.isSuccess,
  };
};

//Get all calendars
export const useGetAllCalendars = () => {
  return useQuery({
    queryKey: ["calendars"],
    queryFn: calendar.getAllCalendars,
    select: (res) => res.data,
  });
};

// Update an existing calendar
export const useUpdateCalendar = () => {
  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: SendCalendar; id: string }) =>
      calendar.updateCalendar(data, id),
  });
  return {
    updateCalendar: mutation.mutate,
    updateCalendarError: mutation.error,
    isUpdatingCalendar: mutation.isPending,
    isCalendarUpdated: mutation.isSuccess,
  };
};

// Delete an existing calendar
export const useDeleteCalendar = () => {
  const mutation = useMutation({
    mutationFn: calendar.deleteCalendar,
  });
  return {
    deleteCalendar: mutation.mutate,
    deleteCalendarError: mutation.error,
    isDeletingCalendar: mutation.isPending,
    isCalendarDeleted: mutation.isSuccess,
  };
};
