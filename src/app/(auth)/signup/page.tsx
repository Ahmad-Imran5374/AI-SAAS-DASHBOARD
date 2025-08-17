"use client";

import { useState } from "react";
import Link from "next/link";

export default function SignupPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    organizationCode: "",
    role: "USER",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.email.match(/^[^@\s]+@[^@\s]+\.[^@\s]+$/))
      newErrors.email = "Valid email required";
    if (form.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!form.organizationCode.trim())
      newErrors.organizationCode = "Organization code required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setLoading(true);
      setServerError("");

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Signup failed. Try again.");
      } else {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        window.location.href = "/dashboard";
      }
    } catch {
      setServerError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Header */}
      <header className="w-full py-6 px-8 flex justify-between items-center shadow-md bg-white dark:bg-gray-800">
        <h1 className="text-2xl text-nowrap font-bold">AI SaaS Platform</h1>
        <nav className="space-x-6  sm:flex items-center">
          <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Login
          </Link>
        </nav>
      </header>

      {/* Signup Form Section */}
      <section className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white dark:bg-gray-800 p-10 rounded-2xl shadow-lg w-full max-w-md">
          <h2 className="text-3xl font-bold text-center mb-6 text-blue-600">Create Account</h2>
          <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
            Sign up to start using <span className="font-semibold">AI SaaS Platform</span>
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2">Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.name}
                onChange={handleChange}
              />
              {errors.name && <p className="text-sm text-red-500 mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                name="email"
                placeholder="you@example.com"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
              />
              {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.password}
                onChange={handleChange}
              />
              {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium mb-2">Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.confirmPassword}
                onChange={handleChange}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Organization Code */}
            <div>
              <label className="block text-sm font-medium mb-2">Organization Code</label>
              <input
                type="text"
                name="organizationCode"
                placeholder="ORG-12345"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.organizationCode}
                onChange={handleChange}
              />
              {errors.organizationCode && (
                <p className="text-sm text-red-500 mt-1">{errors.organizationCode}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium mb-2">Role</label>
              <select
                name="role"
                className="w-full p-3 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 
                           focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.role}
                onChange={handleChange}
              >
                <option value="USER">User</option>
                <option value="MANAGER">Manager</option>
              </select>
            </div>

            {/* Server Error */}
            {serverError && (
              <div className="text-red-600 text-sm font-medium bg-red-100 dark:bg-red-900 dark:text-red-300 p-3 rounded">
                {serverError}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
            >
              {loading ? "Signing up..." : "Sign Up"}
            </button>
          </form>

          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 text-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
        © {new Date().getFullYear()} AI SaaS Platform. All rights reserved.
      </footer>
    </div>
  );
}
