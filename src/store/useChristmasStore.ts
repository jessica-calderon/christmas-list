import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Person } from '../types/person';
import type { WishItem } from '../types/wishItem';
import { initialFamily } from '../data/family';

interface ChristmasStore {
  people: Person[];
  getPeople: () => Person[];
  getPerson: (id: string) => Person | undefined;
  addPerson: (name: string) => void;
  addWishItem: (personId: string, item: WishItem) => void;
  editWishItem: (personId: string, updatedItem: WishItem) => void;
  deleteWishItem: (personId: string, itemId: string) => void;
}

export const useChristmasStore = create<ChristmasStore>()(
  persist(
    (set, get) => ({
      people: initialFamily,
      getPeople: () => get().people,
      getPerson: (id: string) => get().people.find((p) => p.id === id),
      addPerson: (name: string) => {
        const newPerson: Person = {
          id: crypto.randomUUID(),
          name: name.trim(),
          wishlist: [],
        };
        set((state) => ({
          people: [...state.people, newPerson],
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
