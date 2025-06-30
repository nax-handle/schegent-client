import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { cn } from "@/lib/utils";
import i18next from "i18next";

interface HeaderProps {
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
  currentDate: Date;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onNavigateToday: () => void;
  onNavigateToDate: (date: Date) => void;
}

export default function NavMenu({
  currentView,
  setCurrentView,
  currentDate,
  onNavigatePrevious,
  onNavigateNext,
  onNavigateToday,
  onNavigateToDate,
}: HeaderProps) {
  const { t, i18n } = useTranslation();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const monthsVi = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const weekdaysVi = [
    "Chủ nhật",
    "Thứ 2",
    "Thứ 3",
    "Thứ 4",
    "Thứ 5",
    "Thứ 6",
    "Thứ 7",
  ];

  const shortMonthsVi = [
    "T1",
    "T2",
    "T3",
    "T4",
    "T5",
    "T6",
    "T7",
    "T8",
    "T9",
    "T10",
    "T11",
    "T12",
  ];

  const handleCurrentView = (currentView: string) => {
    localStorage.setItem("currentView", currentView);
    setCurrentView(currentView as "day" | "week" | "month");
  };

  const formatDisplayDate = () => {
    const lang = i18n?.language || i18next.language || "en";
    const isVi = lang.startsWith("vi");
    const monthsCurrent = isVi ? monthsVi : months;
    const weekdaysCurrent = isVi
      ? weekdaysVi
      : [
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
        ];
    const shortMonthsCurrent = isVi
      ? shortMonthsVi
      : [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ];
    const currentMonthLocal = monthsCurrent[currentDate.getMonth()];
    const currentYearLocal = currentDate.getFullYear();

    const formatDate = (date: Date) => {
      return {
        weekday: weekdaysCurrent[date.getDay()],
        month: monthsCurrent[date.getMonth()],
        shortMonth: shortMonthsCurrent[date.getMonth()],
        day: date.getDate(),
        year: date.getFullYear(),
      };
    };

    switch (currentView) {
      case "day": {
        const dayFormat = formatDate(currentDate);
        if (isVi) {
          return `${dayFormat.weekday}, ${dayFormat.day} ${dayFormat.month} ${dayFormat.year}`;
        }
        return `${dayFormat.weekday}, ${dayFormat.month} ${dayFormat.day}, ${dayFormat.year}`;
      }
      case "week": {
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startFormat = formatDate(startOfWeek);
        const endFormat = formatDate(endOfWeek);
        if (isVi) {
          return `${startFormat.shortMonth} ${startFormat.day} - ${endFormat.shortMonth} ${endFormat.day}, ${endFormat.year}`;
        }
        return `${startFormat.shortMonth} ${startFormat.day} - ${endFormat.shortMonth} ${endFormat.day}, ${endFormat.year}`;
      }
      case "month":
        return `${currentMonthLocal}, ${currentYearLocal}`;
      default:
        return `${currentMonthLocal}, ${currentYearLocal}`;
    }
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const today = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Ho_Chi_Minh" })
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between border-gray-300 w-full sm:pl-6 pb-4 sm:pb-6 gap-4 sm:gap-0">
      <div className="w-full">
        <div className="grid grid-cols-7 flex-1 w-full border-b sm:hidden">
          {days.map((day, index) => {
            const date = new Date(currentDate);
            const diff = index - currentDate.getDay();
            date.setDate(currentDate.getDate() + diff);

            const isToday = date.toDateString() === today.toDateString();
            return (
              <div
                key={day}
                className="py-2 text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800"
                onClick={() => onNavigateToDate(date)}
              >
                <div className="font-medium">{day}</div>
                <div
                  className={cn(
                    "w-7 h-7 mx-auto mt-1 flex items-center justify-center rounded-full",
                    isToday
                      ? "dark:bg-white bg-[#3A82F6] text-white dark:text-black"
                      : ""
                  )}
                >
                  {date.getDate()}
                </div>
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto justify-center sm:justify-start">
          <div className="sm:flex hidden items-center mt-4">
            <button
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100"
              onClick={onNavigatePrevious}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <h1
              className="text-sm sm:text-md border-2 px-3 sm:px-4 py-1.5 sm:py-2 mx-2 rounded-full cursor-pointer hover:bg-gray-100"
              onClick={onNavigateToday}
            >
              {t("Today")}
            </h1>
            <button
              className="p-1.5 sm:p-2 rounded-md hover:bg-gray-100"
              onClick={onNavigateNext}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <h1 className="text-sx sm:text-2xl font-bold text-center sm:text-left flex-1 sm:flex-none mt-4">
            {formatDisplayDate()}
          </h1>
        </div>
      </div>

      <div className="sm:flex hidden items-center w-full sm:w-auto justify-center">
        <div className="px-2 sm:px-8 pb-2 sm:pb-6 mt-2 sm:mt-6 flex justify-center w-full">
          <div className="inline-flex rounded-md overflow-hidden w-full sm:w-auto">
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 text-sm sm:text-ld rounded-lg transition 
                          ${
                            currentView === "day"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md"
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("day")}
            >
              {t("Day")}
            </button>
            <button
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 text-sm sm:text-ld rounded-lg transition 
                          ${
                            currentView === "week"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md"
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("week")}
            >
              {t("Week")}
            </button>

            <button
              className={`flex-1 sm:flex-none px-3 sm:px-6 py-2 text-sm sm:text-ld rounded-lg transition 
                          ${
                            currentView === "month"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md"
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("month")}
            >
              {t("Month")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
