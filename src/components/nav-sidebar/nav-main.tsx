"use client";
import React, { useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronRight,
  Plus,
  MoreVertical,
  type LucideIcon,
} from "lucide-react";
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
  setSelectedCalendarColor,
}: {
  items: NavItem[];
  calendar: Calendar[];
  setChecked?: React.Dispatch<React.SetStateAction<string[]>>;
  setCalendarID: (id: string) => void;
  setIsEventDialogOpen: (isOpen: boolean) => void;
  setSelectedCalendarColor: (colorId: string) => void;
}) {
  const { deleteCalendar } = useDeleteCalendar();
  const { setIsEventTypeDialogOpen, setEditingEventType } = useCalendarDialog();
  const isCreatingRef = useRef(false);

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
                  <CollapsibleTrigger asChild>
                    <Link href={item.url || "#"}>
                      <SidebarMenuButton tooltip={item.title}>
                        {item.icon && <item.icon className="w-5 h-5" />}
                        <span>{item.title}</span>
                        <div className="ml-auto flex items-center">
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
                          <ChevronRight className="ml-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </div>
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleTrigger>

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
                                  <button className="p-1 hover:bg-accent rounded-sm">
                                    <MoreVertical className="w-4 h-4" />
                                  </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem
                                    onClick={() => {
                                      setCalendarID(subItem.id);
                                      setIsEventDialogOpen(true);
                                      setSelectedCalendarColor(subItem.colorId);
                                    }}
                                  >
                                    Create Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleUpdateCalendar(subItem)
                                    }
                                  >
                                    Update
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={() =>
                                      handleDeleteCalendar(subItem.id)
                                    }
                                    className="text-destructive"
                                  >
                                    Delete
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
                <SidebarMenuButton asChild>
                  <a
                    href={item.url}
                    className="flex items-center gap-2 w-full text-left"
                  >
                    {item.icon && <item.icon className="w-4 h-4" />}
                    <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
