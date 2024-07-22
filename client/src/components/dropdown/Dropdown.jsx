import React, {useContext, useEffect, useRef} from "react";
import {NavbarContext} from "../../context/NavbarContext.jsx";

function Dropdown({children, shown, close, scrollTop}) {

    const wrapperRef = useRef(null);

    const {changeOutsideClick, fixedNavbar} = useContext(NavbarContext);


    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) { //wrapperRef 말고 외부를 클릭했다면
            close();
            changeOutsideClick(true); //드롭다운 밖을 클릭하면 navbar가 위로 꽂힘
        }
    };
    //
    useEffect(() => {
        if (!scrollTop && fixedNavbar) { //scrollTop이 아니고 고정이라면
            console.log('zs, fixedNavbar', fixedNavbar);
            console.log('zs, scrollTop', scrollTop);

            close(); //dropDown 닫는다
            // changeFixedNavbar(true);
        }
    }, [scrollTop, fixedNavbar]);

    useEffect(() => {
        document.addEventListener("click", handleClickOutside, true);
        return () => {
            document.removeEventListener("click", handleClickOutside, true);
        };
    }, []);

    return shown ? (
        <div ref={wrapperRef}>
            {children}
        </div>
    ) : null;
}


export default Dropdown;