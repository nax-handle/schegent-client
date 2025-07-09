import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatbot from "@/lib/services/chatbot";
import * as events from "@/lib/services/events";

export const useSendMessage = () => {
  const mutation = useMutation({
    mutationFn: chatbot.sendMessage,
  });

  return {
    sendMessage: mutation.mutate,
    sendMessageAsync: mutation.mutateAsync,
    messageError: mutation.error,
    isSending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    data: mutation.data,
  };
};

export const useActionEvents = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: events.actionEvents,
    onSuccess: (data) => {
      console.log("✅ Events created successfully:", data);

      // Invalidate all event-related queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ["events"] });
      queryClient.invalidateQueries({ queryKey: ["eventsByCalendarId"] });
      queryClient.invalidateQueries({ queryKey: ["reminderEvents"] });

      console.log("🔄 Query cache invalidated");
    },
    onError: (error) => {
      console.error("❌ Failed to create events:", error);
    },
  });

  return {
    createEvents: mutation.mutate,
    createEventsAsync: mutation.mutateAsync,
    createError: mutation.error,
    isCreating: mutation.isPending,
    isSuccess: mutation.isSuccess,
  };
};
