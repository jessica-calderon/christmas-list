export type SantaRecipientStatus = 'not_started' | 'in_progress' | 'purchased' | 'wrapped' | 'complete';

export interface SantaRecipientStatusData {
  status: SantaRecipientStatus;
  notes?: string;
  updatedAt: number;
  purchasedItems?: string[]; // Array of wishlist item IDs that have been purchased
}

export interface SantaGiftTracking {
  [recipientUserId: string]: SantaRecipientStatusData;
}

