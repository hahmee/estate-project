import { createContext, useEffect, useState } from "react";

export const UserProgressContext = createContext();

export const UserProgressContextProvider = ({ children }) => {

    const [userProgress, setUserProgress] = useState('');

    const goToAddPage = () => {
        setUserProgress('add');
    }

    const clearProgress = () => {
        setUserProgress('');
    }

    const userProgressCtx = {
        progress: userProgress,
        goToAddPage,
        clearProgress
    }

    console.log('userProgressCtx', userProgressCtx);
    return (
        <UserProgressContext.Provider value={userProgressCtx}>
            {children}
        </UserProgressContext.Provider>
    );
};
