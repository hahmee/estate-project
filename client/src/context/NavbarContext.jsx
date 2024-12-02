import { createContext, useState } from "react";

export const NavbarContext = createContext();

export const NavbarContextProvider = ({ children }) => {

    const [scrollTop, setScrollTop] = useState(false);
    const [fixedNavbar, setFixedNavbar] = useState(false); //listPage에서 상단에 고정 용도
    const [outsideClick, setOutsideClick] = useState(false); //listPage에서 상단에 고정 용도
    const [isDropdown, setIsDropdown] = useState(false); // 드롭다운 보이기 여부

    const changeScrollTop = (scrolltop) => {
        setScrollTop(scrolltop);
    };

    const changeFixedNavbar = (value) => {
        setFixedNavbar(value);
    };

    const changeOutsideClick = (value) => {
        setOutsideClick(value);
    };

    const changeIsDropDown = (value) => {
        setIsDropdown(value);
    };

    const navbarCtx = {
        scrollTop,
        changeScrollTop,
        fixedNavbar,
        changeFixedNavbar,
        outsideClick,
        changeOutsideClick,
        isDropdown,
        changeIsDropDown,
    }

    return (
        <NavbarContext.Provider value={navbarCtx}>
            {children}
        </NavbarContext.Provider>
    );
};
