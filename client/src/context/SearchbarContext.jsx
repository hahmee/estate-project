import { createContext, useState } from "react";
import {roomOption, typeOption} from "../routes/newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../components/navbar/Navbar.jsx";

export const SearchbarContext = createContext();

const initialState = {
    location: '',
    payType: typeOption.map((type) => type.value),
    propertyType: roomOption.map((type) => type.value),
    minPrice: MIN_PRICE,
    maxPrice:MAX_PRICE,
    minSize:MIN_SIZE,
    maxSize:MAX_SIZE,
};


export const SearchbarContextProvider = ({ children }) => {

    const [searchValue, setSearchValue] = useState(initialState);

    const changeSearchValue = (value) => {
        setSearchValue(value);
    }

    const clearSearchValue = () => {
        setSearchValue(initialState);
    }


    const searchbarCtx = {
        searchValue,
        changeSearchValue,
        clearSearchValue
    }

    return (
        <SearchbarContext.Provider value={searchbarCtx}>
            {children}
        </SearchbarContext.Provider>
    );
};
