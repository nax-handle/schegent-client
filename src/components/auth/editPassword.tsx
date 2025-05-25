import React from "react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function EditPassword() {
  const { t } = useTranslation();

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="current-password "
            className="text-black dark:text-white"
          >
            {t("Current Password")}
          </Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="current-password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-black dark:text-white">
            {t("New Password")}
          </Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="new-password"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <div className="space-y-2 ">
          <Label
            htmlFor="confirm-password"
            className="text-black dark:text-white"
          >
            {t("Confirm Password")}
          </Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="confirm-password"
            type="password"
            placeholder="••••••••"
          />
        </div>
      </div>
    </div>
  );
}
