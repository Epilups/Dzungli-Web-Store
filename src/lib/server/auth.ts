import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db/connection';
import type { RequestEvent } from '@sveltejs/kit';
import { parse } from 'cookie';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = '7d';

export interface User {
  id: number;
  email: string;
  first_name: string | null;
  last_name: string | null;
  is_admin: boolean;
}

export interface JWTPayload {
  userId: number;
  email: string;
  isAdmin: boolean;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function generateToken(user: User): string {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    isAdmin: user.is_admin
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

export async function getUserFromRequest(event: RequestEvent): Promise<User | null> {
  const cookies = event.request.headers.get('cookie');
  if (!cookies) return null;

  const parsedCookies = parse(cookies);
  const token = parsedCookies.auth_token;
  
  if (!token) return null;

  const payload = verifyToken(token);
  if (!payload) return null;

  const users = await query<User>(
    'SELECT id, email, first_name, last_name, is_admin FROM users WHERE id = $1',
    [payload.userId]
  );

  return users[0] || null;
}

export async function registerUser(
  email: string,
  password: string,
  firstName?: string,
  lastName?: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    // Check if user already exists
    const existing = await query<User>(
      'SELECT id FROM users WHERE email = $1',
      [email]
    );

    if (existing.length > 0) {
      return { error: 'User with this email already exists' };
    }

    const passwordHash = await hashPassword(password);

    const users = await query<User>(
      `INSERT INTO users (email, password_hash, first_name, last_name) 
       VALUES ($1, $2, $3, $4) 
       RETURNING id, email, first_name, last_name, is_admin`,
      [email, passwordHash, firstName || null, lastName || null]
    );

    const user = users[0];
    const token = generateToken(user);

    return { user, token };
  } catch (error) {
    console.error('Registration error:', error);
    return { error: 'Registration failed' };
  }
}

export async function loginUser(
  email: string,
  password: string
): Promise<{ user: User; token: string } | { error: string }> {
  try {
    const users = await query<User & { password_hash: string }>(
      'SELECT id, email, password_hash, first_name, last_name, is_admin FROM users WHERE email = $1',
      [email]
    );

    if (users.length === 0) {
      return { error: 'Invalid email or password' };
    }

    const user = users[0];
    const isValid = await verifyPassword(password, user.password_hash);

    if (!isValid) {
      return { error: 'Invalid email or password' };
    }

    const { password_hash, ...userWithoutPassword } = user;
    const token = generateToken(userWithoutPassword);

    return { user: userWithoutPassword, token };
  } catch (error) {
    console.error('Login error:', error);
    return { error: 'Login failed' };
  }
}

export async function requireAuth(event: RequestEvent): Promise<User | Response> {
  const user = await getUserFromRequest(event);
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return user;
}

export async function requireAdmin(event: RequestEvent): Promise<User | Response> {
  const user = await getUserFromRequest(event);
  
  if (!user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  if (!user.is_admin) {
    return new Response(JSON.stringify({ error: 'Forbidden - Admin access required' }), {
      status: 403,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return user;
}