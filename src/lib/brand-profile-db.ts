
'use client';

/**
 * @fileOverview A client-side library for managing a user's brand profile data.
 * This service handles saving and loading brand profile information to/from
 * the browser's localStorage for offline/prototyping scenarios.
 */

// MOCK USER ID - In a real app, this would come from an authentication context.
const MOCK_USER_ID = 'client_user_123';
const LOCAL_STORAGE_KEY = `brand_kits_${MOCK_USER_ID}`;

export interface BrandProfileFormData {
  [key: string]: any; // Allow for flexible fields
  id: string; // Unique ID for the brand kit
  companyName: string;
  companyWebsite: string;
  industry: string;
  companySize: string,
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
}

export const defaultBrandProfile: BrandProfileFormData = {
    id: 'default',
    companyName: "", 
    companyWebsite: "", 
    industry: "",
    companySize: "", 
    targetAudience: "", 
    brandValues: "",
    tags: [], 
    preferredDesignStyle: "", 
    colorsToUse: "",
    colorsToAvoid: "", 
    communicationPreference: "Platform Chat",
    feedbackStyle: "", 
    notesForDesigners: "", 
    brandGuidelinesLink: "",
    existingAssetsLink: "", 
    logoUrl: null,
    projectTypes: []
};


/**
 * Retrieves all brand kits for the user.
 * @returns An array of brand profile data, or an empty array if not found.
 */
export async function getBrandKits(): Promise<BrandProfileFormData[]> {
    console.log('Simulating getBrandKits...');
    try {
        await new Promise(resolve => setTimeout(resolve, 200)); // Simulate network delay
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            console.log('Brand kits loaded from localStorage (simulation).');
            const parsedKits: Partial<BrandProfileFormData>[] = JSON.parse(localData);
            // Ensure all fields are present, merging with defaults.
            const completeKits = parsedKits.map(kit => ({
                ...defaultBrandProfile,
                ...kit,
            }));
            return completeKits as BrandProfileFormData[];
        }
        // If no data, populate with a default example
        const exampleKit = { ...defaultBrandProfile, id: `brand_${Date.now()}`, companyName: "My First Brand" };
        await saveBrandKits([exampleKit]);
        return [exampleKit];
    } catch (error) {
        console.error('Error getting brand kits:', error);
        return [];
    }
}


/**
 * Saves all brand kits for the user. Accepts a function to update kits.
 * @param updater A function that receives the previous kits and returns the new kits array.
 */
export async function saveBrandKits(updater: (prevKits: BrandProfileFormData[]) => BrandProfileFormData[]): Promise<void> {
    console.log('Simulating saveBrandKits with updater...');
    try {
        await new Promise(resolve => setTimeout(resolve, 300)); // Simulate network delay
        const currentKits = await getBrandKits();
        const newKits = updater(currentKits);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newKits));
        console.log('All brand kits saved to localStorage (simulation).', newKits);
    } catch (error) {
        console.error('Error saving brand kits:', error);
    }
}


/**
 * Retrieves a single brand kit by its ID.
 * @param id The ID of the brand kit to retrieve.
 * @returns The brand profile data or null if not found.
 */
export async function getBrandKitById(id: string): Promise<BrandProfileFormData | null> {
  const kits = await getBrandKits();
  const kit = kits.find(k => k.id === id);
  return kit || null;
}

/**
 * Deletes a single brand kit by its ID.
 * @param id The ID of the brand kit to delete.
 * @returns True if deletion was successful, false otherwise.
 */
export async function deleteBrandKit(id: string): Promise<boolean> {
  try {
    const kits = await getBrandKits();
    const newKits = kits.filter(k => k.id !== id);
    // Use the functional update version of saveBrandKits
    await saveBrandKits(() => newKits);
    return true;
  } catch (error) {
    console.error(`Error deleting brand kit ${id}:`, error);
    return false;
  }
}
