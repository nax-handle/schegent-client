"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { MessageSquare, Send, X, Mic, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}
import { useProfile } from "@/hooks/auth/use.auth";
import { useSendMessage, useActionEvents } from "@/hooks/chat/use.chatbot";
import EventSuggestions from "./event-suggestions";
import type { Events } from "@/lib/services/chatbot.service";
import type { SendEvent } from "@/types";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
  events?: Events[];
}

export default function AiChatWidget() {
  const { data } = useProfile();
  const { sendMessageAsync, isSending } = useSendMessage();
  const { createEventsAsync, isCreating } = useActionEvents();
  const [isOpen, setIsOpen] = useState(false);
  const [pendingEvents, setPendingEvents] = useState<{
    [messageId: string]: Events[];
  }>({});
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const [eventStates, setEventStates] = useState<{
    [messageId: string]: {
      accepted: number[];
      rejected: number[];
    };
  }>({});
  const [messages, setMessages] = useState<Message[]>(() => {
    // Load messages from localStorage (only on client-side)
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("chatMessages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        const savedTime = localStorage.getItem("chatMessagesTime");
        if (savedTime) {
          const timeDiff = Date.now() - parseInt(savedTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // If more than 24 hours, clear messages
          if (hoursDiff > 24) {
            localStorage.removeItem("chatMessages");
            localStorage.removeItem("chatMessagesTime");
            return [
              {
                id: "1",
                content: "Xin chào! Tôi có thể giúp gì cho bạn?",
                role: "assistant",
                timestamp: new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            ];
          }
          return parsed;
        }
      }
    }

    return [
      {
        id: "1",
        content: "Xin chào! Tôi có thể giúp gì cho bạn?",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      },
    ];
  });
  const [input, setInput] = useState("");
  const [action, setAction] = useState<string>("");
  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      localStorage.setItem("chatMessages", JSON.stringify(messages));
      localStorage.setItem("chatMessagesTime", Date.now().toString());
    }
  }, [messages]);

  // Function to convert time format
  const convertTimeFormat = (timeString: string): string => {
    // Check if time is already in ISO format
    if (timeString.includes("T") && timeString.includes("Z")) {
      return timeString;
    }

    // Convert from "YYYY-MM-DD HH:MM" to ISO format
    if (timeString.includes(" ")) {
      const [date, time] = timeString.split(" ");
      const [year, month, day] = date.split("-");
      const [hour, minute] = time.split(":");

      // Create ISO string with UTC timezone
      return `${year}-${month}-${day}T${hour}:${minute}:00.000Z`;
    }

    return timeString;
  };

  const handleAcceptEvent = async (
    messageId: string,
    event: Events,
    eventIndex: number
  ) => {
    // Mark this event as accepted FIRST for immediate UI feedback
    setEventStates((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        accepted: [...(prev[messageId]?.accepted || []), eventIndex],
      },
    }));

    // Create single event
    try {
      const sendEvent: SendEvent = {
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location || null,
        startTime: convertTimeFormat(event.startTime),
        endTime: convertTimeFormat(event.endTime),
        hangoutLink: event.hangoutLink || null,
        recurrence: event.recurrence || "",
        icon: event.icon || null,
        visibility: event.visibility || "default",
        status: event.status || "confirmed",
        priority: event.priority,
        eventCategory: event.eventCategory || "general",
        colorId: event.colorId || "#3B82F6",
        isAllDay: event.isAllDay,
        calendarId: event.calendarId || "",
        minutesBefore: 0,
      };

      await createEventsAsync({ events: [sendEvent], action });

      // Add success message for individual event
      const successMessage: Message = {
        id: Date.now().toString(),
        content: `✅ Đã sử lí "${event.title}" thành công vào lịch của bạn!`,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, successMessage]);
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      console.error("Error creating single event:", error);

      // Revert the accepted state on error
      setEventStates((prev) => ({
        ...prev,
        [messageId]: {
          ...prev[messageId],
          accepted:
            prev[messageId]?.accepted.filter((idx) => idx !== eventIndex) || [],
        },
      }));

      // Add error message
      const errorMessage: Message = {
        id: Date.now().toString(),
        content: `❌ Không thể thêm "${event.title}". Vui lòng thử lại.`,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleRejectEvent = (messageId: string, eventIndex: number) => {
    setEventStates((prev) => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        rejected: [...(prev[messageId]?.rejected || []), eventIndex],
      },
    }));
  };

  const handleAcceptEvents = async (
    messageId: string,
    events: Events[],
    action: string
  ) => {
    try {
      const sendEvents: SendEvent[] = events.map((event) => ({
        id: event.id,
        title: event.title,
        description: event.description,
        location: event.location || null,
        startTime: convertTimeFormat(event.startTime),
        endTime: convertTimeFormat(event.endTime),
        hangoutLink: event.hangoutLink || null,
        recurrence: event.recurrence || "",
        icon: event.icon || null,
        visibility: event.visibility || "default",
        status: event.status || "confirmed",
        priority: event.priority,
        eventCategory: event.eventCategory || "general",
        colorId: event.colorId || "#3B82F6",
        isAllDay: event.isAllDay,
        calendarId: event.calendarId || "",
        minutesBefore: 0,
      }));

      await createEventsAsync({ events: sendEvents, action });

      setPendingEvents((prev) => {
        const newPending = { ...prev };
        delete newPending[messageId];
        return newPending;
      });

      const successMessage: Message = {
        id: Date.now().toString(),
        content: `✅ Đã sử lý thành công ${events.length} sự kiện vào lịch của bạn!`,
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, successMessage]);

      // Reload page after successful events creation
      // setTimeout(() => {
      //   window.location.reload();
      // }, 1000);
    } catch (error) {
      console.error("Error creating events:", error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "❌ Có lỗi xảy ra khi thêm sự kiện. Vui lòng thử lại.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  const handleRejectEvents = (messageId: string) => {
    setPendingEvents((prev) => {
      const newPending = { ...prev };
      delete newPending[messageId];
      return newPending;
    });

    setEventStates((prev) => {
      const newStates = { ...prev };
      delete newStates[messageId];
      return newStates;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isSending) return;

    const userInputText = input.trim();

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInputText,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Call the chatbot API
      const response = await sendMessageAsync({ message: userInputText });

      if (response.success && response.data) {
        const messageId = (Date.now() + 1).toString();

        // Handle events data from API response
        const events = response.data.eventsData || [];
        const responseAction = response.data.action || "";
        setAction(responseAction);

        const aiMessage: Message = {
          id: messageId,
          content: response.data.response,
          role: "assistant",
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          events: events,
        };

        // Store pending events if any and action is create or suggest
        if (events && events.length > 0) {
          setPendingEvents((prev) => ({
            ...prev,
            [messageId]: events,
          }));

          // Initialize event states
          setEventStates((prev) => ({
            ...prev,
            [messageId]: {
              accepted: [],
              rejected: [],
            },
          }));
        }

        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);

      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại.",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  return (
    <>
      {/* Floating chat button */}
      <Button
        onClick={toggleChat}
        className="fixed bottom-4 right-4 h-14 w-14 rounded-full shadow-lg p-0 z-50"
        variant="default"
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <MessageSquare className="h-6 w-6" />
        )}
      </Button>

      {isOpen && (
        <Card className="xm:w-130 md:w-96 shadow-xl flex flex-col z-40 min-h-[50vh] bg-gray-300 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8 bg-white">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                />
                <AvatarFallback>
                  <AvatarFallback className="text-black bg-white">
                    {data?.username
                      ? data.username.substring(0, 1).toUpperCase()
                      : ""}
                  </AvatarFallback>
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-sm font-medium text-white">AI Assistant</h3>
                <p className="text-xs opacity-90 text-white">Hoạt động</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-primary-foreground hover:text-primary-foreground/80"
              onClick={toggleChat}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Message area */}
          <div className="flex-1 p-3 overflow-y-auto max-h-[50vh] flex flex-col gap-3 bg-white dark:bg-gray-900">
            {messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex flex-col max-w-[80%]",
                  message.role === "user"
                    ? "ml-auto items-end"
                    : "mr-auto items-start"
                )}
              >
                <div className="flex items-start gap-2">
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-800 text-foreground rounded-bl-none"
                    )}
                  >
                    {message.content}
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-6 w-6 mt-1">s</Avatar>
                  )}
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  {message.timestamp}
                </span>

                {/* Event suggestions */}
                {message.role === "assistant" &&
                  message.events &&
                  message.events.length > 0 &&
                  pendingEvents[message.id] && (
                    <div className="mt-2 w-full">
                      <EventSuggestions
                        events={pendingEvents[message.id]}
                        onAcceptEvent={(event, index) =>
                          handleAcceptEvent(message.id, event, index)
                        }
                        onRejectEvent={(index) =>
                          handleRejectEvent(message.id, index)
                        }
                        onAcceptAll={(events) =>
                          handleAcceptEvents(message.id, events, action)
                        }
                        onRejectAll={() => handleRejectEvents(message.id)}
                        acceptedEvents={eventStates[message.id]?.accepted || []}
                        rejectedEvents={eventStates[message.id]?.rejected || []}
                        isLoading={isCreating}
                      />
                    </div>
                  )}
              </div>
            ))}

            {/* Typing indicator */}
            {isSending && (
              <div className="flex flex-col max-w-[80%] mr-auto items-start">
                <div className="bg-gray-100 dark:bg-gray-800 text-foreground p-2 rounded-lg rounded-bl-none">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1">
                  Đang soạn tin...
                </span>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input area */}
          <div className="p-3 border-t bg-slate-50 dark:bg-gray-800">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ImageIcon className="h-4 w-4 text-black dark:text-white" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Mic className="h-4 w-4 text-black dark:text-white" />
                </Button>
              </div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Aa"
                className="flex-1 bg-white decored-input text-black"
                disabled={isSending}
              />
              <Button
                type="submit"
                size="icon"
                className="h-8 w-8"
                disabled={isSending || !input.trim()}
              >
                <Send className="h-4 w-4 text-white" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
