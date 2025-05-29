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

const inter = Inter({ subsets: ["latin"] });

function InnerLayout({ children }: { children: React.ReactNode }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { isNotFound } = useNotFound();
  const hideLayoutPaths = ["/login", "/register", "/forgot-password"];

  const shouldShowLayout = !hideLayoutPaths.includes(pathname) && !isNotFound;

  return shouldShowLayout ? (
    <div className="flex flex-col min-h-screen">
      <Header setMenuOpen={setMenuOpen} menuOpen={menuOpen} />
      <div className="flex flex-1 mt-2">
        <SideBarIcon />
        <Leftsidebar menuOpen={menuOpen} />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  ) : (
    <>{children}</>
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
