import React from "react";
import { Calendar, Mail, MapPin, Phone, User } from "lucide-react";
import { UserType } from "../instance";
import { format } from "date-fns";

export default function Profile({ user }: { user: UserType }) {
  const getGenderLabel = (gender: 0 | 1 | 2 | null | undefined) => {
    switch (gender) {
      case 0:
        return "Not specified";
      case 1:
        return "Male";
      case 2:
        return "Female";
      default:
        return "Not specified";
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return "Not specified";
    try {
      return format(new Date(dateString), "MMMM d, yyyy");
    } catch (e) {
      return "Invalid date" + e;
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-black dark:text-white">{user.name}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Mail className="h-5 w-5 text-black dark:text-white" />
          <div>
            <p className="text-black dark:text-white">{user.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Phone className="h-5 w-5 text-black dark:text-white" />
          <div>
            <p className="text-black dark:text-white">
              {user.phone || "Not provided"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 ">
          <User className="h-5 w-5 text-black dark:text-white" />
          <div className="text-black dark:text-white">
            <p>
              {getGenderLabel(
                user.gender === "1"
                  ? 1
                  : user.gender === "2"
                  ? 2
                  : user.gender === "0" ||
                    user.gender === null ||
                    user.gender === undefined
                  ? 0
                  : undefined
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-black dark:text-white" />
          <div>
            <p className="text-black dark:text-white">
              {formatDate(user.dateOfBirth)}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="h-5 w-5  mt-0.5 text-black dark:text-white" />
          <div>
            <p className="whitespace-pre-wrap text-black dark:text-white">
              {user.address || "Not provided"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
