import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as chatbot from "@/lib/services/chatbot";
import * as events from "@/lib/services/events";
import type { SendEvent } from "@/types";

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

export const useCreateMultipleEvents = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: events.createMultipleEvents,
    onSuccess: () => {
      // Invalidate events queries to refresh the calendar
      queryClient.invalidateQueries({ queryKey: ["events"] });
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
