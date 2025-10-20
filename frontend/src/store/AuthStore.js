// src/store/AuthStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

const AuthStore = create(
  persist(
    (set) => ({
      isAuthenticated: false,
      token: null,
      user: null,
      setAuthInfo: (token, user) => set({ token, user, isAuthenticated: true }),
      clearAuth: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: "Devtrack-token",
      getStorage: () => localStorage,
    }
  )
);

export default AuthStore;
