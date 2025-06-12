"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  UsersRound,
  Bell,
  Settings,
  CalendarClock,
  House,
  ChartColumnDecreasing,
  ListChecks,
} from "lucide-react";

interface menuOpen {
  menuOpen: boolean;
}

export default function SideBarIcon({ menuOpen }: menuOpen) {
  const pathname = usePathname();
  const router = useRouter();

  const menuItems = [
    {
      route: "/",
      icon: <House />,
      text: "Home",
    },
    {
      route: "events",
      icon: <CalendarClock />,
      text: "Events",
    },
    {
      route: "tasks",
      icon: <ListChecks />,
      text: "Tasks",
    },
    {
      route: "users",
      icon: <UsersRound />,
      text: "Users",
    },
    {
      route: "reports",
      icon: <ChartColumnDecreasing />,
      text: "Reports",
    },
    {
      route: "notifications",
      icon: <Bell />,
      text: "Notifications",
    },
    {
      route: "settings",
      icon: <Settings />,
      text: "Settings",
    },
  ];

  return (
    <div
      className={`flex justify-center dark:border-white border-r pt-5 rounded-tr-xl ${
        menuOpen ? "w-40 px-4 translate-x-0" : "hidden w-0 translate-x-[-100%] "
      }`}
      style={{ height: "calc(100vh - 85px)" }}
    >
      <div className="flex flex-col gap-15">
        {menuItems.map((item, index) => {
          const isActive =
            pathname === item.route || pathname.startsWith(`/${item.route}`);
          return (
            <div
              key={index}
              onClick={() => router.push(`/${item.route}`)}
              className={`cursor-pointer transition-colors duration-200 flex items-center ${
                isActive ? "text-blue-500" : "text-black dark:text-white"
              } hover:text-blue-500`}
            >
              {React.cloneElement(item.icon, {
                className: "w-6 h-6",
              })}
              <span
                className={`text-sm ml-2 ${
                  menuOpen ? "inline-block opacity-100" : "hidden"
                }`}
              >
                {item.text}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
