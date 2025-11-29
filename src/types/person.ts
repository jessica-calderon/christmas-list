import type { WishItem } from './wishItem';

export interface Person {
  id: string;
  name: string;
  wishlist: WishItem[];
  createdBy?: string;
  createdAt?: number;
}

