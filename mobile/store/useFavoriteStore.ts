// store/useFavoriteStore.ts
import { create } from 'zustand';

export type ProductType = {
  id: string;
  name: string;
  price: string;
  oldPrice: string;
  weight: string;
  image: any;
  description: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  vitaminC: string;
  category: string;
};

type FavoriteState = {
  favorites: ProductType[];
  toggleFavorite: (product: ProductType) => void;
  isFavorited: (product: ProductType) => boolean;
};

export const useFavoriteStore = create<FavoriteState>((set, get) => ({
  favorites: [],
  toggleFavorite: (product) => {
    const { favorites } = get();
    const exists = favorites.find((item) => item.name === product.name);
    if (exists) {
      set({ favorites: favorites.filter((item) => item.name !== product.name) });
    } else {
      set({ favorites: [...favorites, product] });
    }
  },
  isFavorited: (product) => {
    return get().favorites.some((item) => item.name === product.name);
  },
}));
