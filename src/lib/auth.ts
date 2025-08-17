import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {cookies} from "next/headers"
const cookieConfig = {
  secure: process.env.NODE_ENV === 'production',
  httpOnly: true,
  sameSite: 'lax' as const, 
  path: '/',
  maxAge: 60 * 15, 
};

const refreshCookieConfig = {
  ...cookieConfig,
  maxAge: 60 * 60 * 24 * 7, 
};


export interface JWTPayload {
  userId: string;
  tenantId: string;
  roles: string[];
  iat: number;
  exp: number;
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("token")?.value; 
    if (!token) {
      console.log("No token found in cookies");
      return null;
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    return decoded;
  } catch (err) {
    console.error("❌ getCurrentUser error:", err);
    return null;
  }
}

async function verifyToken(token: string, secret: string): Promise<boolean> {
  try {
    const encoder = new TextEncoder();
    const [header, payload, signature] = token.split('.');
    const data = encoder.encode(`${header}.${payload}`);
    
    const signatureBuffer = Uint8Array.from(
      atob(signature.replace(/-/g, '+').replace(/_/g, '/')),
      c => c.charCodeAt(0)
    );

    return await crypto.subtle.verify(
      { name: 'HMAC', hash: 'SHA-256' },
      await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
      ),
      signatureBuffer,
      data
    );
  } catch (error) {
    console.error('Token verification failed:', error);
    return false;
  }
}

export function setAuthCookies({
  accessToken,
  refreshToken,
  res,
}: {
  accessToken: string;
  refreshToken: string;
  res?: NextResponse;
}) {
  if (res) {
    res.cookies.set('accessToken', accessToken, cookieConfig);
    res.cookies.set('refreshToken', refreshToken, refreshCookieConfig);
  } else if (typeof window !== 'undefined') {
    document.cookie = `accessToken=${accessToken}; ${Object.entries({
      ...cookieConfig,
      httpOnly: false 
    }).map(([k, v]) => `${k}=${v}`).join('; ')}`;
    
    document.cookie = `refreshToken=${refreshToken}; ${Object.entries({
      ...refreshCookieConfig,
      httpOnly: false
    }).map(([k, v]) => `${k}=${v}`).join('; ')}`;
  }
}

export function getAccessToken(req?: NextRequest): string | null {
  if (req) {
    return req.cookies.get('accessToken')?.value || null;
  } else if (typeof window !== 'undefined') {
    return document.cookie
      .split('; ')
      .find(row => row.startsWith('accessToken='))
      ?.split('=')[1] || null;
  }
  return null;
}

export function clearAuthCookies(res?: NextResponse) {
  if (res) {
    res.cookies.delete('accessToken');
    res.cookies.delete('refreshToken');
  } else if (typeof window !== 'undefined') {
    const expires = new Date(0).toUTCString();
    document.cookie = `accessToken=; expires=${expires}; path=/`;
    document.cookie = `refreshToken=; expires=${expires}; path=/`;
  }
}

export async function verifyAuth(token: string | null): Promise<boolean> {
  if (!token) return false;
  
  try {
    return await verifyToken(token, process.env.JWT_SECRET!);
  } catch (error) {
    console.error('Auth verification error:', error);
    return false;
  }
}

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + process.env.PEPPER); // Add pepper for extra security
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}