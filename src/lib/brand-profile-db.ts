
'use client';

/**
 * @fileOverview A client-side library for managing a user's brand profile data.
 * This service handles saving and loading brand profile information to/from
 * Firebase Firestore, with a fallback to the browser's localStorage for
 * offline/prototyping scenarios.
 */

// MOCK USER ID - In a real app, this would come from an authentication context.
const MOCK_USER_ID = 'client_user_123';
const LOCAL_STORAGE_KEY = `brandProfile_${MOCK_USER_ID}`;


// In a real application, you would initialize Firebase here.
// For this prototype, we will simulate the interaction and rely on localStorage.

export interface BrandProfileFormData {
  [key: string]: any; // Allow for flexible fields
  companyName: string;
  companyWebsite: string;
  industry: string;
  targetAudience: string;
  brandValues: string;
  preferredDesignStyle: string;
  colorsToUse: string;
  colorsToAvoid: string;
  notesForDesigners: string;
}

/**
 * Saves the brand profile data.
 * It will attempt to save to Firestore if available, otherwise falls back to localStorage.
 * @param data The brand profile data to save.
 */
export async function saveBrandProfile(data: Partial<BrandProfileFormData>): Promise<void> {
    console.log('Simulating saveBrandProfile...');
    try {
        // In a real app, you would save to Firestore here.
        // const db = getFirestore();
        // const docRef = doc(db, 'brandProfiles', MOCK_USER_ID);
        // await setDoc(docRef, data, { merge: true });
        
        // For prototype: merge with existing data in localStorage
        const existingData = await getBrandProfile() || {};
        const updatedData = { ...existingData, ...data };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
        
        console.log('Data saved to localStorage (simulation).', updatedData);
    } catch (error) {
        console.error('Error saving brand profile:', error);
        // Fallback to localStorage if Firestore fails
        const existingData = await getBrandProfile() || {};
        const updatedData = { ...existingData, ...data };
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedData));
    }
}

/**
 * Retrieves the brand profile data.
 * It will attempt to load from Firestore if available, otherwise falls back to localStorage.
 * @returns The brand profile data, or null if not found.
 */
export async function getBrandProfile(): Promise<BrandProfileFormData | null> {
    console.log('Simulating getBrandProfile...');
    try {
        // In a real app, you would fetch from Firestore here.
        // const db = getFirestore();
        // const docRef = doc(db, 'brandProfiles', MOCK_USER_ID);
        // const docSnap = await getDoc(docRef);
        // if (docSnap.exists()) {
        //   return docSnap.data() as BrandProfileFormData;
        // }
        
        // For prototype: load from localStorage
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (localData) {
            console.log('Data loaded from localStorage (simulation).');
            return JSON.parse(localData);
        }

        return null; // No data found
    } catch (error) {
        console.error('Error getting brand profile:', error);
        // Attempt to load from localStorage as a fallback
        const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
        return localData ? JSON.parse(localData) : null;
    }
}
