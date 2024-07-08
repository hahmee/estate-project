import { createContext, useState } from "react";

export const UserProgressContext = createContext();

const initialState = {
    text: '',
    url: '',
    form: '',
    loading: false,
    disabled: false,
};

const initialLocation = {
    latitude: null,
    longitude: null,
    city: '',
    address: '',
};

export const UserProgressContextProvider = ({ children }) => {

    const [userProgress, setUserProgress] = useState(initialState);
    const [location, setLocation] = useState(initialLocation);

    const setProgress = (action,data=null) => {
        if(action ==='add') {
            setUserProgress({text: '다음', url: '/add', form:'', loading: false, disabled: false});
        } else if (action ==='save') {
            setUserProgress({text:'저장', url:'', form: 'estate-post-form', loading: false, disabled: false});
        }else if(action ==='profile'){
            setUserProgress({text:'프로필 저장', url:'', form: 'estate-profile-form', loading: false, disabled: false});
        }else {
            setUserProgress(data);
        }
    }

    const clearProgress = () => {
        setUserProgress(initialState);
    }

    const saveLocation = (data) => {
        setLocation(data);
    }

    const clearLocation = () => {
        setUserProgress(initialLocation);
    }

    const userProgressCtx = {
        progress: userProgress,
        setProgress,
        clearProgress,
        location,
        saveLocation,
        clearLocation,
    }

    return (
        <UserProgressContext.Provider value={userProgressCtx}>
            {children}
        </UserProgressContext.Provider>
    );
};
