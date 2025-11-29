import { ref, push, set, update, remove, onValue, type DatabaseReference, type Unsubscribe } from 'firebase/database';
import { database } from '../firebase';
import type { WishItem } from '../types/wishItem';

export interface FirebaseWishlistItem extends WishItem {
  id: string;
}

export interface FirebaseWishlistResponse {
  [itemId: string]: Omit<WishItem, 'id'>;
}

export function getWishlistRef(personId: string): DatabaseReference {
  return ref(database, `wishlists/${personId}/items`);
}

export async function addWishlistItem(personId: string, item: WishItem): Promise<void> {
  try {
    const wishlistRef = getWishlistRef(personId);
    const newItemRef = push(wishlistRef);
    const itemData: Omit<WishItem, 'id'> = {
      title: item.title,
      link: item.link,
      notes: item.notes,
      price: item.price,
      image: item.image,
    };
    await set(newItemRef, itemData);
  } catch (error) {
    console.error('Error adding wishlist item:', error);
    throw error;
  }
}

export async function updateWishlistItem(
  personId: string,
  itemId: string,
  updates: Partial<Omit<WishItem, 'id'>>
): Promise<void> {
  try {
    const itemRef = ref(database, `wishlists/${personId}/items/${itemId}`);
    await update(itemRef, updates);
  } catch (error) {
    console.error('Error updating wishlist item:', error);
    throw error;
  }
}

export async function deleteWishlistItem(personId: string, itemId: string): Promise<void> {
  try {
    const itemRef = ref(database, `wishlists/${personId}/items/${itemId}`);
    await remove(itemRef);
  } catch (error) {
    console.error('Error deleting wishlist item:', error);
    throw error;
  }
}

export function subscribeToWishlist(
  personId: string,
  callback: (items: FirebaseWishlistItem[]) => void
): () => void {
  const wishlistRef = getWishlistRef(personId);
  
  const unsubscribe: Unsubscribe = onValue(
    wishlistRef,
    (snapshot) => {
      const data = snapshot.val() as FirebaseWishlistResponse | null;
      if (data) {
        const items: FirebaseWishlistItem[] = Object.entries(data).map(([id, item]) => ({
          id,
          ...item,
        }));
        callback(items);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error('Error subscribing to wishlist:', error);
      callback([]);
    }
  );

  return unsubscribe;
}

