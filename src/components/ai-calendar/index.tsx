"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useReminderEvent } from "@/hooks/calendar/use.events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Bot, Lightbulb, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";
import { useSendMessage, useActionEvents } from "@/hooks/chat/use.chatbot";
import EventSuggestions from "@/components/chat/event-suggestions";
import type { Events } from "@/lib/services/chatbot.service";
import type { SendEvent } from "@/types";

const formatTime = (isoString: string) => {
  const date = new Date(isoString);

  const hours = date.getUTCHours().toString().padStart(2, "0");
  const minutes = date.getUTCMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  events?: Events[];
}

export default function AICalendar() {
  const { t } = useTranslation();
  const { data, isLoading } = useReminderEvent();
  const { sendMessageAsync, isSending } = useSendMessage();
  const { createEventsAsync, isCreating } = useActionEvents();

  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<Message[]>(() => {
    // Load messages from localStorage (only on client-side)
    if (typeof window !== "undefined") {
      const savedMessages = localStorage.getItem("aiCalendarMessages");
      if (savedMessages) {
        const parsed = JSON.parse(savedMessages);
        const savedTime = localStorage.getItem("aiCalendarMessagesTime");
        if (savedTime) {
          const timeDiff = Date.now() - parseInt(savedTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // If more than 1 hour, clear messages
          if (hoursDiff > 1) {
            localStorage.removeItem("aiCalendarMessages");
            localStorage.removeItem("aiCalendarMessagesTime");
            return [];
          }
          return parsed;
        }
      }
    }
    return [];
  });
  const [pendingEvents, setPendingEvents] = React.useState<{
    [messageId: string]: Events[];
  }>(() => {
    // Load pending events from localStorage
    if (typeof window !== "undefined") {
      const savedPendingEvents = localStorage.getItem(
        "aiCalendarPendingEvents"
      );
      if (savedPendingEvents) {
        const parsed = JSON.parse(savedPendingEvents);
        const savedTime = localStorage.getItem("aiCalendarMessagesTime");
        if (savedTime) {
          const timeDiff = Date.now() - parseInt(savedTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // If more than 1 hour, clear pending events
          if (hoursDiff > 1) {
            localStorage.removeItem("aiCalendarPendingEvents");
            return {};
          }
          return parsed;
        }
      }
    }
    return {};
  });
  const [eventStates, setEventStates] = React.useState<{
    [messageId: string]: {
      accepted: number[];
      rejected: number[];
    };
  }>(() => {
    // Load event states from localStorage
    if (typeof window !== "undefined") {
      const savedEventStates = localStorage.getItem("aiCalendarEventStates");
      if (savedEventStates) {
        const parsed = JSON.parse(savedEventStates);
        const savedTime = localStorage.getItem("aiCalendarMessagesTime");
        if (savedTime) {
          const timeDiff = Date.now() - parseInt(savedTime);
          const hoursDiff = timeDiff / (1000 * 60 * 60);

          // If more than 1 hour, clear event states
          if (hoursDiff > 1) {
            localStorage.removeItem("aiCalendarEventStates");
            return {};
          }
          return parsed;
        }
      }
    }
    return {};
  });
  const [action, setAction] = React.useState<string>("");
  const [isSuggestMode, setIsSuggestMode] = React.useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSuggestToggle = () => {
    setIsSuggestMode(!isSuggestMode);
  };

  // Save messages to localStorage whenever they change
  React.useEffect(() => {
    if (messages.length > 0 && typeof window !== "undefined") {
      localStorage.setItem("aiCalendarMessages", JSON.stringify(messages));
      localStorage.setItem("aiCalendarMessagesTime", Date.now().toString());
    }
  }, [messages]);

  // Save pending events to localStorage whenever they change
  React.useEffect(() => {
    if (
      Object.keys(pendingEvents).length > 0 &&
      typeof window !== "undefined"
    ) {
      localStorage.setItem(
        "aiCalendarPendingEvents",
        JSON.stringify(pendingEvents)
      );
    }
  }, [pendingEvents]);

  // Save event states to localStorage whenever they change
  React.useEffect(() => {
    if (Object.keys(eventStates).length > 0 && typeof window !== "undefined") {
      localStorage.setItem(
        "aiCalendarEventStates",
        JSON.stringify(eventStates)
      );
    }
  }, [eventStates]);

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
        content: `✅ Đã xử lý "${event.title}" thành công vào lịch của bạn!`,
        role: "assistant",
      };
      setMessages((prev) => [...prev, successMessage]);
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
        content: `✅ Đã xử lý thành công ${events.length} sự kiện vào lịch của bạn!`,
        role: "assistant",
      };
      setMessages((prev) => [...prev, successMessage]);
    } catch (error) {
      console.error("Error creating events:", error);

      const errorMessage: Message = {
        id: Date.now().toString(),
        content: "❌ Có lỗi xảy ra khi thêm sự kiện. Vui lòng thử lại.",
        role: "assistant",
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

    // Add user message (always show original input)
    const userMessage: Message = {
      id: Date.now().toString(),
      content: userInputText,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      // Prepare message for API - add "suggest " prefix if in suggest mode
      const messageForAPI = isSuggestMode
        ? `suggest ${userInputText}`
        : userInputText;

      // Call the chatbot API
      const response = await sendMessageAsync({ message: messageForAPI });

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
      };
      setMessages((prev) => [...prev, errorMessage]);
    }
  };

  if (isLoading) {
    return <div>{t("Loading")}...</div>;
  }

  return (
    <div className="text-black mt-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-1">
        <Card className="h-fit lg:block hidden max-h-[calc(100vh-2rem)] overflow-y-auto">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
              <Calendar className="h-5 w-5 text-primary " />
              Todays Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {data?.map((event) => (
              <div
                key={event.id}
                className="p-3 border rounded-lg bg-white dark:bg-slate-900 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatTime(event.startTime)} - {formatTime(event.endTime)}
                  </Badge>
                </div>
                <h4 className="font-medium text-sm text-black dark:text-white">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-600 mt-1">
                  {event.description}
                </p>
              </div>
            ))}
            {data?.length === 0 && (
              <div className="text-center text-gray-500">
                {t("No events for today")}
              </div>
            )}
          </CardContent>
        </Card>
        {/* mobile */}
        <Card className="h-fit lg:hidden block">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-black dark:text-white">
              <Calendar className="h-5 w-5 text-primary " />
              Todays Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 ">
            {data && data.length > 0 ? (
              <Swiper
                spaceBetween={12}
                slidesPerView={1}
                style={{ paddingBottom: "24px" }}
                pagination={{ clickable: true }}
                modules={[Pagination]}
              >
                {data.map((event) => (
                  <SwiperSlide key={event.id}>
                    <div className="p-3 border rounded-lg bg-white dark:bg-slate-900 shadow-sm mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline" className="text-xs">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTime(event.startTime)} -{" "}
                          {formatTime(event.endTime)}
                        </Badge>
                      </div>
                      <h4 className="font-medium text-sm text-black dark:text-white">
                        {event.title}
                      </h4>
                      <p className="text-xs text-gray-600 mt-1">
                        {event.description}
                      </p>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="text-center text-gray-500">
                {t("No events for today")}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-3">
        <div className="col-span-2 ">
          <Card className=" flex flex-col lg:h-[calc(100vh-3rem)] h-[calc(100vh-20rem)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-black dark:text-white">
                <Bot className="h-5 w-5 text-primary" />
                Calendar Assistant
              </CardTitle>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col">
              {/* Messages */}
              <div className="flex-1 overflow-y-auto space-y-4 mb-4">
                {messages.length === 0 && (
                  <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-slate-800 rounded-lg text-black dark:text-white">
                    <Bot className="h-8 w-8 text-primary flex-shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm">
                        Hello! I&apos;m your calendar assistant. I can help you
                        manage your events for today. Try asking me to
                        reschedule an event, add a new one, or modify existing
                        events!
                      </p>
                    </div>
                  </div>
                )}

                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex items-start gap-3 ${
                      message.role === "user" ? "flex-row-reverse" : ""
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user"
                          ? "bg-blue-600 text-white"
                          : "bg-blue-600 text-white"
                      }`}
                    >
                      {message.role === "user" ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    <div
                      className={`flex-1 p-3 rounded-lg max-w-[80%] ${
                        message.role === "user"
                          ? "bg-blue-200 text-black dark:text-white dark:bg-blue-500 ml-auto"
                          : "bg-gray-100 text-gray-900"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">
                        {message.content}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Event suggestions */}
                {messages.map((message) =>
                  message.role === "assistant" &&
                  message.events &&
                  message.events.length > 0 &&
                  pendingEvents[message.id] ? (
                    <div key={`events-${message.id}`} className="mt-2">
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
                  ) : null
                )}

                {isSending && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-gray-100 p-3 rounded-lg">
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
                  </div>
                )}
              </div>

              <Separator className="my-4" />

              {/* Input Form */}
              <div className="flex gap-2 items-center">
                <Button
                  type="button"
                  onClick={handleSuggestToggle}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                    isSuggestMode
                      ? "bg-blue-500 hover:bg-blue-600 text-white"
                      : "bg-blue-500/30 hover:bg-blue-500/50 text-blue-700 dark:text-blue-300"
                  }`}
                >
                  <Lightbulb className="h-4 w-4" />
                  <span className="text-sm font-medium">Suggest</span>
                </Button>
                <form
                  onSubmit={handleSubmit}
                  className="flex-1 flex gap-2 items-center"
                >
                  <Input
                    value={input}
                    onChange={handleInputChange}
                    placeholder="Ask me to reschedule, modify, or add events..."
                    className="flex-1 text-black dark:text-white"
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
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
