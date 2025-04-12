import { create } from 'zustand';

interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: string;
  price: string;
}

interface OrderDetails {
  orderId: string;
  status: string;
  estimatedDelivery: string;
  items: OrderItem[];
  deliveryAddress: string;
  deliveryNote: string;
  currentStep: number;
}

interface OrderStore {
  order: OrderDetails | null;
  setOrder: (order: OrderDetails) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  clearOrder: () => set({ order: null }),
}));
