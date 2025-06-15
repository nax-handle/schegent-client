import React, { useState } from "react";
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
import { Search, User, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { logout as logoutUser } from "@/lib/services/auth";
import ToggleTheme from "../theme/toggle-theme";
import Link from "next/link";
import LanguageSwitcher from "../language/toggle-language";
import { useProfile } from "@/hooks/auth/use.auth";

interface MenuProps {
  menuOpen: boolean;
  setMenuOpen?: (open: boolean) => void;
}

export default function Header({ menuOpen, setMenuOpen }: MenuProps) {
  const { t } = useTranslation();
  const router = useRouter();
  const { data } = useProfile();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);

  const { mutate: logout } = useMutation({
    mutationFn: logoutUser,
    onSuccess: () => {
      router.push("/login");
    },
  });

  const handleLogout = () => {
    logout();
  };

  const toggleMenuOpen = () => {
    if (setMenuOpen) {
      setMenuOpen(!menuOpen);
    }
  };

  return (
    <div className="p-4 flex items-center justify-between bg-white dark:bg-[#0A0A0A] shadow-md dark:shadow-gray-600">
      <div className="flex items-center">
        <button
          className="p-2 rounded-md hover:bg-gray-100 hover:dark:bg-white/10"
          onClick={toggleMenuOpen}
        >
          <MenuIcon className="w-6 h-6" />
        </button>
        <Link href="/calendar" className="ml-2">
          <Image src="/images/logo.png" alt="Logo" width={45} height={45} />
        </Link>
      </div>
      <div className="flex items-center gap-2">
        {/* Search Button */}
        <Button variant="ghost" size="icon" className="hidden sm:flex">
          <Search className="h-5 w-5" />
        </Button>

        {/* Profile Menu */}
        <DropdownMenu open={profileMenuOpen} onOpenChange={setProfileMenuOpen}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarImage
                  src="/placeholder.svg?height=40&width=40"
                  alt="User"
                />
                <AvatarFallback>
                  <AvatarFallback>
                    {data?.username
                      ? data.username.substring(0, 1).toUpperCase()
                      : ""}
                  </AvatarFallback>
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{data?.username}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">
                  {data?.email || t("No email provided")}
                </p>
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <Link href={"/profile"}>{t("Profile")}</Link>
            </DropdownMenuItem>
            <DropdownMenu
              open={profileMenuOpen}
              onOpenChange={setProfileMenuOpen}
            >
              <LanguageSwitcher />
            </DropdownMenu>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t("Log out")}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <ToggleTheme />
      </div>
    </div>
  );
}
