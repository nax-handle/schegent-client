"use client";

import React, { useEffect, useState } from "react";
import {
  ListChecks,
  ChartColumnDecreasing,
  UsersRound,
  Settings2,
  Bell,
  Calendar1,
} from "lucide-react";

import { NavMain } from "@/components/nav-sidebar/nav-main";
import { NavUser } from "@/components/nav-sidebar/nav-user";
import { TeamSwitcher } from "@/components/nav-sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { useGetAllCalendars } from "@/hooks/calendar/use.calendar";

export function AppSidebar({
  setChecked,
  setCalendarID,
  setIsEventDialogOpen,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  setChecked?: React.Dispatch<React.SetStateAction<string[]>>;
  setCalendarID: (id: string) => void;
  setIsEventDialogOpen: (isOpen: boolean) => void;
}) {
  const { data: dataCalendar } = useGetAllCalendars();
  const [calendar, setCalendar] = useState(dataCalendar || []);

  useEffect(() => {
    if (dataCalendar) {
      setCalendar(dataCalendar);
    }
  }, [dataCalendar]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          isCollapsed={props.collapsible === "icon"}
          setChecked={setChecked}
          setCalendarID={setCalendarID}
          setIsEventDialogOpen={setIsEventDialogOpen}
          calendar={calendar}
          items={[
            {
              type: "main",
              title: "Calendars",
              icon: Calendar1,
              isActive: true,
              items: calendar,
              url: "/",
            },
            {
              type: "sub",
              title: "Tasks",
              icon: ListChecks,
              url: "/tasks",
            },
            {
              type: "sub",
              title: "Groups",
              icon: UsersRound,
              url: "/users",
            },
            {
              type: "sub",
              title: "Reports",
              icon: ChartColumnDecreasing,
              url: "/reports",
            },
            {
              type: "sub",
              title: "Notifications",
              icon: Bell,
              url: "/notifications",
            },
            {
              type: "sub",
              title: "Settings",
              icon: Settings2,
              url: "/settings",
            },
          ]}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
