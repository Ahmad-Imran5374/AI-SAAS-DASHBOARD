"use client";

import { useEffect, useState } from "react";
import { NotificationWithStatus } from "@/types/notification";
import {NotificationItem}  from "./NotificationItem";

interface NotificationDropdownProps {
  onClose: () => void;
  onNotificationRead: () => void;
}

export function NotificationDropdown({
  onClose,
  onNotificationRead,
}: NotificationDropdownProps) {
  const [notifications, setNotifications] = useState<NotificationWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNotifications() {
      try {
        const res = await fetch("/api/notifications");
        if (res.ok) {
          const data = await res.json();
          setNotifications(data);
        }
      } catch (error) {
        console.error("Failed to fetch notifications:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await fetch("/api/notifications", { method: "PUT" });
      setNotifications(notifications.map(n => ({ ...n, isRead: true })));
      notifications.filter(n => !n.isRead).forEach(() => onNotificationRead());
    } catch (error) {
      console.error("Failed to mark all as read:", error);
    }
  };

  return (
    <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg overflow-hidden z-10 border border-gray-200 dark:border-gray-700">
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="font-medium">Notifications</h3>
        <button
          onClick={markAllAsRead}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Mark all as read
        </button>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {isLoading ? (
          <div className="p-4 text-center">Loading...</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-gray-500 dark:text-gray-400">
            No notifications
          </div>
        ) : (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClose={onClose}
              onMarkAsRead={onNotificationRead}
            />
          ))
        )}
      </div>
    </div>
  );
}