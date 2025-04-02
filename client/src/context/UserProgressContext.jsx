import {createContext, useMemo, useState} from "react";

export const UserProgressContext = createContext();

const initialState = {
    text: '',
    url: '',
    form: '',
    loading: false,
    disabled: true,
};

const initialLocation = {
    lat: null,
    lng: null,
    politicalList: [],
    address: '',
};

export const UserProgressContextProvider = ({ children }) => {

    const [userProgress, setUserProgress] = useState(initialState);
    const [location, setLocation] = useState(initialLocation);
    const [text, setText] = useState(initialState);

    const setProgress = (action, data = null) => {
        if (action === 'add') {
            setUserProgress((prev) => ({
                ...prev, // 기존 상태 복사
                text: '다음',
                url: '/add',
                form: '',
                loading: false,
            }));
        } else if (action === 'save') {
            setUserProgress((prev) => ({
                ...prev, // 기존 상태 복사
                text: '저장',
                url: '',
                form: 'estate-post-form',
                loading: false,
            }));
        } else if (action === 'profile') {
            setUserProgress((prev)=>({
                ...prev,
                text: '프로필 저장', url: '', form: 'estate-profile-form', loading: false, disabled: false,
            }) );
        } else {
            setUserProgress(data);
        }
    };

    const clearProgress = () => {
        setUserProgress(initialState);
    }

    const saveLocation = (data) => {
        setLocation(data);
    }

    const clearLocation = () => {
        setUserProgress(initialLocation);
    }

    const changeDisabled = (value) => {
        setUserProgress((prev) => {
            const newState = {
                ...prev,
                disabled: value,
            };
            return newState;
        });
    };

    const changeText = (value) => {
        setText((prev) => {
            const newState = {
                ...prev,
                disabled: value,
            };
            return newState;
        });
    };


    const userProgressCtx = useMemo(() => ({
        progress: userProgress,
        setProgress,
        clearProgress,
        location,
        saveLocation,
        clearLocation,
        changeDisabled,
        text,
        changeText
    }), [userProgress, location]);

    return (
        <UserProgressContext.Provider value={userProgressCtx}>
            {children}
        </UserProgressContext.Provider>
    );
};
