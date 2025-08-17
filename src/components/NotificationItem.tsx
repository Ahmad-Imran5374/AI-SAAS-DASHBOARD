"use client";

import { NotificationWithStatus } from "@/types/notification";

interface NotificationItemProps {
  notification: NotificationWithStatus;
  onClose: () => void;
  onMarkAsRead: () => void;
}

export function NotificationItem({
  notification,
  onClose,
  onMarkAsRead,
}: NotificationItemProps) {
  const markAsRead = async () => {
    if (!notification.isRead) {
      try {
        await fetch(`/api/notifications/${notification.deliveryId}`, {
          method: "PUT",
        });
        onMarkAsRead();
      } catch (error) {
        console.error("Failed to mark as read:", error);
      }
    }
    onClose();
  };

  return (
    <div
      className={`p-4 border-b border-gray-100 dark:border-gray-700 ${
        !notification.isRead ? "bg-blue-50 dark:bg-gray-700" : ""
      }`}
    >
      <div className="flex justify-between">
        <h4 className="font-medium">{notification.title}</h4>
        {!notification.isRead && (
          <span className="inline-block w-2 h-2 rounded-full bg-blue-500"></span>
        )}
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
        {notification.body}
      </p>
      <div className="flex justify-between items-center mt-2">
        <span className="text-xs text-gray-500">
          {new Date(notification.createdAt).toLocaleString()}
        </span>
        {!notification.isRead && (
          <button
            onClick={markAsRead}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          >
            Mark as read
          </button>
        )}
      </div>
    </div>
  );
}