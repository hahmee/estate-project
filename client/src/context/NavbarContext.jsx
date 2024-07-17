import { createContext, useState } from "react";

export const NavbarContext = createContext();

export const NavbarContextProvider = ({ children }) => {

    const [scrollTop, setScrollTop] = useState(false);
    const [fixedNavbar, setFixedNavbar] = useState(false);

    const changeScrollTop = (scrolltop) => {
        setScrollTop(scrolltop);
    };

    const changeFixedNavbar = (scrolltop) => {
        setFixedNavbar(scrolltop);
    };

    const navbarCtx = {
        scrollTop,
        changeScrollTop,
        fixedNavbar,
        changeFixedNavbar
    }

    return (
        <NavbarContext.Provider value={navbarCtx}>
            {children}
        </NavbarContext.Provider>
    );
};
