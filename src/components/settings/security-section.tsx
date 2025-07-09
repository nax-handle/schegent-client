"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Shield, Bell, LogOut } from "lucide-react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import WarningSetting from "./warning-setting";
import { useTranslation } from "react-i18next";
import DeviceLoggedIn from "./device-logged-in";
export default function SecuritySection() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [loginNotifications, setLoginNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const { t } = useTranslation();
  return (
    <AccordionItem value="security" className="border rounded-lg px-6">
      <AccordionTrigger className="hover:no-underline">
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          <div className="text-left">
            <div className="font-semibold">Security</div>
            <div className="text-sm text-muted-foreground font-normal">
              Configure your security settings and preferences
            </div>
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent className="space-y-6 pt-4">
        {/* Two-Factor Authentication */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              {twoFactorEnabled ? (
                <Badge
                  variant="secondary"
                  className="bg-green-100 text-green-800"
                >
                  Enabled
                </Badge>
              ) : (
                <Badge variant="secondary">Coming soon</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground">
              Add an extra layer of security to your account with 2FA.
            </p>
          </div>
          <Switch
            id="two-factor"
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled}
          />
        </div>

        <Separator />

        {/* Login Notifications */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="login-notifications">Login Notifications</Label>
            <p className="text-sm text-muted-foreground">
              Get notified when someone signs into your account.
            </p>
          </div>
          <Switch
            id="login-notifications"
            checked={loginNotifications}
            onCheckedChange={setLoginNotifications}
          />
        </div>

        <Separator />

        {/* Security Alerts */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="security-alerts">Security Alerts</Label>
            <p className="text-sm text-muted-foreground">
              Receive alerts about suspicious account activity.
            </p>
          </div>
          <Switch
            id="security-alerts"
            checked={securityAlerts}
            onCheckedChange={setSecurityAlerts}
          />
        </div>

        <Separator />

        {/* Active Sessions */}
        <div className="space-y-3">
          <Label>Active Sessions</Label>
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
                  {t(
                    "Quickly sign out of your current device or all other devices"
                  )}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Warning */}
                <WarningSetting />
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
                <DeviceLoggedIn />
              </CardContent>
            </Card>
          </div>
        </div>

        <Button variant="outline" className="w-full sm:w-auto">
          <Bell className="h-4 w-4 mr-2" />
          View Security Log
        </Button>
      </AccordionContent>
    </AccordionItem>
  );
}
