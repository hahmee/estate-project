import {create} from "zustand";
import apiRequest from "./apiRequest.js";

export const savedPostStore = create((set) => ({
    savedPosts: null,
    fetch: async () => {
        const res = await apiRequest("/users/savedPosts");
        set({savedPosts: res.data});
    },
    save: async (postId) => {
        await apiRequest.post("/users/save", {postId: postId});
    },
    reset: () => {
        set({savedPosts: null});
    },
}));

