import DashboardLayout from "../DashboardLayout";
import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
export default async function BillingPage() {
  const user = await getCurrentUser();

  if (!user) {
    console.log("No user found, redirecting to login");
    redirect("/login");
  }
  return (
    <DashboardLayout user={user}>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Billing & Payments</h1>
        <p className="mt-2 text-gray-600">
          Manage subscriptions, invoices, and payment history.
        </p>
      </div>
    </DashboardLayout>
  );
}
