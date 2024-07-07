import React from 'react';
import { BeatLoader } from "react-spinners";

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
                !loading ? children : <BeatLoader color='white'/>
            }
        </button>
    );
}

export default Button;