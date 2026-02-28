'use server';
import { db, isDbEnabled } from './db';
import { siteSettings, auditLogs } from './schema';
import { eq, desc } from 'drizzle-orm';

// ============================================================================
// Types
// ============================================================================

export interface SiteSettings {
  id: string;
  platformName: string;
  contactEmail?: string;
  defaultCurrency: string;
  allowClientRegistrations: boolean;
  allowDesignerRegistrations: boolean;
  termsUrl?: string;
  privacyUrl?: string;
  enableMemberships: boolean;
  clientBasicPlanName?: string;
  clientBasicPlanPrice?: string;
  clientPremiumPlanName?: string;
  clientPremiumPlanPrice?: string;
  designerBasicPlanName?: string;
  designerBasicPlanPrice?: string;
  designerProPlanName?: string;
  designerProPlanPrice?: string;
  enableFreeTrial: boolean;
  trialDurationDays: number;
  adminNotificationEmail?: string;
  stripeApiKey?: string;
  paypalClientId?: string;
}

export interface AuditLog {
  id: string;
  action: string;
  actorId?: string;
  actorName?: string;
  targetType?: string;
  targetId?: string;
  targetName?: string;
  timestamp: Date;
  notes?: string;
}

// ============================================================================
// Row mappers
// ============================================================================

function rowToSettings(row: typeof siteSettings.$inferSelect): SiteSettings {
  return {
    id: row.id,
    platformName: row.platformName || 'DesignFlow',
    contactEmail: row.contactEmail || undefined,
    defaultCurrency: row.defaultCurrency || 'INR',
    allowClientRegistrations: row.allowClientRegistrations ?? true,
    allowDesignerRegistrations: row.allowDesignerRegistrations ?? true,
    termsUrl: row.termsUrl || undefined,
    privacyUrl: row.privacyUrl || undefined,
    enableMemberships: row.enableMemberships ?? false,
    clientBasicPlanName: row.clientBasicPlanName || undefined,
    clientBasicPlanPrice: row.clientBasicPlanPrice || undefined,
    clientPremiumPlanName: row.clientPremiumPlanName || undefined,
    clientPremiumPlanPrice: row.clientPremiumPlanPrice || undefined,
    designerBasicPlanName: row.designerBasicPlanName || undefined,
    designerBasicPlanPrice: row.designerBasicPlanPrice || undefined,
    designerProPlanName: row.designerProPlanName || undefined,
    designerProPlanPrice: row.designerProPlanPrice || undefined,
    enableFreeTrial: row.enableFreeTrial ?? false,
    trialDurationDays: row.trialDurationDays || 14,
    adminNotificationEmail: row.adminNotificationEmail || undefined,
    stripeApiKey: row.stripeApiKey || undefined,
    paypalClientId: row.paypalClientId || undefined,
  };
}

function rowToAuditLog(row: typeof auditLogs.$inferSelect): AuditLog {
  return {
    id: row.id,
    action: row.action,
    actorId: row.actorId || undefined,
    actorName: row.actorName || undefined,
    targetType: row.targetType || undefined,
    targetId: row.targetId || undefined,
    targetName: row.targetName || undefined,
    timestamp: row.timestamp ? new Date(row.timestamp) : new Date(),
    notes: row.notes || undefined,
  };
}

// ============================================================================
// Site Settings
// ============================================================================

const DEFAULT_SETTINGS_ID = 'default';

export async function getSiteSettings(): Promise<SiteSettings> {
  const defaults: SiteSettings = {
    id: DEFAULT_SETTINGS_ID,
    platformName: 'DesignFlow',
    defaultCurrency: 'INR',
    allowClientRegistrations: true,
    allowDesignerRegistrations: true,
    enableMemberships: false,
    enableFreeTrial: false,
    trialDurationDays: 14,
  };
  if (!isDbEnabled()) return defaults;
  try {
    const rows = await db.select().from(siteSettings).where(eq(siteSettings.id, DEFAULT_SETTINGS_ID));
    if (!rows[0]) return defaults;
    return rowToSettings(rows[0]);
  } catch (e) {
    console.error('Error fetching site settings:', e);
    return defaults;
  }
}

export async function updateSiteSettings(data: Partial<SiteSettings>): Promise<SiteSettings | null> {
  if (!isDbEnabled()) return null;
  try {
    // Check if row exists
    const existing = await db.select().from(siteSettings).where(eq(siteSettings.id, DEFAULT_SETTINGS_ID));
    const values: Record<string, unknown> = {};
    if (data.platformName !== undefined) values.platformName = data.platformName;
    if (data.contactEmail !== undefined) values.contactEmail = data.contactEmail;
    if (data.defaultCurrency !== undefined) values.defaultCurrency = data.defaultCurrency;
    if (data.allowClientRegistrations !== undefined) values.allowClientRegistrations = data.allowClientRegistrations;
    if (data.allowDesignerRegistrations !== undefined) values.allowDesignerRegistrations = data.allowDesignerRegistrations;
    if (data.termsUrl !== undefined) values.termsUrl = data.termsUrl;
    if (data.privacyUrl !== undefined) values.privacyUrl = data.privacyUrl;
    if (data.enableMemberships !== undefined) values.enableMemberships = data.enableMemberships;
    if (data.clientBasicPlanName !== undefined) values.clientBasicPlanName = data.clientBasicPlanName;
    if (data.clientBasicPlanPrice !== undefined) values.clientBasicPlanPrice = data.clientBasicPlanPrice;
    if (data.clientPremiumPlanName !== undefined) values.clientPremiumPlanName = data.clientPremiumPlanName;
    if (data.clientPremiumPlanPrice !== undefined) values.clientPremiumPlanPrice = data.clientPremiumPlanPrice;
    if (data.designerBasicPlanName !== undefined) values.designerBasicPlanName = data.designerBasicPlanName;
    if (data.designerBasicPlanPrice !== undefined) values.designerBasicPlanPrice = data.designerBasicPlanPrice;
    if (data.designerProPlanName !== undefined) values.designerProPlanName = data.designerProPlanName;
    if (data.designerProPlanPrice !== undefined) values.designerProPlanPrice = data.designerProPlanPrice;
    if (data.enableFreeTrial !== undefined) values.enableFreeTrial = data.enableFreeTrial;
    if (data.trialDurationDays !== undefined) values.trialDurationDays = data.trialDurationDays;
    if (data.adminNotificationEmail !== undefined) values.adminNotificationEmail = data.adminNotificationEmail;
    if (data.stripeApiKey !== undefined) values.stripeApiKey = data.stripeApiKey;
    if (data.paypalClientId !== undefined) values.paypalClientId = data.paypalClientId;

    if (existing.length === 0) {
      // Insert default row with overrides
      values.id = DEFAULT_SETTINGS_ID;
      const rows = await db.insert(siteSettings).values(values as typeof siteSettings.$inferInsert).returning();
      return rows[0] ? rowToSettings(rows[0]) : null;
    } else {
      if (Object.keys(values).length === 0) return rowToSettings(existing[0]);
      const rows = await db.update(siteSettings).set(values).where(eq(siteSettings.id, DEFAULT_SETTINGS_ID)).returning();
      return rows[0] ? rowToSettings(rows[0]) : null;
    }
  } catch (error) {
    console.error('Error updating site settings:', error);
    return null;
  }
}

// ============================================================================
// Audit Logs
// ============================================================================

export async function getAllAuditLogs(): Promise<AuditLog[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(auditLogs).orderBy(desc(auditLogs.timestamp));
    return rows.map(rowToAuditLog);
  } catch (e) {
    console.error('Error fetching audit logs:', e);
    return [];
  }
}

export async function createAuditLog(data: AuditLog): Promise<AuditLog | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(auditLogs).values({
      id: data.id,
      action: data.action,
      actorId: data.actorId || null,
      actorName: data.actorName || null,
      targetType: data.targetType || null,
      targetId: data.targetId || null,
      targetName: data.targetName || null,
      timestamp: data.timestamp || new Date(),
      notes: data.notes || null,
    }).returning();
    return rows[0] ? rowToAuditLog(rows[0]) : null;
  } catch (error) {
    console.error('Error creating audit log:', error);
    return null;
  }
}

export async function getAuditLogsByActor(actorId: string): Promise<AuditLog[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(auditLogs)
      .where(eq(auditLogs.actorId, actorId))
      .orderBy(desc(auditLogs.timestamp));
    return rows.map(rowToAuditLog);
  } catch (e) {
    console.error('Error fetching audit logs by actor:', e);
    return [];
  }
}

export async function getAuditLogsByTarget(targetType: string, targetId: string): Promise<AuditLog[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(auditLogs)
      .where(eq(auditLogs.targetId, targetId))
      .orderBy(desc(auditLogs.timestamp));
    return rows.map(r => rowToAuditLog(r)).filter(r => r.targetType === targetType);
  } catch (e) {
    console.error('Error fetching audit logs by target:', e);
    return [];
  }
}
