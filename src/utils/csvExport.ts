import type { Person } from '../types/person';
import type { WishItem } from '../types/wishItem';
import { get } from 'firebase/database';
import { getWishlistRef } from '../services/wishlist';

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
 */
export function generateCSV(peopleWithWishlists: Array<{ person: Person; wishlist: WishItem[] }>): string {
  // CSV Header
  const headers = ['Name', 'Item Title', 'Link', 'Price', 'Notes'];
  const csvRows: string[] = [headers.map(escapeCsvField).join(',')];

  // Add data rows
  for (const { person, wishlist } of peopleWithWishlists) {
    if (wishlist.length === 0) {
      // If person has no wishlist items, still include them with empty item row
      csvRows.push([
        escapeCsvField(person.name),
        escapeCsvField(''),
        escapeCsvField(''),
        escapeCsvField(''),
        escapeCsvField(''),
      ].join(','));
    } else {
      // Add a row for each wishlist item
      // Only show person name on the first item row
      wishlist.forEach((item, index) => {
        csvRows.push([
          // Show person name only on first row for this person
          index === 0 ? escapeCsvField(person.name) : escapeCsvField(''),
          escapeCsvField(item.title || ''),
          escapeCsvField(item.link || ''),
          escapeCsvField(item.price || ''),
          escapeCsvField(item.notes || ''),
        ].join(','));
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

