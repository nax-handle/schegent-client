import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { House, UsersRound, Bell, Settings } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faListCheck,
  faCalendarDays,
  faChartSimple,
} from "@fortawesome/free-solid-svg-icons";

export default function SideBarIcon() {
  const pathname = usePathname();
  const router = useRouter();
  const lastSegment = pathname.split("/").filter(Boolean).pop();

  const menuItems = [
    {
      route: "dashboard",
      icon: <House />,
    },
    {
      route: "tasks",
      icon: <FontAwesomeIcon icon={faListCheck} />,
      style: "text-xl",
    },
    {
      route: "users",
      icon: <UsersRound />,
    },
    {
      route: "calendar",
      icon: <FontAwesomeIcon icon={faCalendarDays} />,
      style: "text-2xl",
    },
    {
      route: "reports",
      icon: <FontAwesomeIcon icon={faChartSimple} />,
      style: "text-2xl",
    },
    {
      route: "notifications",
      icon: <Bell />,
    },
    {
      route: "settings",
      icon: <Settings />,
      style: "text-2xl",
    },
  ];

  return (
    <div className="w-14 py-10 flex justify-center border-r items-center h-[#85vh] rounded-tr-xl">
      <div className="flex flex-col gap-6">
        {menuItems.map((item, index) => {
          const isActive = lastSegment === item.route;

          return (
            <div
              key={index}
              onClick={() => router.push(`/${item.route}`)}
              className={`cursor-pointer transition-colors duration-200 ${
                item.style ? `${item.style}` : ""
              } ${
                isActive ? "text-blue-500" : "text-black dark:text-white"
              } hover:text-blue-500`}
            >
              {React.cloneElement(item.icon, {
                className: "w-6 h-6",
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
}
