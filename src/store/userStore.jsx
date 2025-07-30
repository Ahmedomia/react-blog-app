import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      setUser: (newUser) => set({ user: newUser }),
      clearUser: () => set({ user: null }),
    }),
    {
      name: "loggedInUser",
    }
  )
);
