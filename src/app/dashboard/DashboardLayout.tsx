"use client";

import { useState, useEffect } from "react";
import { User, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";
import { NotificationBadge } from "@/components/NotificationBadge";
import { DesktopSidebar } from "@/app/dashboard/components/DesktopSidebar";
import { MobileMenu } from "@/app/dashboard/components/MobileMenu";
import { UserDropdown } from "@/app/dashboard/components/UserDropdown";
import { MenuItem } from "@/app/dashboard/components/RoleBasedMenu";

type Role = "Super_Admin" | "Admin" | "User" | "Manager";

interface DashboardLayoutProps {
  user: {
    name?: string;
    email?: string;
    roles: string[];
  };
  children: React.ReactNode;
}

const roleMenus: Record<Role, MenuItem[]> = {
  Admin: [
    { label: "Overview", href: "/dashboard", icon: <span>📊</span> },
    { label: "Users", href: "/dashboard/users", icon: <span>👥</span> },
    { label: "Settings", href: "/dashboard/settings", icon: <span>⚙️</span> },
  ],
  User: [
    { label: "Overview", href: "/dashboard", icon: <span>📊</span> },
    { label: "Profile", href: "/dashboard/profile", icon: <span>👤</span> },
  ],
  Manager: [
    { label: "Overview", href: "/dashboard", icon: <span>📊</span> },
    { label: "Team", href: "/dashboard/team", icon: <span>👥</span> },
  ],
  Super_Admin: [
    { label: "Overview", href: "/dashboard", icon: <span>📊</span> },
    { label: "Users", href: "/dashboard/users", icon: <span>👥</span> },
    { label: "Settings", href: "/dashboard/settings", icon: <span>⚙️</span> },
    { label: "Tenants", href: "/dashboard/tenants", icon: <span>🏢</span> },
    { label: "Roles", href: "/dashboard/roles", icon: <span>🔒</span> },
    { label: "System Logs", href: "/dashboard/logs", icon: <span>📝</span> },
    { label: "Billing", href: "/dashboard/billing", icon: <span>💳</span> },
  ],
};

export default function DashboardLayout({
  children,
  user,
}: DashboardLayoutProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setCollapsed(false);
      }
    };

    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      const saved = localStorage.getItem("sidebar-collapsed");
      if (saved) setCollapsed(JSON.parse(saved));
    }
  }, [isMobile]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".user-dropdown")) {
        setShowDropdown(false);
      }
      if (
        isMobile &&
        !target.closest(".mobile-sidebar") &&
        !target.closest(".mobile-menu-button")
      ) {
        setCollapsed(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      localStorage.setItem("sidebar-collapsed", JSON.stringify(collapsed));
    }
  }, [collapsed, isMobile]);

  const logout = async () => {
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        window.location.href = "/login";
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const role = user.roles[0] as Role;
  const menus = roleMenus[role] || [];

  return (
    <div
      className={`min-h-screen flex ${
        theme === "light" ? "bg-gray-50 text-gray-800" : "bg-gray-900 text-gray-100"
      }`}
    >
      {!isMobile && (
        <DesktopSidebar
          items={menus}
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed(!collapsed)}
        />
      )}

      <div className="flex flex-col flex-1">
        <header
          className={`flex justify-between items-center ${
            theme === "light" ? "bg-white border-gray-200" : "bg-gray-800 border-gray-700"
          } border-b px-6 py-4 shadow-md`}
        >
          <div className="flex items-center">
            {isMobile && (
              <button
                onClick={() => setCollapsed(!collapsed)}
                className={`p-2 rounded-full mobile-menu-button mr-4 ${
                  theme === "light"
                    ? "hover:bg-gray-200 text-gray-700"
                    : "hover:bg-gray-700 text-gray-200"
                }`}
              >
                <Menu size={20} />
              </button>
            )}
            <h1
              className={`font-semibold text-lg ${
                theme === "light" ? "text-blue-600" : "text-blue-400"
              }`}
            >
              Dashboard
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleTheme();
              }}
              className={`p-2 rounded-full ${
                theme === "light"
                  ? "hover:bg-gray-200 text-gray-700"
                  : "hover:bg-gray-700 text-gray-200"
              }`}
            >
              {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
            </button>
            <NotificationBadge />
            <span
              className={`hidden sm:block ${
                theme === "light" ? "text-gray-700" : "text-gray-200"
              }`}
            >
              {user.name ?? "Guest"}
            </span>

            <div className="relative user-dropdown">
              <button
                className={`p-2 rounded-full ${
                  theme === "light"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-blue-700 hover:bg-blue-800"
                } text-white`}
                onClick={() => setShowDropdown(!showDropdown)}
              >
                <User size={18} />
              </button>

              <UserDropdown
                isOpen={showDropdown}
                onClose={() => setShowDropdown(false)}
                onLogout={logout}
                userName={user.name}
              />
            </div>
          </div>
        </header>

        <MobileMenu
          items={menus}
          isOpen={collapsed && isMobile}
          onItemClick={() => setCollapsed(false)}
        />

        <main
          className={`flex-1 overflow-y-auto p-6 ${
            theme === "light" ? "bg-gray-50" : "bg-gray-900"
          }`}
        >
          <div
            className={`p-6 rounded-2xl shadow-lg ${
              theme === "light" ? "bg-white" : "bg-gray-800"
            }`}
          >
            {children}
          </div>
        </main>

        <footer
          className={`py-4 text-center ${
            theme === "light"
              ? "bg-gray-200 text-gray-700"
              : "bg-gray-800 text-gray-300"
          }`}
        >
          © {new Date().getFullYear()} AI SaaS Platform
        </footer>
      </div>
    </div>
  );
}