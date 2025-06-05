"use client";
import React, { useState } from "react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import "@/../i18n";

interface TimeRange {
  start: {
    hour: string;
    minute: string;
    period?: string;
  };
  end: {
    hour: string;
    minute: string;
    period?: string;
  };
}

export default function TimePicker() {
  const { t } = useTranslation();
  const currentLanguage = i18next.language;

  const isEnglish = currentLanguage === "en";

  const [timeRange, setTimeRange] = useState<TimeRange>({
    start: {
      hour: "00",
      minute: "00",
      period: isEnglish ? "AM" : undefined,
    },
    end: {
      hour: "00",
      minute: "00",
      period: isEnglish ? "AM" : undefined,
    },
  });

  const hours = Array.from({ length: isEnglish ? 12 : 24 }, (_, i) =>
    (isEnglish ? i : i).toString().padStart(2, "0")
  );
  const minutes = Array.from({ length: 60 }, (_, i) =>
    i.toString().padStart(2, "0")
  );
  const periods = ["AM", "PM"];

  const updateTime = (
    key: "start" | "end",
    field: "hour" | "minute" | "period",
    value: string
  ) => {
    setTimeRange((prev) => ({
      ...prev,
      [key]: {
        ...prev[key],
        [field]: value,
      },
    }));
  };

  return (
    <div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <Label className="mb-5">{t("Start Time")}</Label>
          <div className="flex gap-2">
            <Select
              value={timeRange.start.hour}
              onValueChange={(value) => updateTime("start", "hour", value)}
            >
              <SelectTrigger className="w-20 focus:ring-blue-500 hover:border-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-60 overflow-y-scroll scroll-hidden">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="flex items-center text-muted-foreground">:</span>

            <Select
              value={timeRange.start.minute}
              onValueChange={(value) => updateTime("start", "minute", value)}
            >
              <SelectTrigger className="w-20 focus:ring-blue-500 hover:border-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-60 overflow-y-scroll scroll-hidden">
                {minutes
                  .filter((_, i) => i % 5 === 0)
                  .map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {isEnglish && (
              <Select
                value={timeRange.start.period}
                onValueChange={(value) => updateTime("start", "period", value)}
              >
                <SelectTrigger className="w-20 focus:ring-blue-500 hover:border-blue-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>

        {/* END TIME */}
        <div className="space-y-4">
          <Label className="mb-5">{t("End Time")}</Label>
          <div className="flex gap-2">
            <Select
              value={timeRange.end.hour}
              onValueChange={(value) => updateTime("end", "hour", value)}
            >
              <SelectTrigger className="w-20 focus:ring-blue-500 hover:border-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-60 overflow-y-scroll scroll-hidden">
                {hours.map((hour) => (
                  <SelectItem key={hour} value={hour}>
                    {hour}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <span className="flex items-center text-muted-foreground">:</span>

            <Select
              value={timeRange.end.minute}
              onValueChange={(value) => updateTime("end", "minute", value)}
            >
              <SelectTrigger className="w-20 focus:ring-blue-500 hover:border-blue-600">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="h-60 overflow-y-scroll scroll-hidden">
                {minutes
                  .filter((_, i) => i % 5 === 0)
                  .map((minute) => (
                    <SelectItem key={minute} value={minute}>
                      {minute}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {isEnglish && (
              <Select
                value={timeRange.end.period}
                onValueChange={(value) => updateTime("end", "period", value)}
              >
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period} value={period}>
                      {period}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
