/**
 * Generates a UUID v4 compatible string
 * Uses crypto.randomUUID() if available, otherwise falls back to manual generation
 */
export function generateUUID(): string {
  // Use native crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback: Manual UUID v4 generation
  // Generate random bytes
  const getRandomBytes = (size: number): Uint8Array => {
    const bytes = new Uint8Array(size);
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(bytes);
    } else {
      // Fallback for very old browsers
      for (let i = 0; i < size; i++) {
        bytes[i] = Math.floor(Math.random() * 256);
      }
    }
    return bytes;
  };

  // UUID v4 format: xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx
  // Need 16 bytes (128 bits) = 32 hex characters
  const bytes = getRandomBytes(16);
  
  // Set version (4) in the 7th byte
  bytes[6] = (bytes[6] & 0x0f) | 0x40; // Version 4
  // Set variant bits (10) in the 9th byte
  bytes[8] = (bytes[8] & 0x3f) | 0x80; // Variant 10
  
  // Convert to hex string
  const hex = Array.from(bytes)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  
  return [
    hex.slice(0, 8),
    hex.slice(8, 12),
    hex.slice(12, 16),
    hex.slice(16, 20),
    hex.slice(20, 32),
  ].join('-');
}

