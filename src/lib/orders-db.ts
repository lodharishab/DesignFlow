'use server';
import { db, isDbEnabled } from './db';
import { orders, orderEvents, orderMilestones, orderAttachments } from './schema';
import { eq, desc, and, inArray } from 'drizzle-orm';
import type { OrderStatus, OrderEvent, Milestone, OrderAttachment, Order } from './types';
export type { OrderStatus, OrderEvent, Milestone, OrderAttachment, Order };

// ============================================================================
// Row mappers
// ============================================================================

function rowToOrder(row: typeof orders.$inferSelect): Omit<Order, 'orderEvents' | 'milestones'> {
  return {
    id: row.id,
    clientName: row.clientName,
    clientId: row.clientId || undefined,
    designerName: row.designerName || undefined,
    designerId: row.designerId || undefined,
    serviceName: row.serviceName,
    serviceId: row.serviceId || undefined,
    serviceTier: row.serviceTier || undefined,
    serviceScope: row.serviceScope || undefined,
    orderDate: row.orderDate ? new Date(row.orderDate) : new Date(),
    dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
    status: row.status as OrderStatus,
    totalAmount: parseFloat(row.totalAmount),
    currency: row.currency,
    paymentMethod: row.paymentMethod || undefined,
    transactionId: row.transactionId || undefined,
    clientBrief: row.clientBrief || undefined,
    briefAttachments: row.briefAttachments || undefined,
    deliverables: row.deliverables || undefined,
    revisionNotes: row.revisionNotes || undefined,
    revisionRequestDate: row.revisionRequestDate ? new Date(row.revisionRequestDate) : undefined,
    revisionsAllowed: row.revisionsAllowed,
    revisionsUsed: row.revisionsUsed,
    privateNotes: row.privateNotes || undefined,
    privateNotesLastEdited: row.privateNotesLastEdited ? new Date(row.privateNotesLastEdited) : undefined,
  };
}

function rowToEvent(row: typeof orderEvents.$inferSelect): OrderEvent {
  return {
    id: row.id,
    orderId: row.orderId,
    timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
    event: row.event,
    actor: row.actor || undefined,
    notes: row.notes || undefined,
  };
}

function rowToMilestone(row: typeof orderMilestones.$inferSelect): Milestone {
  return {
    id: row.id,
    orderId: row.orderId,
    title: row.title,
    dueDate: row.dueDate ? new Date(row.dueDate) : undefined,
    amount: row.amount ? parseFloat(row.amount) : undefined,
    status: row.status,
  };
}

// ============================================================================
// Orders CRUD
// ============================================================================

export async function getAllOrders(): Promise<Order[]> {
  if (!isDbEnabled()) return [];
  try {
    const orderRows = await db.select().from(orders).orderBy(desc(orders.orderDate));
    const eventRows = await db.select().from(orderEvents).orderBy(desc(orderEvents.timestamp));
    const milestoneRows = await db.select().from(orderMilestones);

    const eventsByOrder = new Map<string, OrderEvent[]>();
    for (const row of eventRows) {
      const event = rowToEvent(row);
      const existing = eventsByOrder.get(event.orderId) || [];
      existing.push(event);
      eventsByOrder.set(event.orderId, existing);
    }

    const milestonesByOrder = new Map<string, Milestone[]>();
    for (const row of milestoneRows) {
      const ms = rowToMilestone(row);
      const existing = milestonesByOrder.get(ms.orderId) || [];
      existing.push(ms);
      milestonesByOrder.set(ms.orderId, existing);
    }

    return orderRows.map(row => ({
      ...rowToOrder(row),
      orderEvents: eventsByOrder.get(row.id) || [],
      milestones: milestonesByOrder.get(row.id) || [],
    }));
  } catch (e) {
    console.error('Error fetching orders:', e);
    return [];
  }
}

export async function getOrderById(id: string): Promise<Order | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(orders).where(eq(orders.id, id));
    if (rows.length === 0) return null;

    const eventRows = await db.select().from(orderEvents).where(eq(orderEvents.orderId, id)).orderBy(desc(orderEvents.timestamp));
    const milestoneRows = await db.select().from(orderMilestones).where(eq(orderMilestones.orderId, id));

    return {
      ...rowToOrder(rows[0]),
      orderEvents: eventRows.map(rowToEvent),
      milestones: milestoneRows.map(rowToMilestone),
    };
  } catch (e) {
    console.error(`Error fetching order ${id}:`, e);
    return null;
  }
}

export async function getOrdersByClientId(clientId: string): Promise<Order[]> {
  if (!isDbEnabled()) return [];
  try {
    const orderRows = await db.select().from(orders).where(eq(orders.clientId, clientId)).orderBy(desc(orders.orderDate));
    return orderRows.map(row => ({ ...rowToOrder(row), orderEvents: [], milestones: [] }));
  } catch (e) {
    console.error(`Error fetching orders for client ${clientId}:`, e);
    return [];
  }
}

export async function getOrdersByDesignerId(designerId: string): Promise<Order[]> {
  if (!isDbEnabled()) return [];
  try {
    const orderRows = await db.select().from(orders).where(eq(orders.designerId, designerId)).orderBy(desc(orders.orderDate));

    const orderIds = orderRows.map(o => o.id);
    if (orderIds.length === 0) return [];

    const eventRows = await db.select().from(orderEvents).where(inArray(orderEvents.orderId, orderIds)).orderBy(desc(orderEvents.timestamp));
    const milestoneRows = await db.select().from(orderMilestones).where(inArray(orderMilestones.orderId, orderIds));

    const eventsByOrder = new Map<string, OrderEvent[]>();
    for (const row of eventRows) {
      const event = rowToEvent(row);
      const existing = eventsByOrder.get(event.orderId) || [];
      existing.push(event);
      eventsByOrder.set(event.orderId, existing);
    }

    const milestonesByOrder = new Map<string, Milestone[]>();
    for (const row of milestoneRows) {
      const ms = rowToMilestone(row);
      const existing = milestonesByOrder.get(ms.orderId) || [];
      existing.push(ms);
      milestonesByOrder.set(ms.orderId, existing);
    }

    return orderRows.map(row => ({
      ...rowToOrder(row),
      orderEvents: eventsByOrder.get(row.id) || [],
      milestones: milestonesByOrder.get(row.id) || [],
    }));
  } catch (e) {
    console.error(`Error fetching orders for designer ${designerId}:`, e);
    return [];
  }
}

export async function createOrder(data: Omit<Order, 'orderEvents' | 'milestones'>): Promise<Order | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(orders).values({
      id: data.id,
      clientName: data.clientName,
      clientId: data.clientId || null,
      designerName: data.designerName || null,
      designerId: data.designerId || null,
      serviceName: data.serviceName,
      serviceId: data.serviceId || null,
      serviceTier: data.serviceTier || null,
      serviceScope: data.serviceScope || null,
      orderDate: data.orderDate || new Date(),
      dueDate: data.dueDate || null,
      status: data.status || 'Pending Assignment',
      totalAmount: data.totalAmount.toString(),
      currency: data.currency || 'INR',
      paymentMethod: data.paymentMethod || null,
      transactionId: data.transactionId || null,
      clientBrief: data.clientBrief || null,
      briefAttachments: data.briefAttachments || null,
      deliverables: data.deliverables || null,
      revisionsAllowed: data.revisionsAllowed || 2,
      revisionsUsed: data.revisionsUsed || 0,
    }).returning();

    return rows[0] ? { ...rowToOrder(rows[0]), orderEvents: [], milestones: [] } : null;
  } catch (error) {
    console.error('Error creating order:', error);
    return null;
  }
}

export async function updateOrder(id: string, data: Partial<Omit<Order, 'orderEvents' | 'milestones'>>): Promise<Order | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.designerName !== undefined) updateValues.designerName = data.designerName;
    if (data.designerId !== undefined) updateValues.designerId = data.designerId;
    if (data.dueDate !== undefined) updateValues.dueDate = data.dueDate;
    if (data.revisionNotes !== undefined) updateValues.revisionNotes = data.revisionNotes;
    if (data.revisionRequestDate !== undefined) updateValues.revisionRequestDate = data.revisionRequestDate;
    if (data.revisionsUsed !== undefined) updateValues.revisionsUsed = data.revisionsUsed;
    if (data.privateNotes !== undefined) updateValues.privateNotes = data.privateNotes;
    if (data.privateNotesLastEdited !== undefined) updateValues.privateNotesLastEdited = data.privateNotesLastEdited;
    if (data.deliverables !== undefined) updateValues.deliverables = data.deliverables;

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(orders).set(updateValues).where(eq(orders.id, id)).returning();
    if (!rows[0]) return null;

    return { ...rowToOrder(rows[0]), orderEvents: [], milestones: [] };
  } catch (error) {
    console.error('Error updating order:', error);
    return null;
  }
}

export async function deleteOrder(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(orders).where(eq(orders.id, id)).returning({ id: orders.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}

// ============================================================================
// Order Events
// ============================================================================

export async function addOrderEvent(data: OrderEvent): Promise<OrderEvent | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(orderEvents).values({
      id: data.id,
      orderId: data.orderId,
      timestamp: data.timestamp || new Date(),
      event: data.event,
      actor: data.actor || null,
      notes: data.notes || null,
    }).returning();
    return rows[0] ? rowToEvent(rows[0]) : null;
  } catch (error) {
    console.error('Error adding order event:', error);
    return null;
  }
}

// ============================================================================
// Order Milestones
// ============================================================================

export async function addOrderMilestone(data: Milestone): Promise<Milestone | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(orderMilestones).values({
      id: data.id,
      orderId: data.orderId,
      title: data.title,
      dueDate: data.dueDate || null,
      amount: data.amount?.toString() || null,
      status: data.status || 'Pending',
    }).returning();
    return rows[0] ? rowToMilestone(rows[0]) : null;
  } catch (error) {
    console.error('Error adding order milestone:', error);
    return null;
  }
}

export async function updateOrderMilestone(id: string, data: Partial<Milestone>): Promise<Milestone | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.title !== undefined) updateValues.title = data.title;
    if (data.dueDate !== undefined) updateValues.dueDate = data.dueDate;
    if (data.amount !== undefined) updateValues.amount = data.amount?.toString();
    if (data.status !== undefined) updateValues.status = data.status;
    if (Object.keys(updateValues).length === 0) return null;
    const rows = await db.update(orderMilestones).set(updateValues).where(eq(orderMilestones.id, id)).returning();
    return rows[0] ? rowToMilestone(rows[0]) : null;
  } catch (error) {
    console.error('Error updating milestone:', error);
    return null;
  }
}
