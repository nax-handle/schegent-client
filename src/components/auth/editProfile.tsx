"use client";
import { useState } from "react";
import React from "react";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { UserType } from "../instance";

export default function EditProfile({ user }: { user: UserType }) {
  const { t } = useTranslation();
  const [editedUser, setEditedUser] = useState<UserType>(user);
  const handleChange = (field: keyof UserType, value: any) => {
    setEditedUser((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-black dark:text-white">
            {t("Name")}
          </Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="name"
            value={editedUser.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-black dark:text-white">
            {t("Email")}
          </Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="email"
            type="email"
            value={editedUser.email}
            onChange={(e) => handleChange("email", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-black dark:text-white">
            {t("Phone")}
          </Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="phone"
            value={editedUser.phone || ""}
            onChange={(e) => handleChange("phone", e.target.value)}
          />
        </div>
        <div className="space-y-2 text-black dark:text-white">
          <Label htmlFor="date_of_birth">{t("Date of Birth")}</Label>
          <Input
            className="text-gray-400 dark:text-white"
            id="date_of_birth"
            type="date"
            value={editedUser.date_of_birth || ""}
            onChange={(e) => handleChange("date_of_birth", e.target.value)}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="gender" className="text-black dark:text-white">
            {t("Gender")}
          </Label>
          <RadioGroup
            value={editedUser.gender.toString()}
            onValueChange={(value) =>
              handleChange("gender", Number.parseInt(value) as 0 | 1 | 2)
            }
            className="flex gap-4 text-black dark:text-white"
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="0" id="gender-not-specified" />
              <Label htmlFor="gender-not-specified">{t("Other")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="1" id="gender-male" />
              <Label htmlFor="gender-male">{t("Male")}</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="2" id="gender-female" />
              <Label htmlFor="gender-female">{t("Female")}</Label>
            </div>
          </RadioGroup>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address" className="text-black dark:text-white">
          {t("Address")}
        </Label>
        <Textarea
          className="text-black dark:text-white"
          id="address"
          value={editedUser.address || ""}
          onChange={(e) => handleChange("address", e.target.value)}
          rows={3}
        />
      </div>
    </div>
  );
}
