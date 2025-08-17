import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NotificationService } from "@/lib/notification.service";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: "fast-5374" }
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Organization not found" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        uniq_tenant_email: {
          tenantId: tenant.id,
          email
        }
      },
      include: {
        roles: { include: { role: true } },
        tenant: true
      }
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const welcomeMessages = [
      `Welcome back, ${user.name || "valued member"}! 🌟 Your dashboard is ready.`,
      `Great to see you again! ${tenant.name} missed you. 🚀`,
      `Login successful! Let's create something amazing today. 💡`,
      `You're in! ${tenant.name}'s tools are at your fingertips. 🛠️`,
      `Access granted! Your last login was from this device. ✅`,
    ];
    const randomMessage =
      welcomeMessages[Math.floor(Math.random() * welcomeMessages.length)];

    await NotificationService.createNotification({
      tenantId: user.tenantId,
      title: "Successful Login 👋",
      body: `${randomMessage}\n\nLogged in at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}`,
      recipientIds: [user.id],
    });

    if (!process.env.JWT_SECRET) {
      throw new Error("JWT_SECRET is not set");
    }

    const accessToken = jwt.sign(
      {
        name: user.name,
        userId: user.id,
        tenantId: user.tenantId,
        roles: user.roles.map((r) => r.role.name),
      },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const response = NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        roles: user.roles.map((r) => r.role.name),
      },
      redirectUrl: "/dashboard",
    });

    response.cookies.set("token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 500 }
    );
  }
}
