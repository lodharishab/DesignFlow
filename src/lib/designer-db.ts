'use server';
import { db, isDbEnabled } from './db';
import { designerProfiles } from './schema';
import { eq, desc } from 'drizzle-orm';
import type { DesignerProfile } from './types';
export type { DesignerProfile };

/** Import the hardcoded fallback data — will be removed once all data is in DB */
import { designersData as MOCK_DESIGNERS } from './designer-data';

function rowToDesigner(row: typeof designerProfiles.$inferSelect): DesignerProfile {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    email: row.email || undefined,
    avatarUrl: row.avatarUrl || 'https://placehold.co/150x150.png',
    imageHint: row.imageHint || '',
    bio: row.bio || '',
    specialties: row.specialties || [],
    location: row.location || undefined,
    memberSince: row.memberSince ? new Date(row.memberSince) : undefined,
    website: row.website || undefined,
    socialLinks: row.socialLinks || [],
    profileCompletenessScore: row.profileCompletenessScore || 0,
    adminRanking: row.adminRanking || 3,
    clientRatingAverage: row.clientRatingAverage ? parseFloat(row.clientRatingAverage) : null,
    clientRatingCount: row.clientRatingCount || 0,
    overallRanking: row.overallRanking || 3,
    badges: (row.badges || []) as DesignerProfile['badges'],
    status: row.status || 'Active',
    servicesApproved: row.servicesApproved || 0,
    portfolioLink: row.portfolioLink || undefined,
  };
}

export async function getAllDesigners(): Promise<DesignerProfile[]> {
  if (!isDbEnabled()) {
    return MOCK_DESIGNERS;
  }
  try {
    const rows = await db.select().from(designerProfiles).orderBy(desc(designerProfiles.overallRanking));
    if (rows.length === 0) return MOCK_DESIGNERS; // Fallback if DB is empty
    return rows.map(rowToDesigner);
  } catch (e) {
    console.error('Error fetching designers from DB, returning mock data:', e);
    return MOCK_DESIGNERS;
  }
}

export async function getDesignerById(id: string): Promise<DesignerProfile | null> {
  if (!isDbEnabled()) {
    return MOCK_DESIGNERS.find(d => d.id === id) || null;
  }
  try {
    const rows = await db.select().from(designerProfiles).where(eq(designerProfiles.id, id));
    if (rows.length === 0) return MOCK_DESIGNERS.find(d => d.id === id) || null;
    return rowToDesigner(rows[0]);
  } catch (e) {
    console.error(`Error fetching designer ${id} from DB:`, e);
    return MOCK_DESIGNERS.find(d => d.id === id) || null;
  }
}

export async function getDesignerBySlug(slug: string): Promise<DesignerProfile | null> {
  if (!isDbEnabled()) {
    return MOCK_DESIGNERS.find(d => d.slug === slug) || null;
  }
  try {
    const rows = await db.select().from(designerProfiles).where(eq(designerProfiles.slug, slug));
    if (rows.length === 0) return MOCK_DESIGNERS.find(d => d.slug === slug) || null;
    return rowToDesigner(rows[0]);
  } catch (e) {
    console.error(`Error fetching designer by slug ${slug} from DB:`, e);
    return MOCK_DESIGNERS.find(d => d.slug === slug) || null;
  }
}

export async function createDesigner(data: Omit<DesignerProfile, 'status' | 'servicesApproved' | 'portfolioLink'> & { status?: string }): Promise<DesignerProfile | null> {
  if (!isDbEnabled()) return null;
  try {
    const rows = await db.insert(designerProfiles).values({
      id: data.id,
      slug: data.slug,
      name: data.name,
      email: data.email || null,
      avatarUrl: data.avatarUrl,
      imageHint: data.imageHint,
      bio: data.bio,
      specialties: data.specialties,
      location: data.location || null,
      memberSince: data.memberSince || null,
      website: data.website || null,
      socialLinks: data.socialLinks || [],
      profileCompletenessScore: data.profileCompletenessScore || 0,
      adminRanking: data.adminRanking || 3,
      clientRatingAverage: data.clientRatingAverage?.toString() || null,
      clientRatingCount: data.clientRatingCount || 0,
      overallRanking: data.overallRanking || 3,
      badges: (data.badges || []) as string[],
      status: data.status || 'Active',
    }).returning();
    return rows[0] ? rowToDesigner(rows[0]) : null;
  } catch (error) {
    console.error('Error creating designer:', error);
    return null;
  }
}

export async function updateDesigner(id: string, data: Partial<DesignerProfile>): Promise<DesignerProfile | null> {
  if (!isDbEnabled()) return null;
  try {
    const updateValues: Record<string, unknown> = {};
    if (data.slug !== undefined) updateValues.slug = data.slug;
    if (data.name !== undefined) updateValues.name = data.name;
    if (data.email !== undefined) updateValues.email = data.email;
    if (data.avatarUrl !== undefined) updateValues.avatarUrl = data.avatarUrl;
    if (data.imageHint !== undefined) updateValues.imageHint = data.imageHint;
    if (data.bio !== undefined) updateValues.bio = data.bio;
    if (data.specialties !== undefined) updateValues.specialties = data.specialties;
    if (data.location !== undefined) updateValues.location = data.location;
    if (data.website !== undefined) updateValues.website = data.website;
    if (data.socialLinks !== undefined) updateValues.socialLinks = data.socialLinks;
    if (data.profileCompletenessScore !== undefined) updateValues.profileCompletenessScore = data.profileCompletenessScore;
    if (data.adminRanking !== undefined) updateValues.adminRanking = data.adminRanking;
    if (data.clientRatingAverage !== undefined) updateValues.clientRatingAverage = data.clientRatingAverage?.toString() || null;
    if (data.clientRatingCount !== undefined) updateValues.clientRatingCount = data.clientRatingCount;
    if (data.overallRanking !== undefined) updateValues.overallRanking = data.overallRanking;
    if (data.badges !== undefined) updateValues.badges = data.badges as string[];
    if (data.status !== undefined) updateValues.status = data.status;
    if (data.servicesApproved !== undefined) updateValues.servicesApproved = data.servicesApproved;
    if (data.portfolioLink !== undefined) updateValues.portfolioLink = data.portfolioLink;

    if (Object.keys(updateValues).length === 0) return null;

    const rows = await db.update(designerProfiles).set(updateValues).where(eq(designerProfiles.id, id)).returning();
    return rows[0] ? rowToDesigner(rows[0]) : null;
  } catch (error) {
    console.error('Error updating designer:', error);
    return null;
  }
}

export async function deleteDesigner(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(designerProfiles).where(eq(designerProfiles.id, id)).returning({ id: designerProfiles.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error deleting designer:', error);
    return false;
  }
}
