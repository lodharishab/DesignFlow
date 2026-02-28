'use server';
import { db, isDbEnabled } from './db';
import { users } from './schema';
import { eq, desc, inArray } from 'drizzle-orm';
import type { User } from './types';
export type { User };

function rowToUser(row: typeof users.$inferSelect): User {
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    mobileNumber: row.mobileNumber || undefined,
    roles: row.roles || [],
    avatarUrl: row.avatarUrl || undefined,
    avatarHint: row.avatarHint || undefined,
    joinDate: row.joinDate ? new Date(row.joinDate) : new Date(),
    lastLogin: row.lastLogin ? new Date(row.lastLogin) : null,
    status: row.status,
    phone: row.phone || undefined,
    staffRole: row.staffRole || undefined,
  };
}

export async function getAllUsers(): Promise<User[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(users).orderBy(desc(users.joinDate));
    return rows.map(rowToUser);
  } catch (e) {
    console.error('Error fetching users:', e);
    return [];
  }
}

export async function getUserById(id: string): Promise<User | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(users).where(eq(users.id, id));
    return rows[0] ? rowToUser(rows[0]) : null;
  } catch (e) {
    console.error(`Error fetching user ${id}:`, e);
    return null;
  }
}

export async function getUsersByRole(role: string): Promise<User[]> {
  if (!isDbEnabled()) return [];
  try {
    // Filter users whose roles array contains the given role
    const allUsers = await db.select().from(users).orderBy(desc(users.joinDate));
    return allUsers.filter(u => u.roles?.includes(role)).map(rowToUser);
  } catch (e) {
    console.error(`Error fetching users by role ${role}:`, e);
    return [];
  }
}

export async function getStaffMembers(): Promise<User[]> {
  if (!isDbEnabled()) return [];
  try {
    const allUsers = await db.select().from(users).orderBy(desc(users.joinDate));
    return allUsers.filter(u => u.staffRole !== null).map(rowToUser);
  } catch (e) {
    console.error('Error fetching staff members:', e);
    return [];
  }
}

export async function createUser(data: Omit<User, 'joinDate' | 'lastLogin'> & { joinDate?: Date }): Promise<User | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(users).values({
      id: data.id,
      name: data.name,
      email: data.email,
      mobileNumber: data.mobileNumber || null,
      roles: data.roles,
      avatarUrl: data.avatarUrl || null,
      avatarHint: data.avatarHint || null,
      joinDate: data.joinDate || new Date(),
      lastLogin: null,
      status: data.status || 'Active',
      phone: data.phone || null,
      staffRole: data.staffRole || null,
    }).returning();
    return rows[0] ? rowToUser(rows[0]) : null;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.email !== undefined) updateValues.email = data.email;
    if (data.mobileNumber !== undefined) updateValues.mobileNumber = data.mobileNumber;
    if (data.roles !== undefined) updateValues.roles = data.roles;
    if (data.avatarUrl !== undefined) updateValues.avatarUrl = data.avatarUrl;
    if (data.avatarHint !== undefined) updateValues.avatarHint = data.avatarHint;
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.phone !== undefined) updateValues.phone = data.phone;
    if (data.staffRole !== undefined) updateValues.staffRole = data.staffRole;
    if (data.lastLogin !== undefined) updateValues.lastLogin = data.lastLogin;

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(users).set(updateValues).where(eq(users.id, id)).returning();
    return rows[0] ? rowToUser(rows[0]) : null;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
}

export async function deleteUser(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
}

export async function bulkUpdateUserStatus(ids: string[], status: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    await db.update(users).set({ status }).where(inArray(users.id, ids));
    return true;
  } catch (error) {
    console.error('Error bulk updating user status:', error);
    return false;
  }
}

export async function bulkDeleteUsers(ids: string[]): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    await db.delete(users).where(inArray(users.id, ids));
    return true;
  } catch (error) {
    console.error('Error bulk deleting users:', error);
    return false;
  }
}
