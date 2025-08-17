"use client";

import Link from "next/link";
import { useTheme } from "@/context/theme-context";

export interface MenuItem {
  label: string;
  href: string;
  icon?: React.ReactNode;
}

interface RoleBasedMenuProps {
  items: MenuItem[];
  collapsed: boolean;
  isMobile?: boolean;
  onItemClick?: () => void;
}

export function RoleBasedMenu({
  items,
  collapsed,
  isMobile = false,
  onItemClick,
}: RoleBasedMenuProps) {
  const { theme } = useTheme();

  return (
    <nav className={`p-2 space-y-2 ${collapsed && !isMobile ? "hidden" : ""}`}>
      {items.map((item, idx) => (
        <Link
          key={idx}
          href={item.href}
          className={`flex items-center gap-3 px-3 py-2 rounded-lg font-medium ${
            theme === "light"
              ? "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              : "text-gray-200 hover:bg-gray-700 hover:text-blue-400"
          }`}
          onClick={onItemClick}
        >
          {item.icon && <span className="flex-shrink-0">{item.icon}</span>}
          {(!collapsed || isMobile) && <span>{item.label}</span>}
        </Link>
      ))}
    </nav>
  );
}