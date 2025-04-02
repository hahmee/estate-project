import React, {useEffect, useRef} from "react";

function Dropdown({children, shown, close}) { //scrollTop

    const wrapperRef = useRef(null);

    const handleClickOutside = event => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target)) { //wrapperRef 말고 외부를 클릭했다면
            close();
        }
    };

    useEffect(() => {

        if(shown) {
            document.addEventListener("click", handleClickOutside, true);
            return () => {
                document.removeEventListener("click", handleClickOutside, true);
            };
        }

    }, [shown]);

    return shown ? (
        <div ref={wrapperRef}>
            {children}
        </div>
    ) : null;
}


export default Dropdown;