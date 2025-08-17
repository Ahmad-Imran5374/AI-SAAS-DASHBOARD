import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    const { name, email, password, organizationCode, role = "User" } = await req.json();

    if (!email || !password || !organizationCode) {
      return NextResponse.json(
        { error: "Email, password and organization code are required" },
        { status: 400 }
      );
    }

    const tenant = await prisma.tenant.findUnique({
      where: { slug: organizationCode },
    });

    if (!tenant) {
      return NextResponse.json(
        { error: "Invalid organization code" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        tenantId: tenant.id,
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        tenantId: tenant.id,
        email,
        name,
        passwordHash: hashedPassword,
        roles: {
          create: {
            role: { connect: { name: role } },
          },
        },
      },
    });

    const tokenId = crypto.randomBytes(32).toString('hex');

    const accessToken = jwt.sign(
      {
        userId: user.id.toString(),
        tenantId: tenant.id.toString(),
        roles: [role]
      },
      process.env.JWT_SECRET!,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        userId: user.id.toString(),
        tokenId 
      },
      process.env.JWT_REFRESH_SECRET!,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: {
        userId: user.id,
        tokenId, 
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        device: "web",
        ipAddr: req.headers.get("x-forwarded-for") || "unknown"
      },
    });

    return NextResponse.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id.toString(),
        email: user.email,
        name: user.name,
        roles: [role]
      }
    });

  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { 
        error: "Registration service unavailable",
        details: process.env.NODE_ENV === "development" && error instanceof Error ? error.message : undefined
      },
      { status: 500 }
    );
  }
}