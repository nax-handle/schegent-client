"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Providers } from "@/components/providers";
import { usePathname } from "next/navigation";
import { NotFoundProvider, useNotFound } from "@/context/not-found-context";
import CalendarPage from "./(calendar)/page";
import Chat from "@/components/chat/index";
import { AppSidebar } from "@/components/nav-sidebar/app-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { ScrollAnimation, ScrollToTop } from "@/components/ui/scroll-animation";
import { CalendarDialogProvider } from "@/context/calendar-dialog-context";

const inter = Inter({ subsets: ["latin"] });

function InnerLayout({ children }: { children: React.ReactNode }) {
  const [checked, setChecked] = useState<string[]>([]);
  const [calendarID, setCalendarID] = useState<string>("");
  const [isEventDialogOpen, setIsEventDialogOpen] = useState(false);
  const [selectedCalendarColor, setSelectedCalendarColor] =
    useState<string>("");
  const pathname = usePathname();
  const { isNotFound } = useNotFound();

  const hideLayoutPaths = ["/login", "/register", "/forgot-password"];
  const calendarPaths = ["/", "/calendar"];

  if (hideLayoutPaths.includes(pathname) || isNotFound) {
    return <>{children}</>;
  }

  if (calendarPaths.includes(pathname)) {
    return (
      <SidebarProvider className="">
        <AppSidebar
          setChecked={setChecked}
          setCalendarID={setCalendarID}
          setIsEventDialogOpen={setIsEventDialogOpen}
          setSelectedCalendarColor={setSelectedCalendarColor}
        />
        <SidebarInset>
          {/* <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 absolute top-6 z-100">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
            </div>
          </header> */}
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
            <div className="flex flex-col min-h-[80vh] relative">
              <ScrollAnimation />
              <div className="flex flex-1">
                <CalendarPage
                  checked={checked}
                  calendarID={calendarID}
                  isEventDialogOpen={isEventDialogOpen}
                  setIsEventDialogOpen={setIsEventDialogOpen}
                  selectedCalendarColor={selectedCalendarColor}
                />
                <div className="flex flex-col absolute bottom-10 right-20">
                  <Chat />
                </div>
              </div>
              <ScrollToTop />
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  // ✅ Render layout mặc định cho các page còn lại
  return (
    <SidebarProvider>
      <AppSidebar
        setCalendarID={setCalendarID}
        setIsEventDialogOpen={setIsEventDialogOpen}
        setSelectedCalendarColor={setSelectedCalendarColor}
      />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <ScrollAnimation />
          <main className="flex-1">{children}</main>
          <ScrollToTop />
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
