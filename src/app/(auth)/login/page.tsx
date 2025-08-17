"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/context/theme-context";

export default function LoginPage() { 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { theme, toggleTheme } = useTheme();

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");
  setIsLoading(true);

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Login failed");
    }

    window.location.href = data.redirectUrl || "/dashboard";
    
  } catch (err) {
    setError(err instanceof Error ? err.message : "Login failed");
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-200 ${
      theme === 'light' ? 'bg-gray-50 text-gray-800' : 'bg-gray-900 text-gray-100'
    }`}>
      {/* Header */}
      <header className={`w-full py-6 px-5 flex justify-between items-center shadow-md transition-colors ${
        theme === 'light' ? 'bg-white' : 'bg-gray-800'
      }`}>
        <h1 className="text-2xl text-nowrap font-bold">AI SaaS Platform</h1>
        <div className="flex items-center">
          <button
            onClick={toggleTheme}
            className={`p-2 rounded-full transition-colors ${
              theme === 'light' 
                ? 'hover:bg-gray-200 text-gray-700' 
                : 'hover:bg-gray-700 text-gray-200'
            }`}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <Link 
            href="/signup" 
            className={`px-4 py-2 text-nowrap rounded transition-colors ${
              theme === 'light' 
                ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                : 'bg-blue-700 hover:bg-blue-800 text-white'
            }`}
          >
            Sign Up
          </Link>
        </div>
      </header>

      {/* Login Form Section */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className={`p-10 rounded-2xl shadow-lg w-full max-w-md transition-colors ${
          theme === 'light' ? 'bg-white' : 'bg-gray-800'
        }`}>
          <h2 className={`text-3xl font-bold text-center mb-6 ${
            theme === 'light' ? 'text-blue-600' : 'text-blue-400'
          }`}>
            Welcome Back
          </h2>
          <p className={`text-center mb-8 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-300'
          }`}>
            Login to continue using <span className="font-semibold">AI SaaS Platform</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  theme === 'light' 
                    ? 'bg-gray-50 border-gray-300 focus:ring-blue-500' 
                    : 'bg-gray-700 border-gray-600 focus:ring-blue-400'
                }`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className={`block text-sm font-medium mb-2 ${
                theme === 'light' ? 'text-gray-700' : 'text-gray-200'
              }`}>
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className={`w-full p-3 border rounded-lg focus:outline-none focus:ring-2 ${
                  theme === 'light' 
                    ? 'bg-gray-50 border-gray-300 focus:ring-blue-500' 
                    : 'bg-gray-700 border-gray-600 focus:ring-blue-400'
                }`}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className={`text-sm font-medium p-3 rounded ${
                theme === 'light' 
                  ? 'text-red-600 bg-red-100' 
                  : 'text-red-300 bg-red-900'
              }`}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-lg transition-colors ${
                theme === 'light' 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-blue-700 hover:bg-blue-800'
              } text-white`}
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className={`text-center text-sm mt-6 ${
            theme === 'light' ? 'text-gray-600' : 'text-gray-400'
          }`}>
            Don't have an account?{" "}
            <Link 
              href="/signup" 
              className={`hover:underline ${
                theme === 'light' ? 'text-blue-600' : 'text-blue-400'
              }`}
            >
              Sign Up
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-6 text-center transition-colors ${
        theme === 'light' 
          ? 'bg-gray-200 text-gray-600' 
          : 'bg-gray-700 text-gray-300'
      }`}>
        © {new Date().getFullYear()} AI SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
}