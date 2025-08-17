"use client";

import Link from "next/link";
import Image from "next/image";
import { useTheme } from "@/context/theme-context";
import { Sun, Moon } from "lucide-react";

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`min-h-screen flex flex-col transition-colors duration-300 ${
        isDark ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      {/* Header */}
      <header
        className={`w-full py-6 px-5 flex justify-between items-center shadow-md transition-colors duration-300 ${
          isDark ? "bg-gray-800" : "bg-white"
        }`}
      >
        <h1 className="text-2xl text-nowrap font-bold">AI SaaS Platform</h1>
        <nav className="space-x-6 flex items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors duration-300 ${
              isDark ? "hover:bg-gray-700" : "hover:bg-gray-200"
            }`}
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </button>
          <Link
            href="/login"
            className={`hidden sm:block hover:text-blue-600 ${
              isDark ? "text-gray-200" : "text-gray-800"
            }`}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="hidden sm:flex px-4 py-2 text-nowrap bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Sign Up
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center justify-between px-12 py-16">
        <div className="md:w-1/2 space-y-6">
          <h2 className="text-4xl font-extrabold leading-tight">
            Build Smarter with <span className="text-blue-600">AI Tools</span>
          </h2>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-600"}`}>
            Our multi-tenant SaaS platform gives your team AI-powered tools with
            role-based access, seamless collaboration, and secure authentication.
          </p>
          <div className="space-x-4">
            <Link
              href="/signup"
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Get Started
            </Link>
            <Link
              href="/login"
              className={`px-6 py-3 border border-blue-600 text-blue-600 rounded-lg ${
                isDark ? "hover:bg-gray-700" : "hover:bg-blue-50"
              }`}
            >
              Login
            </Link>
          </div>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <Image
            src="/ai.jpg"
            alt="AI SaaS Hero"
            width={600}
            height={400}
            className="w-full"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className={`px-12 py-16 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
        <h3 className="text-3xl font-bold text-center mb-12">Why Choose Us?</h3>
        <div className="grid md:grid-cols-3 gap-8">
          <div className={`rounded-lg shadow p-6 text-center ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <Image
              src="/role-based-access.jpg"
              alt="Role-Based Access"
              width={128}
              height={128}
              className="mx-auto mb-4"
            />
            <h4 className="font-semibold text-xl mb-2">Role-Based Access</h4>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Securely manage users and permissions across multiple tenants.
            </p>
          </div>

          <div className={`rounded-lg shadow p-6 text-center ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <Image
              src="/collaboration.jpg"
              alt="Collaboration"
              width={128}
              height={128}
              className="mx-auto mb-4"
            />
            <h4 className="font-semibold text-xl mb-2">Collaboration</h4>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Managers and users get dashboards tailored to their needs.
            </p>
          </div>

          <div className={`rounded-lg shadow p-6 text-center ${isDark ? "bg-gray-700" : "bg-white"}`}>
            <Image
              src="/notifications.jpg"
              alt="Notifications"
              width={128}
              height={128}
              className="mx-auto mb-4"
            />
            <h4 className="font-semibold text-xl mb-2">Notifications</h4>
            <p className={isDark ? "text-gray-300" : "text-gray-600"}>
              Stay updated with system messages and admin announcements.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`px-12 py-16 flex flex-col md:flex-row items-center justify-between ${isDark ? "bg-gray-800" : "bg-blue-50"}`}>
        <div className="md:w-1/2 space-y-6">
          <h3 className="text-3xl font-bold">Start your AI journey today</h3>
          <p className={`text-lg ${isDark ? "text-gray-300" : "text-gray-700"}`}>
            Sign up as a Super Admin and create your first organization in minutes.
          </p>
          <Link
            href="/signup"
            className={`px-6 py-3 rounded-lg font-medium ${isDark ? "bg-blue-600 hover:bg-blue-700" : "bg-blue-600 hover:bg-blue-700"} text-white`}
          >
            Sign Up Now
          </Link>
        </div>
        <div className="md:w-1/2 mt-10 md:mt-0">
          <Image
            src="/cta-banner.jpg"
            alt="CTA Banner"
            width={600}
            height={400}
            className="w-full rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 text-center ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-600"}`}>
        © {new Date().getFullYear()} AI SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
}