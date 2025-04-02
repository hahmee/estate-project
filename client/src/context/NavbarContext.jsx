import {createContext, useState} from "react";

export const NavbarContext = createContext();

export const NavbarContextProvider = ({ children }) => {

    const [isExpanded, setIsExpanded] = useState(false); // 메뉴바 확장 여부
    const [idDropdownOpen, setIsDropdownOpen] = useState(false); // 드롭다운 오픈 여부

    const changeExpanded = (isExpanded) => {
        setIsExpanded(isExpanded);
    }

    const changeIsDropdownOpen = (isOpen) => {
        setIsDropdownOpen(isOpen);
    }

    const navbarCtx = {
        isExpanded: isExpanded,
        changeExpanded: changeExpanded,
        idDropdownOpen: idDropdownOpen,
        changeIsDropdownOpen: changeIsDropdownOpen,
    }

    return (
        <NavbarContext.Provider value={navbarCtx}>
            {children}
        </NavbarContext.Provider>
    );
};
