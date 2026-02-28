'use server';

/**
 * @fileOverview Server-side library for managing a user's brand profile data.
 * Uses Drizzle ORM with Neon PostgreSQL. Falls back to in-memory mock
 * when DATABASE_URL is not set (temporary, will be removed).
 */
import { db, isDbEnabled } from './db';
import { brandProfiles } from './schema';
import { eq, and } from 'drizzle-orm';

export interface BrandProfileFormData {
  [key: string]: any;
  id: string;
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string;
  targetAudience: string;
  brandValues: string;
  tags?: string[];
  preferredDesignStyle: string;
  colorsToUse: string;
  colorsToAvoid: string;
  notesForDesigners: string;
  communicationPreference: string;
  feedbackStyle: string;
  brandGuidelinesLink: string;
  existingAssetsLink: string;
  logoUrl?: string | null;
  projectTypes: string[];
  isFavorite?: boolean;
}

const defaultBrandProfile: BrandProfileFormData = {
  id: 'default',
  companyName: '',
  companyWebsite: '',
  industry: '',
  companySize: '',
  targetAudience: '',
  brandValues: '',
  tags: [],
  preferredDesignStyle: '',
  colorsToUse: '',
  colorsToAvoid: '',
  communicationPreference: 'Platform Chat',
  feedbackStyle: '',
  notesForDesigners: '',
  brandGuidelinesLink: '',
  existingAssetsLink: '',
  logoUrl: null,
  projectTypes: [],
  isFavorite: false,
};

export async function getDefaultBrandProfile(): Promise<BrandProfileFormData> {
  return { ...defaultBrandProfile };
}

// Temporary mock user ID — will be replaced once authentication is integrated
const MOCK_USER_ID = 'client_user_123';

function rowToProfile(row: typeof brandProfiles.$inferSelect): BrandProfileFormData {
  return {
    id: row.id,
    companyName: row.companyName,
    companyWebsite: row.companyWebsite || '',
    industry: row.industry || '',
    companySize: row.companySize || '',
    targetAudience: row.targetAudience || '',
    brandValues: row.brandValues || '',
    tags: row.tags || [],
    preferredDesignStyle: row.preferredDesignStyle || '',
    colorsToUse: row.colorsToUse || '',
    colorsToAvoid: row.colorsToAvoid || '',
    notesForDesigners: row.notesForDesigners || '',
    communicationPreference: row.communicationPreference || 'Platform Chat',
    feedbackStyle: row.feedbackStyle || '',
    brandGuidelinesLink: row.brandGuidelinesLink || '',
    existingAssetsLink: row.existingAssetsLink || '',
    logoUrl: row.logoUrl || null,
    projectTypes: row.projectTypes || [],
    isFavorite: row.isFavorite || false,
  };
}

/**
 * Retrieves all brand kits for the user.
 * @param userId - The user ID whose brand kits to retrieve (defaults to MOCK_USER_ID during migration)
 */
export async function getBrandKits(userId?: string): Promise<BrandProfileFormData[]> {
  const uid = userId || MOCK_USER_ID;
  if (!isDbEnabled()) {
    return [{ ...defaultBrandProfile, id: `brand_fallback`, companyName: 'My First Brand' }];
  }
  try {
    const rows = await db.select().from(brandProfiles).where(eq(brandProfiles.userId, uid));
    return rows.map(rowToProfile);
  } catch (error) {
    console.error('Error getting brand kits:', error);
    return [];
  }
}

/**
 * Saves/upserts brand kits for the user. Accepts a function to update kits.
 * @param updater A function that receives the previous kits and returns the new kits array.
 * @param userId - The user ID (defaults to MOCK_USER_ID during migration)
 */
export async function saveBrandKits(
  updater: BrandProfileFormData[] | ((prevKits: BrandProfileFormData[]) => BrandProfileFormData[]),
  userId?: string
): Promise<void> {
  const uid = userId || MOCK_USER_ID;
  if (!isDbEnabled()) return;

  try {
    const currentKits = await getBrandKits(uid);
    const newKits = typeof updater === 'function' ? updater(currentKits) : updater;
    const existingIds = new Set(currentKits.map(k => k.id));

    for (const kit of newKits) {
      if (existingIds.has(kit.id)) {
        // Update existing
        await db.update(brandProfiles).set({
          companyName: kit.companyName,
          companyWebsite: kit.companyWebsite || null,
          industry: kit.industry || null,
          companySize: kit.companySize || null,
          targetAudience: kit.targetAudience || null,
          brandValues: kit.brandValues || null,
          tags: kit.tags || [],
          preferredDesignStyle: kit.preferredDesignStyle || null,
          colorsToUse: kit.colorsToUse || null,
          colorsToAvoid: kit.colorsToAvoid || null,
          notesForDesigners: kit.notesForDesigners || null,
          communicationPreference: kit.communicationPreference || 'Platform Chat',
          feedbackStyle: kit.feedbackStyle || null,
          brandGuidelinesLink: kit.brandGuidelinesLink || null,
          existingAssetsLink: kit.existingAssetsLink || null,
          logoUrl: kit.logoUrl || null,
          projectTypes: kit.projectTypes || [],
          isFavorite: kit.isFavorite || false,
        }).where(eq(brandProfiles.id, kit.id));
      } else {
        // Insert new
        await db.insert(brandProfiles).values({
          id: kit.id,
          userId: uid,
          companyName: kit.companyName,
          companyWebsite: kit.companyWebsite || null,
          industry: kit.industry || null,
          companySize: kit.companySize || null,
          targetAudience: kit.targetAudience || null,
          brandValues: kit.brandValues || null,
          tags: kit.tags || [],
          preferredDesignStyle: kit.preferredDesignStyle || null,
          colorsToUse: kit.colorsToUse || null,
          colorsToAvoid: kit.colorsToAvoid || null,
          notesForDesigners: kit.notesForDesigners || null,
          communicationPreference: kit.communicationPreference || 'Platform Chat',
          feedbackStyle: kit.feedbackStyle || null,
          brandGuidelinesLink: kit.brandGuidelinesLink || null,
          existingAssetsLink: kit.existingAssetsLink || null,
          logoUrl: kit.logoUrl || null,
          projectTypes: kit.projectTypes || [],
          isFavorite: kit.isFavorite || false,
        });
      }
    }

    // Delete kits removed by the updater
    const newIds = new Set(newKits.map(k => k.id));
    for (const existingId of existingIds) {
      if (!newIds.has(existingId)) {
        await db.delete(brandProfiles).where(eq(brandProfiles.id, existingId));
      }
    }
  } catch (error) {
    console.error('Error saving brand kits:', error);
  }
}

/**
 * Retrieves a single brand kit by its ID.
 */
export async function getBrandKitById(id: string, userId?: string): Promise<BrandProfileFormData | null> {
  if (!isDbEnabled()) {
    return { ...defaultBrandProfile, id, companyName: 'My First Brand' };
  }
  try {
    const rows = await db.select().from(brandProfiles).where(eq(brandProfiles.id, id));
    return rows[0] ? rowToProfile(rows[0]) : null;
  } catch (error) {
    console.error(`Error getting brand kit ${id}:`, error);
    return null;
  }
}

/**
 * Deletes a single brand kit by its ID.
 */
export async function deleteBrandKit(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(brandProfiles).where(eq(brandProfiles.id, id)).returning({ id: brandProfiles.id });
    return rows.length > 0;
  } catch (error) {
    console.error(`Error deleting brand kit ${id}:`, error);
    return false;
  }
}

/**
 * Toggles the favorite status of a brand kit.
 */
export async function toggleFavoriteBrandKit(id: string): Promise<BrandProfileFormData | null> {
  if (!isDbEnabled()) return null;
  try {
    // First get the current value
    const current = await db.select({ isFavorite: brandProfiles.isFavorite }).from(brandProfiles).where(eq(brandProfiles.id, id));
    if (current.length === 0) return null;

    const newValue = !current[0].isFavorite;
    const rows = await db.update(brandProfiles).set({ isFavorite: newValue }).where(eq(brandProfiles.id, id)).returning();
    return rows[0] ? rowToProfile(rows[0]) : null;
  } catch (error) {
    console.error(`Error toggling favorite for brand kit ${id}:`, error);
    return null;
  }
}
