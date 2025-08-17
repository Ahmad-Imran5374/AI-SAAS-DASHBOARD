"use client";

import { RoleBasedMenu,MenuItem } from "./RoleBasedMenu";
import { Menu, X } from "lucide-react";
import { useTheme } from "@/context/theme-context";

interface DesktopSidebarProps {
  items: MenuItem[];
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function DesktopSidebar({
  items,
  collapsed,
  onToggleCollapse,
}: DesktopSidebarProps) {
  const { theme } = useTheme();

  return (
    <aside
      className={`transition-all duration-300 ${
        theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
      } shadow-lg border-r ${collapsed ? "w-16" : "w-64"}`}
    >
      <div
        className={`flex items-center justify-between p-4 border-b ${
          theme === "light" ? "border-gray-200" : "border-gray-700"
        }`}
      >
        <span
          className={`font-bold text-lg ${
            theme === "light" ? "text-blue-600" : "text-blue-400"
          }`}
        >
          {collapsed ? "" : "AI SaaS Platform"}
        </span>
        <button
          onClick={onToggleCollapse}
          className={`${
            theme === "light"
              ? "text-gray-600 hover:text-blue-600"
              : "text-gray-300 hover:text-blue-400"
          }`}
        >
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <RoleBasedMenu items={items} collapsed={collapsed} />
    </aside>
  );
}