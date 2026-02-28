'use server';
import { db, isDbEnabled } from './db';
import { disputes, disputeTimelineEvents } from './schema';
import { eq, desc } from 'drizzle-orm';
import type { Dispute, DisputeTimelineEvent } from './types';
export type { Dispute, DisputeTimelineEvent };

// ============================================================================
// Row mappers
// ============================================================================

function rowToDispute(row: typeof disputes.$inferSelect): Dispute {
  return {
    id: row.id,
    orderId: row.orderId,
    designerId: row.designerId || undefined,
    serviceName: row.serviceName || undefined,
    servicePrice: row.servicePrice ? parseFloat(row.servicePrice) : undefined,
    orderDeadline: row.orderDeadline ? new Date(row.orderDeadline) : undefined,
    clientName: row.clientName || undefined,
    disputeType: row.disputeType,
    status: row.status,
    lastUpdated: row.lastUpdated ? new Date(row.lastUpdated) : new Date(),
    clientClaim: row.clientClaim || undefined,
    designerResponse: row.designerResponse || undefined,
    adminNotes: row.adminNotes || undefined,
  };
}

function rowToTimelineEvent(row: typeof disputeTimelineEvents.$inferSelect): DisputeTimelineEvent {
  return {
    id: row.id,
    disputeId: row.disputeId,
    actor: row.actor,
    action: row.action,
    timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
  };
}

// ============================================================================
// Disputes CRUD
// ============================================================================

export async function getAllDisputes(): Promise<Dispute[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(disputes).orderBy(desc(disputes.lastUpdated));
    return rows.map(rowToDispute);
  } catch (e) {
    console.error('Error fetching disputes:', e);
    return [];
  }
}

export async function getDisputeById(id: string): Promise<Dispute | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(disputes).where(eq(disputes.id, id));
    if (!rows[0]) return null;
    const dispute = rowToDispute(rows[0]);
    const tlRows = await db.select().from(disputeTimelineEvents)
      .where(eq(disputeTimelineEvents.disputeId, id))
      .orderBy(disputeTimelineEvents.timestamp);
    dispute.timeline = tlRows.map(rowToTimelineEvent);
    return dispute;
  } catch (e) {
    console.error('Error fetching dispute by id:', e);
    return null;
  }
}

export async function getDisputesByOrderId(orderId: string): Promise<Dispute[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(disputes).where(eq(disputes.orderId, orderId));
    return rows.map(rowToDispute);
  } catch (e) {
    console.error('Error fetching disputes by order:', e);
    return [];
  }
}

export async function createDispute(data: Dispute): Promise<Dispute | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(disputes).values({
      id: data.id,
      orderId: data.orderId,
      designerId: data.designerId || null,
      serviceName: data.serviceName || null,
      servicePrice: data.servicePrice?.toString() || null,
      orderDeadline: data.orderDeadline || null,
      clientName: data.clientName || null,
      disputeType: data.disputeType,
      status: data.status || 'Open',
      lastUpdated: new Date(),
      clientClaim: data.clientClaim || null,
      designerResponse: data.designerResponse || null,
      adminNotes: data.adminNotes || null,
    }).returning();
    return rows[0] ? rowToDispute(rows[0]) : null;
  } catch (error) {
    console.error('Error creating dispute:', error);
    return null;
  }
}

export async function updateDispute(id: string, data: Partial<Dispute>): Promise<Dispute | null> {
  if (!isDbEnabled()) return null;
  try {
    const uv: Record<string, unknown> = {};
    if (data.status !== undefined) uv.status = data.status;
    if (data.clientClaim !== undefined) uv.clientClaim = data.clientClaim;
    if (data.designerResponse !== undefined) uv.designerResponse = data.designerResponse;
    if (data.adminNotes !== undefined) uv.adminNotes = data.adminNotes;
    uv.lastUpdated = new Date();
    const rows = await db.update(disputes).set(uv).where(eq(disputes.id, id)).returning();
    return rows[0] ? rowToDispute(rows[0]) : null;
  } catch (error) {
    console.error('Error updating dispute:', error);
    return null;
  }
}

export async function deleteDispute(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(disputes).where(eq(disputes.id, id)).returning({ id: disputes.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting dispute:', error);
    return false;
  }
}

// ============================================================================
// Dispute Timeline Events
// ============================================================================

export async function addDisputeTimelineEvent(data: DisputeTimelineEvent): Promise<DisputeTimelineEvent | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(disputeTimelineEvents).values({
      id: data.id,
      disputeId: data.disputeId,
      actor: data.actor,
      action: data.action,
      timestamp: data.timestamp || new Date(),
    }).returning();
    return rows[0] ? rowToTimelineEvent(rows[0]) : null;
  } catch (error) {
    console.error('Error adding dispute timeline event:', error);
    return null;
  }
}

export async function getDisputeTimeline(disputeId: string): Promise<DisputeTimelineEvent[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(disputeTimelineEvents)
      .where(eq(disputeTimelineEvents.disputeId, disputeId))
      .orderBy(disputeTimelineEvents.timestamp);
    return rows.map(rowToTimelineEvent);
  } catch (e) {
    console.error('Error fetching dispute timeline:', e);
    return [];
  }
}
