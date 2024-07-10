import { create } from "zustand";
import apiRequest from "./apiRequest";

export const listPostStore = create((set) => ({
  posts: [],
  query: '',
  fetch: async (query) => {
    const res = await apiRequest("/posts?" + query);
    set({posts: res.data});
  },
  reset: () => {
    set({posts: []});
  },
  setPosts: (posts) => {
    set({posts: posts});
  },
  setQuery: (query) => {
    set({query: query});
  }
}));
