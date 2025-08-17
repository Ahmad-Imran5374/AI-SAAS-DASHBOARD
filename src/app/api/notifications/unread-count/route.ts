import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/notification.service";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const count = await NotificationService.getUnreadCount(Number(user.userId));
  return NextResponse.json({ count });
}   