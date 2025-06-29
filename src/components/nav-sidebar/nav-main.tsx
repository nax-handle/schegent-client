"use client";
import React, { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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
                  <div className="flex items-center w-full">
                    <SidebarMenuButton
                      tooltip={item.title}
                      onClick={(e) => {
                        console.log("Navigation clicked:", item.url);
                        e.preventDefault();
                        e.stopPropagation();
                        if (item.url && item.url !== "#") {
                          console.log("Navigating to:", item.url);
                          router.replace(item.url);
                        }
                      }}
                      className="flex-1"
                    >
                      {item.icon && (
                        <item.icon
                          className={isCollapsed ? "w-5 h-5" : "w-8 h-8"}
                        />
                      )}
                      <span>{item.title}</span>
                    </SidebarMenuButton>

                    <div className="flex items-center pr-2">
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

                      <CollapsibleTrigger className="p-1 hover:bg-accent rounded-sm">
                        <ChevronRight className="ml-2 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </CollapsibleTrigger>
                    </div>
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
                                    Create Event
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleUpdateCalendar(subItem);
                                    }}
                                  >
                                    Update
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.preventDefault();
                                      e.stopPropagation();
                                      handleDeleteCalendar(subItem.id);
                                    }}
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
                <SidebarMenuButton
                  onClick={(e) => {
                    console.log("Sub navigation clicked:", item.url);
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("Pushing to router:", item.url);
                    router.push(item.url);
                  }}
                  className="flex items-center gap-2 w-full text-left cursor-pointer"
                >
                  {item.icon && (
                    <item.icon
                      className={isCollapsed ? "w-5 h-5" : "w-8 h-8"}
                    />
                  )}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          }
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
