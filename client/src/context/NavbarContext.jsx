import { createContext, useState } from "react";

export const NavbarContext = createContext();

export const NavbarContextProvider = ({ children }) => {

    const [scrollTop, setScrollTop] = useState(false);
    const [fixedNavbar, setFixedNavbar] = useState(false); //listPage에서 상단에 고정 용도
    const [outsideClick, setOutsideClick] = useState(false); //listPage에서 상단에 고정 용도

    const changeScrollTop = (scrolltop) => {
        setScrollTop(scrolltop);
    };

    const changeFixedNavbar = (value) => {
        setFixedNavbar(value);
    };

    const changeOutsideClick = (value) => {
        setOutsideClick(value);
    };

    const navbarCtx = {
        scrollTop,
        changeScrollTop,
        fixedNavbar,
        changeFixedNavbar,
        outsideClick,
        changeOutsideClick,
    }

    return (
        <NavbarContext.Provider value={navbarCtx}>
            {children}
        </NavbarContext.Provider>
    );
};
