"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  ChevronRight,
  Plus,
  MoreVertical,
  type LucideIcon,
} from "lucide-react";
import { Bot } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Calendar } from "@/types";
import { useDeleteCalendar } from "@/hooks/calendar/use.calendar";
import { useCalendarDialog } from "@/context/calendar-dialog-context";
import { useTranslation } from "react-i18next";
import Link from "next/link";

type NavItem =
  | {
      type: "main";
      title: string;
      icon?: LucideIcon;
      isActive?: boolean;
      items?: Calendar[];
      url?: string;
    }
  | {
      type: "sub";
      title: string;
      icon?: LucideIcon;
      url: string;
    };

export function NavMain({
  items,
  calendar,
  setChecked,
  setCalendarID,
  setIsEventDialogOpen,
  isCollapsed,
}: {
  items: NavItem[];
  calendar: Calendar[];
  setChecked?: React.Dispatch<React.SetStateAction<string[]>>;
  setCalendarID: (id: string) => void;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  isCollapsed: boolean;
}) {
  const { deleteCalendar } = useDeleteCalendar();
  const { setIsEventTypeDialogOpen, setEditingEventType } = useCalendarDialog();
  const isCreatingRef = useRef(false);
  const router = useRouter();
  const { t } = useTranslation();

  const handleDeleteCalendar = (id: string) => {
    deleteCalendar(id);
  };

  const handleUpdateCalendar = (calendar: Calendar) => {
    setEditingEventType(calendar);
    setIsEventTypeDialogOpen(true);
  };

  const handleCreateCalendar = () => {
    if (isCreatingRef.current) return;
    isCreatingRef.current = true;
    setEditingEventType(null);
    setIsEventTypeDialogOpen(true);
    setTimeout(() => {
      isCreatingRef.current = false;
    }, 100);
  };

  useEffect(() => {
    if (calendar) {
      setChecked?.(calendar.map((cal) => cal.id));
    }
  }, [calendar, setChecked]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              router.push("/");
            }}
            className="flex items-center gap-2 w-full text-left cursor-pointer"
          >
            <Bot className={"w-5 h-5"} />
            <span>AI-Calendar</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => {
          if (item.type === "main") {
            return (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <div className="flex items-center w-full">
                    <SidebarMenuButton asChild>
                      <div className="flex items-center justify-between w-full px-2 py-1">
                        <Link
                          href={"/calendar"}
                          className="flex items-center gap-2 w-fit"
                        >
                          {item.icon && <item.icon className={"w-4 h-4"} />}
                        </Link>
                        <Link
                          href={"/calendar"}
                          className="flex items-center gap-2 w-full"
                        >
                          {!isCollapsed && <span>{t(item.title)}</span>}
                        </Link>

                        {!isCollapsed && (
                          <div className="flex items-center gap-1">
                            <div
                              role="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCreateCalendar();
                              }}
                              className="p-1 hover:bg-accent rounded-sm cursor-pointer"
                            >
                              <Plus />
                            </div>

                            <CollapsibleTrigger asChild>
                              <div
                                role="button"
                                className="p-1 hover:bg-accent rounded-sm cursor-pointer"
                              >
                                <ChevronRight className="ml-1 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                              </div>
                            </CollapsibleTrigger>
                          </div>
                        )}
                      </div>
                    </SidebarMenuButton>
                  </div>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton asChild>
                            <div className="flex items-center gap-3 w-full h-fit">
                              <Checkbox
                                id={subItem.id}
                                defaultChecked
                                className="w-4 h-4 rounded-sm border-none"
                                style={{ backgroundColor: subItem.colorId }}
                                onCheckedChange={(checked) => {
                                  if (setChecked) {
                                    setChecked((prev) =>
                                      checked
                                        ? [...prev, subItem.id]
                                        : prev.filter((id) => id !== subItem.id)
                                    );
                                  }
                                }}
                              />
                              <span className="text-sm flex-1">
                                {subItem.name}
                              </span>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <button
                                    className="p-1 hover:bg-accent rounded-sm"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                    }}
                                  >
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      setCalendarID(subItem.id);
                                      setIsEventDialogOpen(true);
                                    }}
                                  >
                                    {t("Add Event")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleUpdateCalendar(subItem);
                                    }}
                                  >
                                    {t("Edit Calendar")}
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteCalendar(subItem.id);
                                    }}
                                    className="text-destructive"
                                  >
                                    {t("Delete Calendar")}
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            );
          }

          // type === "sub"
          if (item.type === "sub") {
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(item.url);
                  }}
                  className="flex items-center gap-2 w-full text-left cursor-pointer"
                >
                  {item.icon && (
                    <item.icon
                      className={isCollapsed ? "w-5 h-5" : "w-8 h-8"}
                    />
                  )}
                  <span>{t(item.title)}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
