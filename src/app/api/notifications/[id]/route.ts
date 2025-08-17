import { NotificationService } from "@/lib/notification.service";
import { getCurrentUser } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await NotificationService.markAsRead(Number(params.id));
  return NextResponse.json({ success: true });
}