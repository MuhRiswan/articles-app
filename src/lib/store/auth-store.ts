// lib/store/auth-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  username: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      clearUser: () => {
        localStorage.removeItem("token");
        set({ user: null });
      },
    }),
    {
      name: "auth-storage", // key di localStorage
    }
  )
);
