"use client";

import type React from "react";

import { useState } from "react";
import { MessageSquare, Send, X, Mic, ImageIcon, Smile } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
// Utility to join class names conditionally
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(" ");
}

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
  timestamp: string;
}

export default function AiChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Xin chào! Tôi có thể giúp gì cho bạn?",
      role: "assistant",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [input, setInput] = useState("");

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages([...messages, userMessage]);
    setInput("");

    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          "Tôi đã nhận được tin nhắn của bạn. Tôi có thể giúp gì thêm không?",
        role: "assistant",
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages((prev) => [...prev, aiMessage]);
    }, 1000);
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
        <Card className="w-130 md:w-96 shadow-xl flex flex-col z-40 min-h-[50vh] bg-gray-300 overflow-hidden">
          {/* Header */}
          <div className="bg-primary text-primary-foreground p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">s</Avatar>
              <div>
                <h3 className="text-sm font-medium">AI Assistant</h3>
                <p className="text-xs opacity-90">Hoạt động</p>
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
          <div className="flex-1 p-3 overflow-y-auto max-h-[50vh] flex flex-col gap-3 bg-gray-100 dark:bg-gray-900">
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
                  {message.role === "assistant" && (
                    <Avatar className="h-6 w-6 mt-1">s</Avatar>
                  )}
                  <div
                    className={cn(
                      "p-2 rounded-lg",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-none"
                        : "bg-gray-200 dark:bg-gray-800 text-foreground rounded-bl-none"
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
              </div>
            ))}
          </div>

          {/* Input area */}
          <div className="p-3 border-t">
            <form onSubmit={handleSubmit} className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Mic className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <ImageIcon className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Aa"
                className="flex-1"
              />
              <Button type="submit" size="icon" className="h-8 w-8">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </Card>
      )}
    </>
  );
}
