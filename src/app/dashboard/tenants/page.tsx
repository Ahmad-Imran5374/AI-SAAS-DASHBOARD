import DashboardLayout from "../DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function TenantsPage() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    redirect("/login");
  }
  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Tenants Management</h1>
        <p className="mt-2 text-gray-600">
          Create and manage organizations using the platform.
        </p>
      </div>
    </DashboardLayout>
  );
}
