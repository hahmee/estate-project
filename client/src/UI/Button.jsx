import React from 'react';
import { SyncLoader } from "react-spinners";

const Button = ({ children, textOnly, className, outlined, loading, ...props}) => {

    let sCss = '';

    if (outlined) {
        sCss = 'outlined-button';
    }else if (textOnly) {
        sCss = 'text-button';
    } else {
        sCss = 'button';
    }

    sCss += ' ' + className;

    return (
        <button className={sCss} {...props}>
            {
                !loading ? children : <SyncLoader/>
            }
        </button>
    );
}

export default Button;