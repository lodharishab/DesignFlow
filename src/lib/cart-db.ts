'use server';
import { db, isDbEnabled } from './db';
import { cartItems } from './schema';
import { eq, and } from 'drizzle-orm';

// ============================================================================
// Types
// ============================================================================

export interface CartItem {
  id: string;
  userId: string;
  serviceId?: string;
  tierId?: string;
  name: string;
  tierName?: string;
  price: number;
  imageUrl?: string;
  imageHint?: string;
  quantity: number;
}

// ============================================================================
// Row mapper
// ============================================================================

function rowToCartItem(row: typeof cartItems.$inferSelect): CartItem {
  return {
    id: row.id,
    userId: row.userId,
    serviceId: row.serviceId || undefined,
    tierId: row.tierId || undefined,
    name: row.name,
    tierName: row.tierName || undefined,
    price: parseFloat(row.price),
    imageUrl: row.imageUrl || undefined,
    imageHint: row.imageHint || undefined,
    quantity: row.quantity,
  };
}

// ============================================================================
// Cart CRUD
// ============================================================================

export async function getCartByUser(userId: string): Promise<CartItem[]> {
  if (!isDbEnabled()) return [];
  try {
    const rows = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    return rows.map(rowToCartItem);
  } catch (e) {
    console.error('Error fetching cart:', e);
    return [];
  }
}

export async function addToCart(data: CartItem): Promise<CartItem | null> {
  if (!isDbEnabled()) return null;
  try {
    // Check if item already exists for same service+tier
    if (data.serviceId && data.tierId) {
      const existing = await db.select().from(cartItems)
        .where(and(
          eq(cartItems.userId, data.userId),
          eq(cartItems.serviceId, data.serviceId),
          eq(cartItems.tierId, data.tierId),
        ));
      if (existing.length > 0) {
        // Increment quantity
        const rows = await db.update(cartItems)
          .set({ quantity: existing[0].quantity + 1 })
          .where(eq(cartItems.id, existing[0].id))
          .returning();
        return rows[0] ? rowToCartItem(rows[0]) : null;
      }
    }
    const rows = await db.insert(cartItems).values({
      id: data.id,
      userId: data.userId,
      serviceId: data.serviceId || null,
      tierId: data.tierId || null,
      name: data.name,
      tierName: data.tierName || null,
      price: data.price.toString(),
      imageUrl: data.imageUrl || null,
      imageHint: data.imageHint || null,
      quantity: data.quantity || 1,
    }).returning();
    return rows[0] ? rowToCartItem(rows[0]) : null;
  } catch (error) {
    console.error('Error adding to cart:', error);
    return null;
  }
}

export async function updateCartItemQuantity(id: string, quantity: number): Promise<CartItem | null> {
  if (!isDbEnabled()) return null;
  try {
    if (quantity <= 0) {
      await db.delete(cartItems).where(eq(cartItems.id, id));
      return null;
    }
    const rows = await db.update(cartItems).set({ quantity }).where(eq(cartItems.id, id)).returning();
    return rows[0] ? rowToCartItem(rows[0]) : null;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return null;
  }
}

export async function removeFromCart(id: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    const rows = await db.delete(cartItems).where(eq(cartItems.id, id)).returning({ id: cartItems.id });
    return rows.length > 0;
  } catch (error) {
    console.error('Error removing from cart:', error);
    return false;
  }
}

export async function clearCart(userId: string): Promise<boolean> {
  if (!isDbEnabled()) return false;
  try {
    await db.delete(cartItems).where(eq(cartItems.userId, userId));
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
}

export async function getCartTotal(userId: string): Promise<number> {
  if (!isDbEnabled()) return 0;
  try {
    const items = await db.select().from(cartItems).where(eq(cartItems.userId, userId));
    return items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  } catch (e) {
    console.error('Error computing cart total:', e);
    return 0;
  }
}
