"use client";

import { RoleBasedMenu,MenuItem } from "./RoleBasedMenu";
import { useTheme } from "@/context/theme-context";

interface MobileMenuProps {
  items: MenuItem[];
  isOpen: boolean;
  onItemClick: () => void;
}

export function MobileMenu({ items, isOpen, onItemClick }: MobileMenuProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div
      className={`mobile-sidebar absolute left-0 right-0 top-16 z-40 shadow-lg ${
        theme === "light"
          ? "bg-white border-gray-200"
          : "bg-gray-800 border-gray-700"
      } border-b`}
    >
      <RoleBasedMenu 
        items={items} 
        collapsed={false} 
        isMobile 
        onItemClick={onItemClick}
      />
    </div>
  );
}