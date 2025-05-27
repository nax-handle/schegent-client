import React, { useState, useEffect } from "react";
import { MenuIcon } from "lucide-react";
import { Button } from "../ui/button";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "../ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import { Search, User, Settings, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout as logoutUser } from "@/lib/services/auth";
import ToggleTheme from "../theme/toggle-theme";
import Link from "next/link";

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen?: (open: boolean) => void;
}

export default function Header({ menuOpen, setMenuOpen }: MenuProps) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { t } = useTranslation();
  const router = useRouter();

  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      setIsLoggedIn(false);
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logout();
  };

  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) {
      const part = parts.pop();
      if (part) {
        return part.split(";").shift();
      }
    }
  };

  const checkLoginStatus = () => {
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");
    if (accessToken && refreshToken) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const toggleMenuOpen = () => {
    if (setMenuOpen) {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <div className="p-4 flex items-center justify-between bg-white dark:bg-[#0A0A0A] shadow-md">
      <div className="flex items-center">
        <button
          className="p-2 rounded-md hover:bg-gray-100 hover:dark:bg-white/10"
          onClick={toggleMenuOpen}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <Image src="/images/logo.png" alt="Logo" width={45} height={45} />
      </div>
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Search className="h-5 w-5" />
        </Button>

        {/* Notifications */}

        {/* Profile Menu */}
        {isLoggedIn ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-10 w-10 rounded-full"
              >
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src="/placeholder.svg?height=40&width=40"
                    alt="User"
                  />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <div className="flex items-center justify-start gap-2 p-2">
                <div className="flex flex-col space-y-1 leading-none">
                  <p className="font-medium">John Doe</p>
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    john.doe@example.com
                  </p>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <Link href={"/profile"}>{t("Profile")}</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>{t("Log out")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex items-center gap-2">
            <Button variant="ghost" onClick={() => router.push("/login")}>
              {t("LogIn")}
            </Button>
          </div>
        )}
        <ToggleTheme />
        {/* <ToggleLanguage /> */}
      </div>
    </div>
  );
}
