
'use server';
import { Collection, ObjectId } from 'mongodb';
import { connectToDatabase } from './mongodb';
import type { PortfolioItem } from '@/components/shared/portfolio-item-card';

// Type for database interaction, ensuring designerId is present and _id might not be (on creation)
export interface PortfolioItemRecord extends Omit<PortfolioItem, '_id' | 'id'> {
  _id?: ObjectId;
  id: string; // Keep id as the slug/friendly ID
  designerId: string;
}


async function getPortfolioCollection(): Promise<Collection<PortfolioItemRecord>> {
  const { db } = await connectToDatabase();
  return db.collection<PortfolioItemRecord>('portfolioItems');
}

export async function getPortfolioItemsByDesignerId(designerId: string): Promise<PortfolioItem[]> {
  try {
    const collection = await getPortfolioCollection();
    const items = await collection.find({ designerId }).sort({ projectDate: -1 }).toArray();
    
    return items.map(item => ({
      ...item,
      _id: item._id?.toHexString(), // Convert ObjectId to string for frontend
    })) as PortfolioItem[];
  } catch (error) {
    console.error('Error fetching portfolio items by designer ID:', error);
    return [];
  }
}

export async function getPortfolioItemById(itemId: string): Promise<PortfolioItem | null> {
  try {
    const collection = await getPortfolioCollection();
    // Assuming 'id' is the unique slug. If using MongoDB's _id, adjust query.
    const item = await collection.findOne({ id: itemId }); 
    if (!item) return null;
    
    return {
      ...item,
      _id: item._id?.toHexString(),
    } as PortfolioItem;
  } catch (error) {
    console.error('Error fetching portfolio item by ID:', error);
    return null;
  }
}

export async function createPortfolioItem(
  itemData: Omit<PortfolioItem, '_id'> & { designerId: string }
): Promise<PortfolioItem | null> {
  try {
    const collection = await getPortfolioCollection();
    const { id, designerId, title, category, categorySlug, projectDescription, coverImageUrl, coverImageHint, galleryImages = [], tags = [], clientName, projectDate } = itemData;

    const newItemRecord: PortfolioItemRecord = {
      id, // slug
      designerId,
      title,
      category,
      categorySlug,
      projectDescription,
      coverImageUrl,
      coverImageHint,
      galleryImages,
      tags,
      clientName,
      projectDate,
      // designer field is part of PortfolioItem but not PortfolioItemRecord for direct DB storage
      // It can be populated on retrieval by joining/looking up designerData
    };

    const result = await collection.insertOne(newItemRecord);
    if (!result.insertedId) {
      throw new Error('Failed to insert portfolio item');
    }
    
    return {
      ...newItemRecord,
      _id: result.insertedId.toHexString(),
      designer: itemData.designer // Keep designer info for return if provided
    } as PortfolioItem;

  } catch (error) {
    console.error('Error creating portfolio item:', error);
    // Consider more specific error handling or re-throwing
    return null;
  }
}

export async function updatePortfolioItem(
  itemId: string, // This should be the MongoDB _id as string
  designerId: string, // To verify ownership
  itemData: Partial<Omit<PortfolioItem, '_id' | 'id' | 'designerId'>>
): Promise<PortfolioItem | null> {
  try {
    const collection = await getPortfolioCollection();
    const _id = new ObjectId(itemId);

    const result = await collection.findOneAndUpdate(
      { _id, designerId },
      { $set: itemData },
      { returnDocument: 'after' }
    );

    if (!result) {
      console.warn(`Portfolio item not found or designer ID mismatch for update: itemId=${itemId}, designerId=${designerId}`);
      return null;
    }
    
    return {
        ...result,
        _id: result._id?.toHexString(),
    } as PortfolioItem;

  } catch (error) {
    console.error('Error updating portfolio item:', error);
    return null;
  }
}

export async function deletePortfolioItem(itemId: string, designerId: string): Promise<boolean> {
  try {
    const collection = await getPortfolioCollection();
    const _id = new ObjectId(itemId);
    const result = await collection.deleteOne({ _id, designerId });
    return result.deletedCount === 1;
  } catch (error) {
    console.error('Error deleting portfolio item:', error);
    return false;
  }
}
