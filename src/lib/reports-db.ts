'use server';
import { db, isDbEnabled } from './db';
import { reports } from './schema';
import { eq, desc } from 'drizzle-orm';
import type { ReportStatus, Report } from './types';
export type { ReportStatus, Report };

// ============================================================================
// Row mapper
// ============================================================================

function rowToReport(row: typeof reports.$inferSelect): Report {
  return {
    id: row.id,
    orderId: row.orderId || undefined,
    reporterId: row.reporterId || undefined,
    reporterName: row.reporterName,
    reportedUserId: row.reportedUserId || undefined,
    reportedUserName: row.reportedUserName || undefined,
    subject: row.subject,
    details: row.details || undefined,
    reportDate: row.reportDate ? new Date(row.reportDate) : new Date(),
    status: (row.status || 'Open') as ReportStatus,
  };
}

// ============================================================================
// Reports CRUD
// ============================================================================

export async function getAllReports(): Promise<Report[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(reports).orderBy(desc(reports.reportDate));
    return rows.map(rowToReport);
  } catch (e) {
    console.error('Error fetching reports:', e);
    return [];
  }
}

export async function getReportById(id: string): Promise<Report | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(reports).where(eq(reports.id, id));
    return rows[0] ? rowToReport(rows[0]) : null;
  } catch (e) {
    console.error('Error fetching report by id:', e);
    return null;
  }
}

export async function getReportsByReporter(reporterId: string): Promise<Report[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(reports)
      .where(eq(reports.reporterId, reporterId))
      .orderBy(desc(reports.reportDate));
    return rows.map(rowToReport);
  } catch (e) {
    console.error('Error fetching reports by reporter:', e);
    return [];
  }
}

export async function getReportsByReportedUser(reportedUserId: string): Promise<Report[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(reports)
      .where(eq(reports.reportedUserId, reportedUserId))
      .orderBy(desc(reports.reportDate));
    return rows.map(rowToReport);
  } catch (e) {
    console.error('Error fetching reports by reported user:', e);
    return [];
  }
}

export async function createReport(data: Report): Promise<Report | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(reports).values({
      id: data.id,
      orderId: data.orderId || null,
      reporterId: data.reporterId || null,
      reporterName: data.reporterName,
      reportedUserId: data.reportedUserId || null,
      reportedUserName: data.reportedUserName || null,
      subject: data.subject,
      details: data.details || null,
      reportDate: data.reportDate || new Date(),
      status: data.status || 'Open',
    }).returning();
    return rows[0] ? rowToReport(rows[0]) : null;
  } catch (error) {
    console.error('Error creating report:', error);
    return null;
  }
}

export async function updateReport(id: string, data: Partial<Report>): Promise<Report | null> {
  if (!isDbEnabled()) return null;
  try {
    const uv: Record<string, unknown> = {};
    if (data.status !== undefined) uv.status = data.status;
    if (data.details !== undefined) uv.details = data.details;
    if (data.subject !== undefined) uv.subject = data.subject;
    if (Object.keys(uv).length === 0) return null;
    const rows = await db.update(reports).set(uv).where(eq(reports.id, id)).returning();
    return rows[0] ? rowToReport(rows[0]) : null;
  } catch (error) {
    console.error('Error updating report:', error);
    return null;
  }
}

export async function updateReportStatus(id: string, status: ReportStatus): Promise<void> {
  if (!isDbEnabled()) return;
  try {
    await db.update(reports).set({ status }).where(eq(reports.id, id));
  } catch (error) {
    console.error('Error updating report status:', error);
    throw error;
  }
}

export async function deleteReport(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(reports).where(eq(reports.id, id)).returning({ id: reports.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting report:', error);
    return false;
  }
}
