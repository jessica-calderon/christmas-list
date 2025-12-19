import { ref, set, onValue, type DatabaseReference, type Unsubscribe } from 'firebase/database';
import { database } from '../firebase';
import type { SantaRecipientStatusData, SantaGiftTracking } from '../types/santaTracking';
import { getCurrentUserId } from './persons';

/**
 * Gets the Firebase reference for Santa tracking data
 * Path: /santaTracking/{santaUserId}/{recipientUserId}
 */
export function getSantaTrackingRef(santaUserId: string, recipientUserId: string): DatabaseReference {
  return ref(database, `santaTracking/${santaUserId}/${recipientUserId}`);
}

/**
 * Gets the Firebase reference for all tracking data for a Santa
 * Path: /santaTracking/{santaUserId}
 */
export function getSantaTrackingRootRef(santaUserId: string): DatabaseReference {
  return ref(database, `santaTracking/${santaUserId}`);
}

/**
 * Updates the status for a recipient
 */
export async function updateRecipientStatus(
  santaUserId: string,
  recipientUserId: string,
  status: SantaRecipientStatusData['status'],
  notes?: string
): Promise<void> {
  try {
    const statusRef = getSantaTrackingRef(santaUserId, recipientUserId);
    const currentData = await getRecipientStatus(santaUserId, recipientUserId);
    
    const statusData: SantaRecipientStatusData = {
      status,
      updatedAt: Date.now(),
      purchasedItems: currentData?.purchasedItems || [],
    };
    
    if (notes !== undefined) {
      statusData.notes = notes.trim() || undefined;
    }
    
    await set(statusRef, statusData);
  } catch (error) {
    console.error('Error updating recipient status:', error);
    throw error;
  }
}

/**
 * Toggles a wishlist item as purchased/unpurchased
 * Auto-advances status: first item → purchased, all items → complete
 */
export async function toggleItemPurchased(
  santaUserId: string,
  recipientUserId: string,
  itemId: string,
  totalItems: number
): Promise<void> {
  try {
    const statusRef = getSantaTrackingRef(santaUserId, recipientUserId);
    const currentData = await getRecipientStatus(santaUserId, recipientUserId);
    
    const purchasedItems = currentData?.purchasedItems || [];
    const isPurchased = purchasedItems.includes(itemId);
    
    let newPurchasedItems: string[];
    if (isPurchased) {
      newPurchasedItems = purchasedItems.filter(id => id !== itemId);
    } else {
      newPurchasedItems = [...purchasedItems, itemId];
    }
    
    // Auto-advance status based on purchased items
    let newStatus: SantaRecipientStatusData['status'] = currentData?.status || 'not_started';
    if (newPurchasedItems.length === 0) {
      newStatus = 'not_started';
    } else if (newPurchasedItems.length === totalItems) {
      newStatus = 'complete';
    } else if (newPurchasedItems.length > 0 && newPurchasedItems.length < totalItems) {
      // Some items purchased but not all - set to in_progress
      // Only auto-set if currently not_started, otherwise preserve manual status (purchased/wrapped)
      if (newStatus === 'not_started') {
        newStatus = 'in_progress';
      } else if (newStatus === 'complete') {
        // If going from complete back to partial, set to in_progress
        newStatus = 'in_progress';
      }
      // If status is already purchased or wrapped, keep it (user manually set it)
    }
    
    const statusData: SantaRecipientStatusData = {
      status: newStatus,
      purchasedItems: newPurchasedItems,
      updatedAt: Date.now(),
      notes: currentData?.notes,
    };
    
    await set(statusRef, statusData);
  } catch (error) {
    console.error('Error toggling item purchased:', error);
    throw error;
  }
}

/**
 * Updates notes for a recipient without changing status
 */
export async function updateRecipientNotes(
  santaUserId: string,
  recipientUserId: string,
  notes: string
): Promise<void> {
  try {
    const statusRef = getSantaTrackingRef(santaUserId, recipientUserId);
    const currentData = await getRecipientStatus(santaUserId, recipientUserId);
    
    const statusData: SantaRecipientStatusData = {
      status: currentData?.status || 'not_started',
      updatedAt: Date.now(),
      purchasedItems: currentData?.purchasedItems || [],
    };
    
    if (notes.trim()) {
      statusData.notes = notes.trim();
    }
    
    await set(statusRef, statusData);
  } catch (error) {
    console.error('Error updating recipient notes:', error);
    throw error;
  }
}

/**
 * Gets the current status for a recipient (one-time read)
 */
export async function getRecipientStatus(
  santaUserId: string,
  recipientUserId: string
): Promise<SantaRecipientStatusData | null> {
  return new Promise((resolve, reject) => {
    const statusRef = getSantaTrackingRef(santaUserId, recipientUserId);
    
    onValue(
      statusRef,
      (snapshot) => {
        const data = snapshot.val() as SantaRecipientStatusData | null;
        resolve(data);
      },
      (error) => {
        console.error('Error getting recipient status:', error);
        reject(error);
      },
      { onlyOnce: true }
    );
  });
}

/**
 * Subscribes to all tracking data for a Santa
 * Returns a function to unsubscribe
 */
export function subscribeToSantaTracking(
  santaUserId: string,
  callback: (tracking: SantaGiftTracking) => void
): () => void {
  const trackingRef = getSantaTrackingRootRef(santaUserId);
  
  const unsubscribe: Unsubscribe = onValue(
    trackingRef,
    (snapshot) => {
      const data = snapshot.val() as SantaGiftTracking | null;
      callback(data || {});
    },
    (error) => {
      console.error('Error subscribing to Santa tracking:', error);
      callback({});
    }
  );

  return unsubscribe;
}

/**
 * Subscribes to status for a specific recipient
 * Returns a function to unsubscribe
 */
export function subscribeToRecipientStatus(
  santaUserId: string,
  recipientUserId: string,
  callback: (status: SantaRecipientStatusData | null) => void
): () => void {
  const statusRef = getSantaTrackingRef(santaUserId, recipientUserId);
  
  const unsubscribe: Unsubscribe = onValue(
    statusRef,
    (snapshot) => {
      const data = snapshot.val() as SantaRecipientStatusData | null;
      callback(data);
    },
    (error) => {
      console.error('Error subscribing to recipient status:', error);
      callback(null);
    }
  );

  return unsubscribe;
}

/**
 * Gets the current Santa user ID (uses the same userId system)
 */
export function getSantaUserId(): string {
  return getCurrentUserId();
}

