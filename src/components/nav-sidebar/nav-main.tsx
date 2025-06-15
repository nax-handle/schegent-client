"use client";
import React, { useEffect } from "react";
import Link from "next/link";
import { ChevronRight, type LucideIcon } from "lucide-react";
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
import type { Calendar } from "@/types";

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
}: {
  items: NavItem[];
  calendar: Calendar[];
  setChecked?: React.Dispatch<React.SetStateAction<string[]>>;
}) {
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
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </Link>
                  </CollapsibleTrigger>

                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.id}>
                          <SidebarMenuSubButton asChild>
                            <div className="flex items-center gap-3">
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
                              <span className="text-sm">{subItem.name}</span>
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
