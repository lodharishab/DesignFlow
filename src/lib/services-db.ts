'use server';
import { db, isDbEnabled } from './db';
import { services, serviceTiers, serviceCategories, serviceSubcategories, serviceApprovedDesigners } from './schema';
import { eq, desc, inArray } from 'drizzle-orm';

// ============================================================================
// Types
// ============================================================================

export interface ServiceTierData {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  description?: string;
  deliveryTimeMin?: number;
  deliveryTimeMax?: number;
  deliveryTimeUnit?: string;
  scope?: string[];
  iconName?: string;
}

export interface ServiceData {
  id: string;
  name: string;
  generalDescription?: string;
  longDescription?: string;
  category?: string;
  categorySlug?: string;
  tags?: string[];
  imageUrl?: string;
  imageHint?: string;
  status: string;
  tiers: ServiceTierData[];
}

export interface ServiceCategory {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  serviceCount?: number;
}

export interface ServiceSubCategory {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string;
  parentCategoryName?: string;
  slug?: string;
  serviceCount?: number;
}

// ============================================================================
// Row mappers
// ============================================================================

function rowToService(row: typeof services.$inferSelect, tiers: ServiceTierData[] = []): ServiceData {
  return {
    id: row.id,
    name: row.name,
    generalDescription: row.generalDescription || undefined,
    longDescription: row.longDescription || undefined,
    category: row.category || undefined,
    categorySlug: row.categorySlug || undefined,
    tags: row.tags || [],
    imageUrl: row.imageUrl || undefined,
    imageHint: row.imageHint || undefined,
    status: row.status,
    tiers,
  };
}

function rowToTier(row: typeof serviceTiers.$inferSelect): ServiceTierData {
  return {
    id: row.id,
    serviceId: row.serviceId,
    name: row.name,
    price: parseFloat(row.price),
    description: row.description || undefined,
    deliveryTimeMin: row.deliveryTimeMin || undefined,
    deliveryTimeMax: row.deliveryTimeMax || undefined,
    deliveryTimeUnit: row.deliveryTimeUnit || undefined,
    scope: row.scope || [],
    iconName: row.iconName || undefined,
  };
}

function rowToCategory(row: typeof serviceCategories.$inferSelect): ServiceCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    slug: row.slug || undefined,
  };
}

function rowToSubCategory(row: typeof serviceSubcategories.$inferSelect): ServiceSubCategory {
  return {
    id: row.id,
    name: row.name,
    description: row.description || undefined,
    parentCategoryId: row.parentCategoryId || undefined,
    slug: row.slug || undefined,
  };
}

// ============================================================================
// Services CRUD
// ============================================================================

export async function getAllServices(): Promise<ServiceData[]> {
  if (!isDbEnabled()) return [];
  try {
    const serviceRows = await db.select().from(services).orderBy(services.name);
    const tierRows = await db.select().from(serviceTiers);

    const tiersByService = new Map<string, ServiceTierData[]>();
    for (const row of tierRows) {
      const tier = rowToTier(row);
      const existing = tiersByService.get(tier.serviceId) || [];
      existing.push(tier);
      tiersByService.set(tier.serviceId, existing);
    }

    return serviceRows.map(row => rowToService(row, tiersByService.get(row.id) || []));
  } catch (e) {
    console.error('Error fetching services:', e);
    return [];
  }
}

export async function getServiceById(id: string): Promise<ServiceData | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.select().from(services).where(eq(services.id, id));
    if (rows.length === 0) return null;
    const tierRows = await db.select().from(serviceTiers).where(eq(serviceTiers.serviceId, id));
    return rowToService(rows[0], tierRows.map(rowToTier));
  } catch (e) {
    console.error(`Error fetching service ${id}:`, e);
    return null;
  }
}

export async function getServicesByCategory(category: string): Promise<ServiceData[]> {
  if (!isDbEnabled()) return [];
  try {
    const serviceRows = await db.select().from(services).where(eq(services.category, category));
    const serviceIds = serviceRows.map(s => s.id);
    if (serviceIds.length === 0) return [];

    const tierRows = await db.select().from(serviceTiers).where(inArray(serviceTiers.serviceId, serviceIds));
    const tiersByService = new Map<string, ServiceTierData[]>();
    for (const row of tierRows) {
      const tier = rowToTier(row);
      const existing = tiersByService.get(tier.serviceId) || [];
      existing.push(tier);
      tiersByService.set(tier.serviceId, existing);
    }

    return serviceRows.map(row => rowToService(row, tiersByService.get(row.id) || []));
  } catch (e) {
    console.error(`Error fetching services by category ${category}:`, e);
    return [];
  }
}

export async function createService(data: Omit<ServiceData, 'tiers'> & { tiers?: Omit<ServiceTierData, 'serviceId'>[] }): Promise<ServiceData | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(services).values({
      id: data.id,
      name: data.name,
      generalDescription: data.generalDescription || null,
      longDescription: data.longDescription || null,
      category: data.category || null,
      categorySlug: data.categorySlug || null,
      tags: data.tags || [],
      imageUrl: data.imageUrl || null,
      imageHint: data.imageHint || null,
      status: data.status || 'Draft',
    }).returning();

    const insertedService = rows[0];
    const insertedTiers: ServiceTierData[] = [];
    if (insertedService && data.tiers) {
      for (const tier of data.tiers) {
        const tierRows = await db.insert(serviceTiers).values({
          id: tier.id,
          serviceId: insertedService.id,
          name: tier.name,
          price: tier.price.toString(),
          description: tier.description || null,
          deliveryTimeMin: tier.deliveryTimeMin || null,
          deliveryTimeMax: tier.deliveryTimeMax || null,
          deliveryTimeUnit: tier.deliveryTimeUnit || 'days',
          scope: tier.scope || [],
          iconName: tier.iconName || null,
        }).returning();
        if (tierRows[0]) insertedTiers.push(rowToTier(tierRows[0]));
      }
    }

    return insertedService ? rowToService(insertedService, insertedTiers) : null;
  } catch (error) {
    console.error('Error creating service:', error);
    return null;
  }
}

export async function updateService(id: string, data: Partial<Omit<ServiceData, 'tiers'>>): Promise<ServiceData | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.generalDescription !== undefined) updateValues.generalDescription = data.generalDescription;
    if (data.longDescription !== undefined) updateValues.longDescription = data.longDescription;
    if (data.category !== undefined) updateValues.category = data.category;
    if (data.categorySlug !== undefined) updateValues.categorySlug = data.categorySlug;
    if (data.tags !== undefined) updateValues.tags = data.tags;
    if (data.imageUrl !== undefined) updateValues.imageUrl = data.imageUrl;
    if (data.imageHint !== undefined) updateValues.imageHint = data.imageHint;
    if (data.status !== undefined) updateValues.status = data.status;

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(services).set(updateValues).where(eq(services.id, id)).returning();
    if (!rows[0]) return null;

    const tierRows = await db.select().from(serviceTiers).where(eq(serviceTiers.serviceId, id));
    return rowToService(rows[0], tierRows.map(rowToTier));
  } catch (error) {
    console.error('Error updating service:', error);
    return null;
  }
}

export async function deleteService(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(services).where(eq(services.id, id)).returning({ id: services.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting service:', error);
    return false;
  }
}

// ============================================================================
// Service Tiers CRUD
// ============================================================================

export async function createServiceTier(data: ServiceTierData): Promise<ServiceTierData | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(serviceTiers).values({
      id: data.id,
      serviceId: data.serviceId,
      name: data.name,
      price: data.price.toString(),
      description: data.description || null,
      deliveryTimeMin: data.deliveryTimeMin || null,
      deliveryTimeMax: data.deliveryTimeMax || null,
      deliveryTimeUnit: data.deliveryTimeUnit || 'days',
      scope: data.scope || [],
      iconName: data.iconName || null,
    }).returning();
    return rows[0] ? rowToTier(rows[0]) : null;
  } catch (error) {
    console.error('Error creating service tier:', error);
    return null;
  }
}

export async function updateServiceTier(id: string, data: Partial<ServiceTierData>): Promise<ServiceTierData | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.price !== undefined) updateValues.price = data.price.toString();
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.deliveryTimeMin !== undefined) updateValues.deliveryTimeMin = data.deliveryTimeMin;
    if (data.deliveryTimeMax !== undefined) updateValues.deliveryTimeMax = data.deliveryTimeMax;
    if (data.deliveryTimeUnit !== undefined) updateValues.deliveryTimeUnit = data.deliveryTimeUnit;
    if (data.scope !== undefined) updateValues.scope = data.scope;
    if (data.iconName !== undefined) updateValues.iconName = data.iconName;

    if (Object.keys(updateValues).length === 0) return null;
    const rows = await db.update(serviceTiers).set(updateValues).where(eq(serviceTiers.id, id)).returning();
    return rows[0] ? rowToTier(rows[0]) : null;
  } catch (error) {
    console.error('Error updating service tier:', error);
    return null;
  }
}

export async function deleteServiceTier(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(serviceTiers).where(eq(serviceTiers.id, id)).returning({ id: serviceTiers.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting service tier:', error);
    return false;
  }
}

// ============================================================================
// Categories CRUD
// ============================================================================

export async function getAllCategories(): Promise<ServiceCategory[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(serviceCategories).orderBy(serviceCategories.name);
    return rows.map(rowToCategory);
  } catch (e) {
    console.error('Error fetching categories:', e);
    return [];
  }
}

export async function createCategory(data: ServiceCategory): Promise<ServiceCategory | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(serviceCategories).values({
      id: data.id,
      name: data.name,
      description: data.description || null,
      slug: data.slug || null,
    }).returning();
    return rows[0] ? rowToCategory(rows[0]) : null;
  } catch (error) {
    console.error('Error creating category:', error);
    return null;
  }
}

export async function updateCategory(id: string, data: Partial<ServiceCategory>): Promise<ServiceCategory | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (Object.keys(updateValues).length === 0) return null;
    const rows = await db.update(serviceCategories).set(updateValues).where(eq(serviceCategories.id, id)).returning();
    return rows[0] ? rowToCategory(rows[0]) : null;
  } catch (error) {
    console.error('Error updating category:', error);
    return null;
  }
}

export async function deleteCategory(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(serviceCategories).where(eq(serviceCategories.id, id)).returning({ id: serviceCategories.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting category:', error);
    return false;
  }
}

// ============================================================================
// Subcategories CRUD
// ============================================================================

export async function getAllSubCategories(): Promise<ServiceSubCategory[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(serviceSubcategories).orderBy(serviceSubcategories.name);
    return rows.map(rowToSubCategory);
  } catch (e) {
    console.error('Error fetching subcategories:', e);
    return [];
  }
}

export async function createSubCategory(data: ServiceSubCategory): Promise<ServiceSubCategory | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(serviceSubcategories).values({
      id: data.id,
      name: data.name,
      description: data.description || null,
      parentCategoryId: data.parentCategoryId || null,
      slug: data.slug || null,
    }).returning();
    return rows[0] ? rowToSubCategory(rows[0]) : null;
  } catch (error) {
    console.error('Error creating subcategory:', error);
    return null;
  }
}

export async function updateSubCategory(id: string, data: Partial<ServiceSubCategory>): Promise<ServiceSubCategory | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.description !== undefined) updateValues.description = data.description;
    if (data.parentCategoryId !== undefined) updateValues.parentCategoryId = data.parentCategoryId;
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (Object.keys(updateValues).length === 0) return null;
    const rows = await db.update(serviceSubcategories).set(updateValues).where(eq(serviceSubcategories.id, id)).returning();
    return rows[0] ? rowToSubCategory(rows[0]) : null;
  } catch (error) {
    console.error('Error updating subcategory:', error);
    return null;
  }
}

export async function deleteSubCategory(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(serviceSubcategories).where(eq(serviceSubcategories.id, id)).returning({ id: serviceSubcategories.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting subcategory:', error);
    return false;
  }
}

// ============================================================================
// Approved Designers (join table)
// ============================================================================

export async function getApprovedDesignersByService(serviceId: string): Promise<string[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select({ designerId: serviceApprovedDesigners.designerId })
      .from(serviceApprovedDesigners)
      .where(eq(serviceApprovedDesigners.serviceId, serviceId));
    return rows.map(r => r.designerId);
  } catch (e) {
    console.error('Error fetching approved designers:', e);
    return [];
  }
}

export async function addApprovedDesigner(serviceId: string, designerId: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    await db.insert(serviceApprovedDesigners).values({
      id: `${serviceId}_${designerId}`,
      serviceId,
      designerId,
    });
    return true;
  } catch (error) {
    console.error('Error adding approved designer:', error);
    return false;
  }
}

export async function removeApprovedDesigner(serviceId: string, designerId: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(serviceApprovedDesigners)
      .where(eq(serviceApprovedDesigners.id, `${serviceId}_${designerId}`))
      .returning({ id: serviceApprovedDesigners.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error removing approved designer:', error);
    return false;
  }
}
