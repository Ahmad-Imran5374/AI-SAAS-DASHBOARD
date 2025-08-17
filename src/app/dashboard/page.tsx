import DashboardLayout from "./DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  
  if (!user) {
    console.log("No user found, redirecting to login");
    redirect("/login"); 
  }

  return (
    <DashboardLayout user={user}>
      <div className="p-4">
        <h2 className="text-xl font-bold">Welcome back, {user.tenantId}</h2>
        <p className="text-sm text-gray-600">
          Roles: {user.roles.join(", ")}
        </p>
      </div>
    </DashboardLayout>
  );
}