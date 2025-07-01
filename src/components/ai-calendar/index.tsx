"use client";
import React from "react";
import { useTranslation } from "react-i18next";
import { useReminderEvent } from "@/hooks/calendar/use.events";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Calendar, Clock, User, Bot } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Mic, ImageIcon } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css/pagination";

const formatTime = (isoString: string) => {
  const date = new Date(isoString);
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

export default function AICalendar() {
  const { t } = useTranslation();
  const { data, isLoading } = useReminderEvent();
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<
    { id: string; role: "user" | "assistant"; content: string }[]
  >([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      role: "user" as const,
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    setTimeout(() => {
      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        role: "assistant" as const,
        content:
          "I understand you want to manage your calendar. This feature is coming soon!",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
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
          <Card className=" flex flex-col lg:h-[calc(100vh-2rem)] h-[calc(100vh-20rem)]">
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

                {isLoading && (
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
              <form onSubmit={handleSubmit} className="flex gap-2 items-center">
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
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me to reschedule, modify, or add events..."
                  className="flex-1 text-black dark:text-white"
                  disabled={isLoading}
                />
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
