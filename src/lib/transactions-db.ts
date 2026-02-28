'use server';
import { db, isDbEnabled } from './db';
import { transactions, payoutRequests, paymentMethods } from './schema';
import { eq, desc, and } from 'drizzle-orm';
import type { Transaction, PayoutRequest, PaymentMethod } from './types';
export type { Transaction, PayoutRequest, PaymentMethod };

// ============================================================================
// Row mappers
// ============================================================================

function rowToTransaction(row: typeof transactions.$inferSelect): Transaction {
  return {
    id: row.id,
    orderId: row.orderId || undefined,
    userId: row.userId || undefined,
    date: row.date ? new Date(row.date) : new Date(),
    type: row.type,
    status: row.status,
    amount: parseFloat(row.amount),
    description: row.description || undefined,
    paymentMethod: row.paymentMethod || undefined,
    clientName: row.clientName || undefined,
    designerName: row.designerName || undefined,
  };
}

function rowToPayout(row: typeof payoutRequests.$inferSelect): PayoutRequest {
  return {
    id: row.id,
    designerId: row.designerId || undefined,
    orderId: row.orderId || undefined,
    orderName: row.orderName || undefined,
    amount: parseFloat(row.amount),
    reason: row.reason || undefined,
    status: row.status,
    requestDate: row.requestDate ? new Date(row.requestDate) : new Date(),
    repaidAmount: row.repaidAmount ? parseFloat(row.repaidAmount) : 0,
  };
}

function rowToPaymentMethod(row: typeof paymentMethods.$inferSelect): PaymentMethod {
  return {
    id: row.id,
    userId: row.userId,
    userName: row.userName || undefined,
    userRole: row.userRole || undefined,
    methodType: row.methodType,
    identifier: row.identifier,
    isPrimary: row.isPrimary || false,
    status: row.status,
    lastUpdated: row.lastUpdated ? new Date(row.lastUpdated) : new Date(),
  };
}

// ============================================================================
// Transactions CRUD
// ============================================================================

export async function getAllTransactions(): Promise<Transaction[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(transactions).orderBy(desc(transactions.date));
    return rows.map(rowToTransaction);
  } catch (e) {
    console.error('Error fetching transactions:', e);
    return [];
  }
}

export async function getTransactionsByOrderId(orderId: string): Promise<Transaction[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(transactions)
      .where(eq(transactions.orderId, orderId))
      .orderBy(desc(transactions.date));
    return rows.map(rowToTransaction);
  } catch (e) {
    console.error('Error fetching transactions by order:', e);
    return [];
  }
}

export async function getTransactionsByUserId(userId: string): Promise<Transaction[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
    return rows.map(rowToTransaction);
  } catch (e) {
    console.error('Error fetching transactions by user:', e);
    return [];
  }
}

export async function createTransaction(data: Transaction): Promise<Transaction | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(transactions).values({
      id: data.id,
      orderId: data.orderId || null,
      userId: data.userId || null,
      date: data.date || new Date(),
      type: data.type,
      status: data.status || 'Pending',
      amount: data.amount.toString(),
      description: data.description || null,
      paymentMethod: data.paymentMethod || null,
      clientName: data.clientName || null,
      designerName: data.designerName || null,
    }).returning();
    return rows[0] ? rowToTransaction(rows[0]) : null;
  } catch (error) {
    console.error('Error creating transaction:', error);
    return null;
  }
}

export async function updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.type !== undefined) updateValues.type = data.type;
    if (data.amount !== undefined) updateValues.amount = data.amount.toString();
    if (data.description !== undefined) updateValues.description = data.description;
    if (Object.keys(updateValues).length === 0) return null;
    const rows = await db.update(transactions).set(updateValues).where(eq(transactions.id, id)).returning();
    return rows[0] ? rowToTransaction(rows[0]) : null;
  } catch (error) {
    console.error('Error updating transaction:', error);
    return null;
  }
}

// ============================================================================
// Payout Requests CRUD
// ============================================================================

export async function getAllPayoutRequests(): Promise<PayoutRequest[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(payoutRequests).orderBy(desc(payoutRequests.requestDate));
    return rows.map(rowToPayout);
  } catch (e) {
    console.error('Error fetching payout requests:', e);
    return [];
  }
}

export async function getPayoutRequestsByDesigner(designerId: string): Promise<PayoutRequest[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(payoutRequests)
      .where(eq(payoutRequests.designerId, designerId))
      .orderBy(desc(payoutRequests.requestDate));
    return rows.map(rowToPayout);
  } catch (e) {
    console.error('Error fetching payout requests by designer:', e);
    return [];
  }
}

export async function createPayoutRequest(data: PayoutRequest): Promise<PayoutRequest | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(payoutRequests).values({
      id: data.id,
      designerId: data.designerId || null,
      orderId: data.orderId || null,
      orderName: data.orderName || null,
      amount: data.amount.toString(),
      reason: data.reason || null,
      status: data.status || 'Pending',
      requestDate: data.requestDate || new Date(),
      repaidAmount: data.repaidAmount?.toString() || '0',
    }).returning();
    return rows[0] ? rowToPayout(rows[0]) : null;
  } catch (error) {
    console.error('Error creating payout request:', error);
    return null;
  }
}

export async function updatePayoutRequest(id: string, data: Partial<PayoutRequest>): Promise<PayoutRequest | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.repaidAmount !== undefined) updateValues.repaidAmount = data.repaidAmount.toString();
    if (Object.keys(updateValues).length === 0) return null;
    const rows = await db.update(payoutRequests).set(updateValues).where(eq(payoutRequests.id, id)).returning();
    return rows[0] ? rowToPayout(rows[0]) : null;
  } catch (error) {
    console.error('Error updating payout request:', error);
    return null;
  }
}

// ============================================================================
// Payment Methods CRUD
// ============================================================================

export async function getPaymentMethodsByUser(userId: string): Promise<PaymentMethod[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(paymentMethods).where(eq(paymentMethods.userId, userId));
    return rows.map(rowToPaymentMethod);
  } catch (e) {
    console.error('Error fetching payment methods:', e);
    return [];
  }
}

export async function getAllPaymentMethods(): Promise<PaymentMethod[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(paymentMethods).orderBy(desc(paymentMethods.lastUpdated));
    return rows.map(rowToPaymentMethod);
  } catch (e) {
    console.error('Error fetching all payment methods:', e);
    return [];
  }
}

export async function createPaymentMethod(data: PaymentMethod): Promise<PaymentMethod | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(paymentMethods).values({
      id: data.id,
      userId: data.userId,
      userName: data.userName || null,
      userRole: data.userRole || null,
      methodType: data.methodType,
      identifier: data.identifier,
      isPrimary: data.isPrimary || false,
      status: data.status || 'Pending',
      lastUpdated: new Date(),
    }).returning();
    return rows[0] ? rowToPaymentMethod(rows[0]) : null;
  } catch (error) {
    console.error('Error creating payment method:', error);
    return null;
  }
}

export async function updatePaymentMethod(id: string, data: Partial<PaymentMethod>): Promise<PaymentMethod | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.methodType !== undefined) updateValues.methodType = data.methodType;
    if (data.identifier !== undefined) updateValues.identifier = data.identifier;
    if (data.isPrimary !== undefined) updateValues.isPrimary = data.isPrimary;
    if (data.status !== undefined) updateValues.status = data.status;
    updateValues.lastUpdated = new Date();
    const rows = await db.update(paymentMethods).set(updateValues).where(eq(paymentMethods.id, id)).returning();
    return rows[0] ? rowToPaymentMethod(rows[0]) : null;
  } catch (error) {
    console.error('Error updating payment method:', error);
    return null;
  }
}

export async function deletePaymentMethod(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(paymentMethods).where(eq(paymentMethods.id, id)).returning({ id: paymentMethods.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting payment method:', error);
    return false;
  }
}
