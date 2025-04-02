import { create } from "zustand";
import apiRequest from "./apiRequest";

export const listPostStore = create((set) => ({
  posts: [],
  isLoading: false,
  isFetch: false,
  fetch: async (query) => {
    const res = await apiRequest("/posts?" + query);
    set({posts: res.data});
  },
  reset: () => {
    set({posts: []});
  },
  setIsLoading: (isLoading) => {
    set({isLoading});
  },
  setIsFetch: (isFetch) => {
    set({isFetch:isFetch});
  }
}));
