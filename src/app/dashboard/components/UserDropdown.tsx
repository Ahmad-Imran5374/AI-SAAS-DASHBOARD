"use client";

import { LogOut } from "lucide-react";
import { useTheme } from "@/context/theme-context";

interface UserDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
  userName?: string;
}

export function UserDropdown({
  isOpen,
  onLogout,
  userName,
}: UserDropdownProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className={`absolute right-0 mt-2 shadow-lg rounded-lg w-48 border z-50 transition-colors ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-800 border-gray-700"
      }`}
    >
      <div className="p-2 border-b">
        <p className="text-sm font-medium truncate">{userName || "User"}</p>
      </div>
      <button
        onClick={onLogout}
        className={`flex items-center gap-2 w-full px-4 py-2 text-left rounded-lg transition-colors ${
          theme === "light"
            ? "text-gray-700 hover:bg-gray-100"
            : "text-gray-200 hover:bg-gray-700"
        }`}
      >
        <LogOut size={16} /> Logout
      </button>
    </div>
  );
}