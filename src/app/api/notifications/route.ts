import { NextResponse } from "next/server";
import { NotificationService } from "@/lib/notification.service";
import { getCurrentUser } from "@/lib/auth";
import { BasicNotification, NotificationWithStatus } from "@/types/notification";

export async function GET(): Promise<NextResponse<NotificationWithStatus[] | { error: string }>> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const notifications = await NotificationService.getUserNotifications(Number(user.userId));
  return NextResponse.json(notifications);
}

export async function POST(request: Request): Promise<NextResponse<BasicNotification | { error: string }>> {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const isAdmin = user.roles.some(role => role === "ADMIN");
  if (!isAdmin) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const { title, body, recipientIds } = await request.json();
  const notification = await NotificationService.createNotification({
    tenantId: Number(user.tenantId),
    createdBy: Number(user.userId),
    title,
    body,
    recipientIds,
  });

  return NextResponse.json(notification);
}