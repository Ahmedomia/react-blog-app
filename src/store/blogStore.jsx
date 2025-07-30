import { create } from "zustand";

export const useBlogStore = create((set) => ({
  blogs: [],
  users: [],
  setBlogs: (blogs) => set({ blogs }),
  setUsers: (users) => set({ users }),
  updateUserInUsers: (updatedUser) =>
    set((state) => ({
      users: state.users.map((u) =>
        u.id === updatedUser.id ? { ...u, ...updatedUser } : u
      ),
    })),
}));
