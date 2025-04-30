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
  quantity?: number;
  totalPrice: string;
}

interface ProductStore {
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product) => void;

  cart: Product[];
  addToCart: (product: Product) => void;
  removeFromCart: (index: number) => void;
  increaseQuantity: (index: number) => void;
  decreaseQuantity: (index: number) => void;
}

export const useProductStore = create<ProductStore>((set) => ({
  selectedProduct: null,
  setSelectedProduct: (product) => set({ selectedProduct: product }),

  cart: [],
  addToCart: (product) =>
    set((state) => {
      const existingIndex = state.cart.findIndex((p) => p.name === product.name);
      const updatedProduct = { ...product, totalPrice: (parseFloat(product.price) * (product.quantity || 1)).toString() };
  
      if (existingIndex !== -1) {
        const updatedCart = [...state.cart];
        updatedCart[existingIndex].quantity = (updatedCart[existingIndex].quantity || 1) + 1;
        updatedCart[existingIndex].totalPrice = (parseFloat(updatedCart[existingIndex].price) * updatedCart[existingIndex].quantity).toString();
        return { cart: updatedCart };
      }
  
      return {
        cart: [...state.cart, updatedProduct],
      };
    }),

  removeFromCart: (index) =>
    set((state) => ({
      cart: state.cart.filter((_, i) => i !== index),
    })),

    increaseQuantity: (index) =>
      set((state) => {
        const updatedCart = [...state.cart];
        updatedCart[index].quantity = (updatedCart[index].quantity || 1) + 1;
        updatedCart[index].totalPrice = (parseFloat(updatedCart[index].price) * updatedCart[index].quantity).toString(); // Recalculate totalPrice
        return { cart: updatedCart };
      }),

    decreaseQuantity: (index) =>
      set((state) => {
        const updatedCart = [...state.cart];
        if ((updatedCart[index].quantity || 1) > 1) {
          updatedCart[index].quantity! -= 1;
          updatedCart[index].totalPrice = (parseFloat(updatedCart[index].price) * updatedCart[index].quantity!).toString(); // Recalculate totalPrice
        } else {
          updatedCart.splice(index, 1); // Remove product if quantity reaches 1
        }
        return { cart: updatedCart };
      }),
}));
