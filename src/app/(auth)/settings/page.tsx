"use client";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import "@/../i18n";
import Warningsetting from "@/components/settings/warning-setting";
import Deviceloggedin from "@/components/settings/device-loggedin";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function SessionManagement() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 px-4">
      <p className="pl-4 pt-10 text-3xl font-bold dark:text-white">
        {t("Secure")}
      </p>
      <p className="pl-4 text-xl dark:text-white">
        {t("Manage your sessions and devices")}
      </p>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-black dark:text-white">
            <LogOut className="w-5 h-5 text-black dark:text-white" />
            {t("Sign out quickly")}
          </CardTitle>
          <CardDescription className="text-black dark:text-white">
            {t("Quickly sign out of your current device or all other devices")}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Warning */}
          <Warningsetting />
          {/*  */}
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="text-black dark:text-white">
            {t("Device is logged in")}
          </CardTitle>
          <CardDescription className="text-black dark:text-white">
            {t("List of devices currently logged into your account")}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Deviceloggedin */}
          <Deviceloggedin />
          {/*  */}
        </CardContent>
      </Card>
    </div>
  );
}
