import {create} from "zustand";
import apiRequest from "./apiRequest.js";
import {singlePostData as currentSavedPost} from "./dummydata.js";

export const savedPostStore = create((set) => ({
    savedPosts: [],
    currentSavedPost: {},
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
    setCurrentSavedPost : (currentSavedPost) => {
        set({currentSavedPost});
    }
}));

