import { create } from 'zustand';

interface Product {
  name: string;
  price: string;
  weight: string;
  image: any;
  description: string;
  calories: string;
  protein: string;
  carbohydrates: string;
  vitaminC: string;
  oldPrice?: string;
}

interface ProductStore {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;

  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  cart: [],
  addToCart: (product) => set((state) => ({ cart: [...state.cart, product] })),
  removeFromCart: (index) =>
    set((state) => ({
      cart: state.cart.filter((_, i) => i !== index),
    })),
}));
