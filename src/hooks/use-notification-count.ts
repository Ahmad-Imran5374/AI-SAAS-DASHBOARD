"use client";

import { useEffect, useState } from "react";

export function useNotificationCount() {
  const [unreadCount, setUnreadCount] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/notifications/unread-count");
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
      }

      const data = await res.json();
      
      if (typeof data.count === "number") {
        setUnreadCount(data.count);
        setError(null);
      } else {
        throw new Error("Invalid response format");
      }
    } catch (err) {
      console.error("Failed to fetch unread count:", err);
      setError("Failed to load notifications");
      setUnreadCount(0);
    }
  };

  const decrementCount = () => {
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  useEffect(() => {
    fetchUnreadCount();
    const interval = setInterval(fetchUnreadCount, 30000);

    return () => clearInterval(interval);
  }, []);

  return { unreadCount, error, decrementCount, refreshCount: fetchUnreadCount };
}