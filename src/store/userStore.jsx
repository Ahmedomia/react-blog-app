import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      setUser: (newUser) =>
        set((state) => ({
          user: { ...state.user, ...newUser },
        })),
      clearUser: () => set({ user: null, accessToken: null }),
      setAccessToken: (token) => set({ accessToken: token }),
      clearAccessToken: () => set({ accessToken: null }),
    }),
    {
      name: "loggedInUser",
    }
  )
);