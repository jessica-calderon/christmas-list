import { ref, push, set, remove, onValue, type DatabaseReference, type Unsubscribe } from 'firebase/database';
import { database } from '../firebase';
import type { Person } from '../types/person';
import { generateUUID } from '../utils/uuid';

export interface FirebasePerson extends Omit<Person, 'wishlist'> {
  createdBy: string;
  createdAt: number;
}

export interface FirebasePersonResponse {
  [personId: string]: Omit<FirebasePerson, 'id'>;
}

/**
 * Gets a unique identifier for the current user/session
 */
function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUUID();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export function getPersonsRef(): DatabaseReference {
  return ref(database, 'persons');
}

export function getPersonRef(personId: string): DatabaseReference {
  return ref(database, `persons/${personId}`);
}

export async function addPerson(name: string): Promise<string> {
  try {
    const personsRef = getPersonsRef();
    const newPersonRef = push(personsRef);
    const personId = newPersonRef.key!;
    const userId = getUserId();
    
    const personData: Omit<FirebasePerson, 'id'> = {
      name: name.trim(),
      createdBy: userId,
      createdAt: Date.now(),
    };
    
    await set(newPersonRef, personData);
    return personId;
  } catch (error: any) {
    console.error('Error adding person:', error);
    // Provide more detailed error information
    const errorCode = error?.code || 'unknown';
    const errorMessage = error?.message || 'Unknown error occurred';
    const detailedError = new Error(
      `Firebase error (${errorCode}): ${errorMessage}. ` +
      `If this is a permission error, check Firebase Realtime Database rules to allow writes to /persons`
    );
    (detailedError as any).originalError = error;
    throw detailedError;
  }
}

export async function deletePerson(personId: string): Promise<void> {
  try {
    const personRef = getPersonRef(personId);
    await remove(personRef);
  } catch (error) {
    console.error('Error deleting person:', error);
    throw error;
  }
}

export function subscribeToPersons(
  callback: (persons: FirebasePerson[]) => void
): () => void {
  const personsRef = getPersonsRef();
  
  const unsubscribe: Unsubscribe = onValue(
    personsRef,
    (snapshot) => {
      const data = snapshot.val() as FirebasePersonResponse | null;
      if (data) {
        const persons: FirebasePerson[] = Object.entries(data).map(([id, person]) => ({
          id,
          name: person.name || '',
          createdBy: person.createdBy || '',
          createdAt: person.createdAt || 0,
        }));
        callback(persons);
      } else {
        callback([]);
      }
    },
    (error) => {
      console.error('Error subscribing to persons:', error);
      callback([]);
    }
  );

  return unsubscribe;
}

/**
 * Gets the current user's ID
 */
export function getCurrentUserId(): string {
  return getUserId();
}

