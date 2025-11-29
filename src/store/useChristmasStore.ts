import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Person } from '../types/person';
import type { WishItem } from '../types/wishItem';
import { initialFamily } from '../data/family';
import { generateUUID } from '../utils/uuid';

interface ChristmasStore {
  people: Person[];
  deletedInitialFamilyIds: string[];
  getPeople: () => Person[];
  getPerson: (id: string) => Person | undefined;
  setPeople: (people: Person[]) => void;
  addPerson: (name: string) => void;
  deletePerson: (personId: string) => void;
  markInitialFamilyDeleted: (personId: string) => void;
  addWishItem: (personId: string, item: WishItem) => void;
  editWishItem: (personId: string, updatedItem: WishItem) => void;
  deleteWishItem: (personId: string, itemId: string) => void;
}

export const useChristmasStore = create<ChristmasStore>()(
  persist(
    (set, get) => ({
      people: initialFamily,
      deletedInitialFamilyIds: [],
      getPeople: () => get().people,
      getPerson: (id: string) => get().people.find((p) => p.id === id),
      setPeople: (people: Person[]) => {
        set({ people });
      },
      addPerson: (name: string) => {
        // This is now handled by Firebase, but keeping for backward compatibility
        const newPerson: Person = {
          id: generateUUID(),
          name: name.trim(),
          wishlist: [],
        };
        set((state) => ({
          people: [...state.people, newPerson],
        }));
      },
      deletePerson: (personId: string) => {
        set((state) => ({
          people: state.people.filter((p) => p.id !== personId),
        }));
      },
      markInitialFamilyDeleted: (personId: string) => {
        set((state) => ({
          deletedInitialFamilyIds: [...state.deletedInitialFamilyIds, personId],
        }));
      },
      addWishItem: (personId: string, item: WishItem) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId
              ? { ...person, wishlist: [...person.wishlist, item] }
              : person
          ),
        }));
      },
      editWishItem: (personId: string, updatedItem: WishItem) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId
              ? {
                  ...person,
                  wishlist: person.wishlist.map((item) =>
                    item.id === updatedItem.id ? updatedItem : item
                  ),
                }
              : person
          ),
        }));
      },
      deleteWishItem: (personId: string, itemId: string) => {
        set((state) => ({
          people: state.people.map((person) =>
            person.id === personId
              ? {
                  ...person,
                  wishlist: person.wishlist.filter((item) => item.id !== itemId),
                }
              : person
          ),
        }));
      },
    }),
    {
      name: 'christmas-wishlist',
    }
  )
);
