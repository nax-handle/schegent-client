import React from "react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  useForgotPasswordForm,
  ForgotPasswordFormData,
} from "@/hooks/auth/zod.auth";
export default function EditPassword() {
  const { t } = useTranslation();
  const { register, handleSubmit, errors } = useForgotPasswordForm();

  const onSubmit = (data: ForgotPasswordFormData) => {
    console.log("Form data:", data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2 md:col-span-2">
          <Label
            htmlFor="current-password"
            className="text-black dark:text-white"
          >
            {t("Current Password")}
          </Label>
          <Input
            {...register("currentPassword")}
            className="text-gray-400 dark:text-white bg-white dark:bg-[#535353]"
            id="current-password"
            type="password"
            placeholder="••••••••"
          />
          {errors.currentPassword && (
            <p className="text-red-500 text-sm">
              {t(errors.currentPassword.message || "")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="new-password" className="text-black dark:text-white">
            {t("New Password")}
          </Label>
          <Input
            {...register("newPassword")}
            className="text-gray-400 dark:text-white bg-white dark:bg-[#535353]"
            id="new-password"
            type="password"
            placeholder="••••••••"
          />
          {errors.newPassword && (
            <p className="text-red-500 text-sm">
              {t(errors.newPassword.message || "")}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="confirm-password"
            className="text-black dark:text-white"
          >
            {t("Confirm Password")}
          </Label>
          <Input
            {...register("confirmPassword")}
            className="text-gray-400 dark:text-white bg-white dark:bg-[#535353]"
            id="confirm-password"
            type="password"
            placeholder="••••••••"
          />
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm">
              {t(errors.confirmPassword.message || "")}
            </p>
          )}
        </div>
      </div>
      <button
        type="submit"
        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200"
      >
        {t("Update Password")}
      </button>
    </form>
  );
}
