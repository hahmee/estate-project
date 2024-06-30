import { createContext, useEffect, useState } from "react";
import {singlePostData as currentUser} from "../lib/dummydata.js";

export const UserProgressContext = createContext();

const initialState = {
    text:'다음',
    url:''
}

const initialLocation = {
    latitude: null,
    longitude: null,
    city: '' ,
    address: '',
}

export const UserProgressContextProvider = ({ children }) => {

    const [userProgress, setUserProgress] = useState(initialState);
    const [location, setLocation] = useState(initialLocation);

    const goToAddPage = () => {
        setUserProgress({text: '다음', url: '/add'});
    }

    const clearProgress = () => {
        setUserProgress(initialState);
    }

    const clearSaveProgress = () => {
        setUserProgress({text:'저장', url:''});
    }

    const saveLocation = (data) => {
        setLocation(data);
    }

    const clearLocation = () => {
        setUserProgress(initialLocation);
    }

    const userProgressCtx = {
        progress: userProgress,
        goToAddPage,
        clearProgress,
        clearSaveProgress,
        location,
        saveLocation,
        clearLocation
    }

    // console.log('userProgressCtx', userProgressCtx);
    return (
        <UserProgressContext.Provider value={userProgressCtx}>
            {children}
        </UserProgressContext.Provider>
    );
};
