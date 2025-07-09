"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Providers } from "../providers";
import { usePathname } from "next/navigation";
import { NotFoundProvider, useNotFound } from "@/context/not-found-context";
import Calendar from "@/components/calendar/index";
import Chat from "@/components/chat/index";
import { AppSidebar } from "@/components/nav-sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { CalendarDialogProvider } from "@/context/calendar-dialog-context";
import { Logs } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

const inter = Inter({ subsets: ["latin"] });

function InnerLayout({ children }: { children: React.ReactNode }) {
  const { t } = useTranslation();
  const [checked, setChecked] = useState<string[]>([]);
  const [calendarID, setCalendarID] = useState<string>("");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [currentView, setCurrentView] = useState<"day" | "week" | "month">(
    "day"
  );
  const pathname = usePathname();
  const { isNotFound } = useNotFound();

  const hideLayoutPaths = ["/login", "/register", "/forgot-password"];
  const calendarPaths = ["/calendar"];
  const AI_Calendar = ["/"];

  if (hideLayoutPaths.includes(pathname) || isNotFound) {
    return <>{children}</>;
  }

  if (calendarPaths.includes(pathname)) {
    return (
      <SidebarProvider>
        <AppSidebar
          setChecked={setChecked}
          setCalendarID={setCalendarID}
          setIsEventDialogOpen={setIsEventDialogOpen}
        />
        <SidebarInset>
          <header className="flex justify-between sm:hidden h-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-10 p-4 items-center">
            <div className="flex items-center gap-2">
              <SidebarTrigger className="-ml-1" />
              <span>Menu</span>
            </div>
            <div className="flex items-center gap-2">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="none">
                    <Logs className="h-6 w-6" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-fit">
                  <DropdownMenuItem onClick={() => setCurrentView("month")}>
                    {t("Month")}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setCurrentView("day")}>
                    {t("Day")}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-1 pt-0">
            <div className="flex flex-col min-h-[80vh] relative">
              <div className="flex flex-1">
                <Calendar
                  checked={checked}
                  calendarID={calendarID}
                  isEventDialogOpen={isEventDialogOpen}
                  setIsEventDialogOpen={setIsEventDialogOpen}
                  setCurrentView={setCurrentView}
                  currentView={currentView}
                />
                <div className="flex flex-col absolute bottom-10 right-20">
                  <Chat />
                </div>
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AppSidebar
        setCalendarID={setCalendarID}
        setIsEventDialogOpen={setIsEventDialogOpen}
      />
      <SidebarInset>
        <header className="flex justify-between sm:hidden h-5 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 z-10 p-4 items-center">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <span>Menu</span>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="flex flex-1">
            <main className="flex-1">{children}</main>
            {!AI_Calendar.includes(pathname) && (
              <div className="flex flex-col absolute bottom-10 right-20">
                <Chat />
              </div>
            )}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

export function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <InnerLayout>{children}</InnerLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <NotFoundProvider>
      <Providers>
        <CalendarDialogProvider>
          <RootLayout>{children}</RootLayout>
        </CalendarDialogProvider>
      </Providers>
    </NotFoundProvider>
  );
}
