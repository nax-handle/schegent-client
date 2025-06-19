"use client";
import React, { useState } from "react";
import { t } from "i18next";
import { Separator } from "@/components/ui/separator";
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
import {
  Smartphone,
  Monitor,
  Tablet,
  LogOut,
  MapPin,
  Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSessions, useRevokeSession } from "@/hooks/auth/use.auth";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface Device {
  refresh_token: string;
  user_agent: string;
  ip_address: string;
  device: string;
  created_at: string;
  expires_at: string;
  revoked: boolean;
  session_id: string;
}

export default function Deviceloggedin() {
  const { data: devicesObj, isLoading, error } = useSessions();
  const { revokeSession, isRevokingSession } = useRevokeSession();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading devices</div>;

  const devices: Device[] = devicesObj ? Object.values(devicesObj) : [];

  const sortedDevices = devices.sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
  const currentSessionId =
    sortedDevices.length > 0 ? sortedDevices[0].session_id : "";

  const handleRevokeSession = (sessionId: string) => {
    revokeSession(
      { sessionId },
      {
        onSuccess: () => {
          window.location.reload();
        },
      }
    );
  };

  const getDeviceIcon = (type?: string) => {
    const deviceType = (type || "").toLowerCase();
    switch (deviceType) {
      case "desktop":
      case "web":
        return <Monitor className="w-5 h-5" />;
      case "mobile":
      case "phone":
        return <Smartphone className="w-5 h-5" />;
      case "tablet":
        return <Tablet className="w-5 h-5" />;
      default:
        return <Monitor className="w-5 h-5" />;
    }
  };

  const activeDevices = sortedDevices.filter(
    (device) => device.revoked === false
  );
  const totalPages = Math.ceil(activeDevices.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentDevices = activeDevices.slice(startIndex, endIndex);

  return (
    <div className="space-y-4 text-black dark:text-white">
      {currentDevices.map((device) => {
        const isCurrent = device.session_id === currentSessionId;

        return (
          <div key={device.session_id}>
            <div className="flex items-center justify-between p-4 rounded-lg border">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-muted text-black dark:text-white">
                  {getDeviceIcon(device.device)}
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-black dark:text-white">
                      {device.device}
                    </span>
                    {isCurrent && (
                      <Badge variant="secondary" className="text-xs">
                        {t("Current device")}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-black dark:text-white" />
                      {device.ip_address}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-black dark:text-white" />
                      {new Date(device.created_at).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
              {!isCurrent && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-black dark:text-white dark:bg-white/10 hover:bg-white/20"
                      disabled={isRevokingSession}
                      onClick={() => handleRevokeSession(device.session_id)}
                    >
                      <LogOut className="w-4 h-4 mr-2 text-black dark:text-white" />
                      {t("Log out this device")}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>{t("Device Logout")}</AlertDialogTitle>
                      <AlertDialogDescription>
                        {t(
                          "Are you sure you want to log out of this device? You will need to log in again to access your account."
                        )}
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>{t("Cancel")}</AlertDialogCancel>
                      <AlertDialogAction>{t("Log out")}</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>
            {device.session_id !==
              sortedDevices[sortedDevices.length - 1].session_id && (
              <Separator className="my-4" />
            )}
          </div>
        );
      })}

      {totalPages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>

            {currentPage > 2 && (
              <>
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(1)}>
                    1
                  </PaginationLink>
                </PaginationItem>
                {currentPage > 3 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
              </>
            )}

            {Array.from({ length: 3 }, (_, i) => currentPage - 1 + i)
              .filter((page) => page > 0 && page <= totalPages)
              .map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    isActive={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}

            {currentPage < totalPages - 1 && (
              <>
                {currentPage < totalPages - 2 && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}
                <PaginationItem>
                  <PaginationLink onClick={() => setCurrentPage(totalPages)}>
                    {totalPages}
                  </PaginationLink>
                </PaginationItem>
              </>
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                }
                className={
                  currentPage === totalPages
                    ? "pointer-events-none opacity-50"
                    : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
