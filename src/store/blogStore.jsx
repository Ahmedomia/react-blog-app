import { create } from "zustand";

export const useBlogStore = create((set) => ({
  blogs: [],
  users: [],
  page: 0,
  hasMore: true,
  loading: false,

  setBlogs: (blogs) => set({ blogs }),
  appendBlogs: (newBlogs) =>
    set((state) => ({ blogs: [...state.blogs, ...newBlogs] })),

  setUsers: (users) => set({ users }),

  updateUserInUsers: (updatedUser) =>
    set((state) => {
      const updatedBlogs = state.blogs.map((b) =>
        b.authorid === updatedUser.id
          ? {
              ...b,
              author: updatedUser.name,
              authoremail: updatedUser.email,
              authorpic: updatedUser.profilepic,
            }
          : b
      );
      return { blogs: updatedBlogs };
    }),

  setPage: (updater) =>
    set((state) => ({
      page: typeof updater === "function" ? updater(state.page) : updater,
    })),
  setHasMore: (hasMore) => set({ hasMore }),
  setLoading: (loading) => set({ loading }),
}));
