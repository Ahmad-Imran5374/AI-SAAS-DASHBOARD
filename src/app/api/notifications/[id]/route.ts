import { NextRequest, NextResponse } from "next/server";
import { NotificationService } from "@/lib/notification.service";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> } // 👈 fix: make params a Promise
): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params; // 👈 need to await here
    await NotificationService.markAsRead(Number(id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("PUT /notifications/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
