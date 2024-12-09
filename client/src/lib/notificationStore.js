import { create } from "zustand";
import apiRequest from "./apiRequest";

export const useNotificationStore = create((set, getState) => ({
  number: 0,
  unreadChatIds: [],
  fetch: async () => {
    //읽지않은 채팅방 개수
    const res = await apiRequest("/users/unreadChatNumber");
    set({ unreadChatIds: res.data, number: res.data.length });
  },
  increase:  (chatId) => {
    const { unreadChatIds } = getState(); // 현재 상태에서 unreadChatIds 가져오기

    //이미 리스트에 없으면 추가한다.
    if(!unreadChatIds.includes(chatId)) {
      set((prev) => (
          {
            unreadChatIds: [...prev.unreadChatIds, chatId],
            number: prev.number + 1,
          }));
    }
  },
  decrease: (chatId) => {
    const { unreadChatIds } = getState(); // 현재 상태에서 unreadChatIds 가져오기

    if(unreadChatIds.includes(chatId)) {
      set((prev) => (
          {
            unreadChatIds: prev?.unreadChatIds?.filter((id) => id !== chatId),
            number: prev.number > 0 ? prev.number - 1 : 0
          }));
    }
  },
  reset: () => {
    set({ number: 0 });
  },
}));
