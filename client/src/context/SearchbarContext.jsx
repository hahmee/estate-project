import { createContext, useState } from "react";
import {roomOption, typeOption} from "../routes/newPostPage/newPostPage.jsx";
import {MAX_PRICE, MAX_SIZE, MIN_PRICE, MIN_SIZE} from "../components/navbar/Navbar.jsx";
import {useSearchParams} from "react-router-dom";

export const SearchbarContext = createContext();

//searchbar 값 보여주는 용도
const initialState = {
    location: '',
    payType: typeOption.map((type) => type.value),
    propertyType: roomOption.map((type) => type.value),
    minPrice: MIN_PRICE,
    maxPrice: MAX_PRICE,
    minSize: MIN_SIZE,
    maxSize: MAX_SIZE,
};

export const SearchbarContextProvider = ({ children }) => {

    // const [searchParams, setSearchParams] = useSearchParams();

    // const query = {
    //     type: searchParams.getAll("type") || typeOption.map((type) => type.value),
    //     location: searchParams.get("location") || "",
    //     latitude: searchParams.get("latitude") || "",
    //     longitude: searchParams.get("longitude") || "",
    //     property: searchParams.getAll("property") || roomOption.map((type) => type.value),
    //     minPrice: searchParams.get("minPrice") || MIN_PRICE,
    //     maxPrice: searchParams.get("maxPrice") || MAX_PRICE,
    //     minSize: searchParams.get("minSize") || MIN_SIZE,
    //     maxSize: searchParams.get("maxSize") || MAX_SIZE,
    // };
    //
    // const initialState = {
    //     location: query.location,
    //     payType: query.type,
    //     propertyType: query.property,
    //     minPrice: query.minPrice,
    //     maxPrice:query.maxPrice,
    //     minSize:query.minSize,
    //     maxSize: query.maxSize,
    // };

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
