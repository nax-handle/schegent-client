"use client";

import React, { useState } from "react";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { Providers } from "@/components/providers";
import Header from "@/components/header-nav/header";
import SideBarIcon from "@/components/header-nav/sidebar-icon";
import Leftsidebar from "@/components/header-nav/left-sidebar";
import { usePathname } from "next/navigation";
import { NotFoundProvider, useNotFound } from "@/context/not-found-context";
import CalendarPage from "./(calendar)/page";

const inter = Inter({ subsets: ["latin"] });

function InnerLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [checked, setChecked] = useState<string[]>([]);
  const pathname = usePathname();
  const { isNotFound } = useNotFound();

  const hideLayoutPaths = ["/login", "/register", "/forgot-password"];
  const calendarPaths = ["/", "/calendar"];

  if (hideLayoutPaths.includes(pathname) || isNotFound) {
    return <>{children}</>;
  }

  // ✅ Render layout riêng cho Calendar
  if (calendarPaths.includes(pathname)) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
        <div className="flex flex-1 mt-2">
          <SideBarIcon menuOpen={menuOpen} />
          <Leftsidebar menuOpen={menuOpen} setChecked={setChecked} />
          <CalendarPage checked={checked} />
        </div>
      </div>
    );
  }

  // ✅ Render layout mặc định cho các page còn lại
  return (
    <div className="flex flex-col min-h-screen">
      <Header setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <div className="flex flex-1 mt-2">
        <SideBarIcon menuOpen={menuOpen} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
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
        <RootLayout>{children}</RootLayout>
      </Providers>
    </NotFoundProvider>
  );
}
