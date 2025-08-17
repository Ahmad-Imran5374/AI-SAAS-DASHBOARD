import DashboardLayout from "../DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function RolePage() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    redirect("/login");
  }
  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Roles</h1>
        <p className="mt-2 text-gray-600">
          Manage user roles, permissions, and access levels here.
        </p>
      </div>
    </DashboardLayout>
  );
}
