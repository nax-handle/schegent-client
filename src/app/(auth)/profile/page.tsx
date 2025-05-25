"use client";
import { useState } from "react";
import { Edit2, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useTranslation } from "react-i18next";
import "@/../i18n";
import EditProfile from "@/components/auth/editProfile";
import EditPassword from "@/components/auth/editPassword";
import Profile from "@/components/auth/profile";

type UserType = {
  name: string;
  username: string;
  email: string;
  phone: string | null;
  avatar_url: string | null;
  gender: 0 | 1 | 2;
  date_of_birth: string | null;
  address: string | null;
};

export default function ProfilePage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<UserType>({
    name: "John Doe",
    username: "johndoe",
    email: "john.doe@example.com",
    phone: "+1 (555) 123-4567",
    avatar_url: "/placeholder.svg?height=128&width=128",
    gender: 1,
    date_of_birth: "1990-05-15",
    address: "123 Main Street, Apt 4B, New York, NY 10001, United States",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<UserType>(user);

  const handleEdit = () => {
    setEditedUser(user);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  const handleSave = () => {
    setUser(editedUser);
    setIsEditing(false);
  };

  return (
    <div className=" h-screen">
      <div className="container mx-auto py-8 px-4 max-w-4xl ">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold ">{t("Profile")}</h1>
          {!isEditing ? (
            <Button
              onClick={handleEdit}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit2 className="h-4 w-4" />
              {t("Edit Profile")}
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button
                className="w-full bg-[#5052fb] hover:bg-[#5370d1] text-white "
                onClick={handleSave}
                variant="default"
              >
                <Save className="h-4 w-4" />
                {t("Save")}
              </Button>
              <Button
                onClick={handleCancel}
                variant="outline"
                className="flex items-center gap-2"
              >
                <X className="h-4 w-4" />
                {t("Cancel")}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="md:col-span-1">
            <CardHeader className="flex flex-col items-center">
              <div className="relative mb-4">
                <Avatar className="h-32 w-32 text-black dark:text-white">
                  <AvatarImage
                    src={
                      user.avatar_url || "/placeholder.svg?height=128&width=128"
                    }
                    alt={user.name}
                  />
                  <AvatarFallback>
                    {user.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <div className="absolute bottom-0 right-0">
                    <Button
                      size="sm"
                      variant="outline"
                      className="rounded-full h-8 w-8 p-0 "
                    >
                      <Edit2 className="h-4 w-4 text-black dark:text-white" />
                      <span className="sr-only">{t("Change avatar")}</span>
                    </Button>
                  </div>
                )}
              </div>
              <CardTitle className="text-center text-black dark:text-white">
                {user.name}
              </CardTitle>
              <p className=" text-center text-black dark:text-white">
                @{user.username}
              </p>
            </CardHeader>
          </Card>

          {/* Personal Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">
                {t("Personal Information")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <EditProfile user={user} />
              ) : (
                <Profile user={user} />
              )}
            </CardContent>
          </Card>

          {/* Security Section */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle className="text-black dark:text-white">
                {t("Security")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <EditPassword />
              ) : (
                <div className="flex items-center gap-2">
                  <p className="text-black dark:text-white">
                    {t("Password is set and hidden for security")}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="ml-auto text-black dark:text-white"
                    onClick={handleEdit}
                  >
                    {t("Change Password")}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
