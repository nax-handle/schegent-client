import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";

interface HeaderProps {
  currentView: "day" | "week" | "month";
  setCurrentView: (view: "day" | "week" | "month") => void;
  currentDate: Date;
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
  onNavigateToday: () => void;
}

export default function NavMenu({
  currentView,
  setCurrentView,
  currentDate,
  onNavigatePrevious,
  onNavigateNext,
  onNavigateToday,
}: HeaderProps) {
  const { t } = useTranslation();

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

  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();

  const handleCurrentView = (currentView: string) => {
    localStorage.setItem("currentView", currentView);
    setCurrentView(currentView as "day" | "week" | "month");
  };

  const formatDisplayDate = () => {
    const formatDate = (date: Date) => {
      const weekdays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];
      const shortMonths = [
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

      return {
        weekday: weekdays[date.getDay()],
        month: months[date.getMonth()],
        shortMonth: shortMonths[date.getMonth()],
        day: date.getDate(),
        year: date.getFullYear(),
      };
    };

    switch (currentView) {
      case "day":
        const dayFormat = formatDate(currentDate);
        return `${dayFormat.weekday}, ${dayFormat.month} ${dayFormat.day}, ${dayFormat.year}`;
      case "week":
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());
        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const startFormat = formatDate(startOfWeek);
        const endFormat = formatDate(endOfWeek);

        return `${startFormat.shortMonth} ${startFormat.day} - ${endFormat.shortMonth} ${endFormat.day}, ${endFormat.year}`;
      case "month":
        return `${currentMonth}, ${currentYear}`;
      default:
        return `${currentMonth}, ${currentYear}`;
    }
  };

  return (
    <div className="flex items-center justify-between border-gray-300   w-full pl-6 pb-6">
      <div className="flex items-center gap-4 ml-8">
        <h1
          className="text-md border-2 px-4 py-2 rounded-full cursor-pointer hover:bg-gray-100"
          onClick={onNavigateToday}
        >
          {t("Today")}
        </h1>
        <div className="flex items-center ">
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={onNavigatePrevious}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            className="p-2 rounded-md hover:bg-gray-100"
            onClick={onNavigateNext}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
        <h1 className="text-2xl font-bold ">{formatDisplayDate()}</h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="px-8 pb-6 mt-6 flex justify-center">
          <div className="inline-flex rounded-md overflow-hidden">
            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "day"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("day")}
            >
              {t("Day")}
            </button>
            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "week"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
                              : "hover:bg-white/10"
                          }`}
              onClick={() => handleCurrentView("week")}
            >
              {t("Week")}
            </button>

            <button
              className={`px-6 py-2 text-ld rounded-lg transition 
                          ${
                            currentView === "month"
                              ? "dark:bg-white/20 bg-gray-100 backdrop-blur-md shadow-md  "
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
