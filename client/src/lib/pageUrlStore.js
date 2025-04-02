import {create} from "zustand";
import {persist} from "zustand/middleware";

// 현재 url과 이전 url을 저장하는 장소
export const usePageUrlStore = create(
    //persist: 기본적으로 local storage 에 저장됨
    //새로고침 한 후에도 값 사용하도록 하려면 persist
    persist(
        (set, get) => ({
            currentUrl: '',
            previousUrl:'',
            setCurrentUrl: (crtUrl) => set({currentUrl: crtUrl}),
            setPrvUrl: (prvUrl) => set({previousUrl: prvUrl}),
        }),
        {
            name: 'url-storage', // unique name
           // storage: createJSONStorage(() => hashStorage),// (optional)이기 때문에 해당 줄을 적지 않으면 'localStorage'가 기본 저장소로 사용된다.
        },
    ),
)
