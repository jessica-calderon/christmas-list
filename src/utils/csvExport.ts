import type { Person } from '../types/person';
import type { WishItem } from '../types/wishItem';
import type { SantaGiftTracking } from '../types/santaTracking';
import { get } from 'firebase/database';
import { getWishlistRef } from '../services/wishlist';
import { getSantaTrackingRootRef, getSantaUserId } from '../services/santaTracking';
import { isSanta } from '../config/santa';

/**
 * Escapes a CSV field value by wrapping it in quotes if it contains commas, quotes, or newlines
 */
function escapeCsvField(field: string): string {
  if (field.includes(',') || field.includes('"') || field.includes('\n') || field.includes('\r')) {
    // Escape quotes by doubling them and wrap in quotes
    return `"${field.replace(/"/g, '""')}"`;
  }
  return field;
}

/**
 * Converts wishlist data to CSV format
 * Person name is only shown on the first row for each person, making it easier to read
 * Includes Santa tracking data if Santa Mode is active
 */
export function generateCSV(
  peopleWithWishlists: Array<{ person: Person; wishlist: WishItem[] }>,
  santaTracking?: SantaGiftTracking
): string {
  const includeSantaData = isSanta() && santaTracking !== undefined;
  
  // CSV Header
  const headers = ['Name', 'Item Title', 'Link', 'Price', 'Notes'];
  if (includeSantaData) {
    headers.push('Santa Status', 'Purchased Items', 'Santa Notes');
  }
  const csvRows: string[] = [headers.map(escapeCsvField).join(',')];

  // Add data rows
  for (const { person, wishlist } of peopleWithWishlists) {
    const tracking = includeSantaData ? santaTracking[person.id] : null;
    const status = tracking?.status || '';
    const purchasedCount = tracking?.purchasedItems?.length || 0;
    const totalItems = wishlist.length;
    const purchasedInfo = includeSantaData && totalItems > 0 
      ? `${purchasedCount}/${totalItems}` 
      : '';
    const santaNotes = tracking?.notes || '';

    if (wishlist.length === 0) {
      // If person has no wishlist items, still include them with empty item row
      const row = [
        escapeCsvField(person.name),
        escapeCsvField(''),
        escapeCsvField(''),
        escapeCsvField(''),
        escapeCsvField(''),
      ];
      if (includeSantaData) {
        row.push(
          escapeCsvField(status),
          escapeCsvField(purchasedInfo),
          escapeCsvField(santaNotes)
        );
      }
      csvRows.push(row.join(','));
    } else {
      // Add a row for each wishlist item
      // Only show person name and Santa data on the first item row
      wishlist.forEach((item, index) => {
        const isFirstRow = index === 0;
        const row = [
          // Show person name only on first row for this person
          isFirstRow ? escapeCsvField(person.name) : escapeCsvField(''),
          escapeCsvField(item.title || ''),
          escapeCsvField(item.link || ''),
          escapeCsvField(item.price || ''),
          escapeCsvField(item.notes || ''),
        ];
        if (includeSantaData) {
          row.push(
            isFirstRow ? escapeCsvField(status) : escapeCsvField(''),
            isFirstRow ? escapeCsvField(purchasedInfo) : escapeCsvField(''),
            isFirstRow ? escapeCsvField(santaNotes) : escapeCsvField('')
          );
        }
        csvRows.push(row.join(','));
      });
    }
  }

  return csvRows.join('\n');
}

/**
 * Downloads a CSV file
 */
export function downloadCSV(csvContent: string, filename: string = 'christmas-wishlist.csv'): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up the URL object
  URL.revokeObjectURL(url);
}

/**
 * Fetches all wishlist data for all people
 * Returns a promise that resolves with an array of people and their wishlists
 */
export async function fetchAllWishlistData(people: Person[]): Promise<Array<{ person: Person; wishlist: WishItem[] }>> {
  const promises = people.map(async (person) => {
    try {
      const wishlistRef = getWishlistRef(person.id);
      const snapshot = await get(wishlistRef);
      const data = snapshot.val();
      
      if (data) {
        const items: WishItem[] = Object.entries(data).map(([id, item]: [string, any]) => ({
          id,
          title: item.title || '',
          link: item.link ?? '',
          notes: item.notes ?? '',
          price: item.price ?? '',
          image: item.image ?? '',
        }));
        return { person, wishlist: items };
      } else {
        return { person, wishlist: [] };
      }
    } catch (error) {
      console.error(`Error fetching wishlist for ${person.name}:`, error);
      return { person, wishlist: [] };
    }
  });

  return Promise.all(promises);
}

/**
 * Fetches Santa tracking data for all recipients
 * Only fetches if Santa Mode is active
 * Returns a promise that resolves with Santa tracking data or null
 */
export async function fetchSantaTrackingData(): Promise<SantaGiftTracking | null> {
  if (!isSanta()) {
    return null;
  }

  try {
    const santaUserId = getSantaUserId();
    const trackingRef = getSantaTrackingRootRef(santaUserId);
    const snapshot = await get(trackingRef);
    const data = snapshot.val() as SantaGiftTracking | null;
    return data || null;
  } catch (error) {
    console.error('Error fetching Santa tracking data:', error);
    return null;
  }
}

