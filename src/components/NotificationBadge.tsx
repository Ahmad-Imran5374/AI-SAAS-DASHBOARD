"use client";

import { BellIcon } from "lucide-react";
import { useState } from "react";
import { NotificationDropdown } from "./NotificationDropdown";
import { useNotificationCount } from "@/hooks/use-notification-count";

export function NotificationBadge() {
  const { unreadCount, error, decrementCount } = useNotificationCount();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 relative"
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-red-500 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <NotificationDropdown 
          onClose={() => setIsOpen(false)}
          onNotificationRead={()=>decrementCount()}
        />
      )}
      {error && (
        <div className="absolute top-full right-0 mt-2 p-2 bg-red-100 text-red-800 text-sm rounded">
          {error}
        </div>
      )}
    </div>
  );
}