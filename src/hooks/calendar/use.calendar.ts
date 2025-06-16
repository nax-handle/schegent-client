import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as calendar from "@/lib/services/calendar";
import { SendCalendar } from "@/types";

// Create a new calendar
export const useCreateCalendar = () => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: SendCalendar) => {
      console.log("Creating calendar with data:", data);
      return calendar.createCalendar(data);
    },
    onMutate: async (newCalendar) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["calendars"] });

      // Snapshot the previous value
      const previousCalendars = queryClient.getQueryData(["calendars"]);

      // Optimistically update to the new value
      queryClient.setQueryData(["calendars"], (old: any) => {
        const newData = {
          ...old,
          data: [
            ...(old?.data || []),
            { ...newCalendar, id: Date.now().toString() },
          ],
        };
        return newData;
      });

      // Return a context object with the snapshotted value
      return { previousCalendars };
    },
    onError: (err, newCalendar, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousCalendars) {
        queryClient.setQueryData(["calendars"], context.previousCalendars);
      }
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ data, id }: { data: SendCalendar; id: string }) =>
      calendar.updateCalendar(data, id),
    onMutate: async ({ data, id }) => {
      await queryClient.cancelQueries({ queryKey: ["calendars"] });
      const previousCalendars = queryClient.getQueryData(["calendars"]);

      queryClient.setQueryData(["calendars"], (old: any) => {
        const newData = {
          ...old,
          data: old?.data.map((calendar: any) =>
            calendar.id === id ? { ...calendar, ...data } : calendar
          ),
        };
        return newData;
      });

      return { previousCalendars };
    },
    onError: (err, variables, context) => {
      if (context?.previousCalendars) {
        queryClient.setQueryData(["calendars"], context.previousCalendars);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
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
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: calendar.deleteCalendar,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendars"] });
    },
  });
  return {
    deleteCalendar: mutation.mutate,
    deleteCalendarError: mutation.error,
    isDeletingCalendar: mutation.isPending,
    isCalendarDeleted: mutation.isSuccess,
  };
};
