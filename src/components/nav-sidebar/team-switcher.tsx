"use client";

import * as React from "react";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";

export function TeamSwitcher() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="flex items-center">
          <Link href="/">
            <Image src="/images/logo.png" alt="Logo" width={70} height={70} />
          </Link>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
