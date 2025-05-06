// store/useAuthStore.ts
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

// store/useAuthStore.ts
interface User {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    deliveryAddress: string;
  }
  

interface AuthState {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  loadAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  login: async (user, token) => {
    await AsyncStorage.setItem('user', JSON.stringify(user));
    await AsyncStorage.setItem('token', token);
    set({ user, token, isLoggedIn: true });
  },

  logout: async () => {
    await AsyncStorage.removeItem('user');
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null, isLoggedIn: false });
  },

  loadAuth: async () => {
    const userData = await AsyncStorage.getItem('user');
    const savedToken = await AsyncStorage.getItem('token');
    if (userData && savedToken) {
      set({
        user: JSON.parse(userData),
        token: savedToken,
        isLoggedIn: true,
      });
    }
  },
  
}));
