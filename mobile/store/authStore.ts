// authStore.ts
import { create } from 'zustand';

// Define the shape of the AuthState
interface AuthState {
  token: string | null;
  setToken: (token: string | null) => void;
  clearToken: () => void;
}

// Create Zustand store
export const useAuthStore = create<AuthState>((set) => ({
  token: null, // initial state of the token
  setToken: (token) => set({ token }),
  clearToken: () => set({ token: null }),
}));
