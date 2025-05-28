import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { useLogout, useLogoutAllSessions } from "@/hooks/auth/use.auth";

export default function Warningsetting() {
  const { t } = useTranslation();
  const { logout } = useLogout();
  const { logoutAllSessions, isLoggingOut, logoutError } =
    useLogoutAllSessions();

  const handleLogout = () => {
    logout();
  };

  const handleLogoutAll = () => {
    logoutAllSessions();
  };
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="outline"
            className="flex-1 text-black dark:text-white dark:bg-white/10 hover:bg-white/20"
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("Log out current device")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white">
              {t("Confirm Logout")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black dark:text-white">
              {t(
                "This will log you out of the current device. You will need to log in again to access your account."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black dark:text-white">
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogout}
              className="bg-amber-600 hover:bg-amber-400  text-white"
            >
              {t("Log out")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="destructive" className="flex-1 text-white">
            <LogOut className="w-4 h-4 mr-2 text-white" />
            {t("Log out all devices")}
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-black dark:text-white">
              {t("Log out all devices")}
            </AlertDialogTitle>
            <AlertDialogDescription className="text-black dark:text-white">
              {t(
                "This will log you out of all devices except the current one. You will need to log in again on each device to access your account."
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="text-black dark:text-white">
              {t("Cancel")}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleLogoutAll}
              disabled={isLoggingOut}
              className="bg-destructive text-destructive-foreground text-white"
            >
              {t("Log out all")}
            </AlertDialogAction>
            {logoutError && (
              <p className="text-red-500 mt-2">
                {t("Error logging out:")} {logoutError.message}
              </p>
            )}
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
