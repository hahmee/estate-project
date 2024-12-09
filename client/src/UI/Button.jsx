import React from 'react';
import { BeatLoader } from "react-spinners";

const Button = ({children, textOnly, icon, round, className, outlined, chatButton, loading, ...props}) => {

    let sCss = '';

    if (outlined) {
        sCss = 'outlined-button';
    } else if (textOnly) {
        sCss = 'text-button';
    } else if (round) {
        sCss = 'round-button';
    } else if (icon) {
        sCss = 'icon-button';
    } else if (chatButton) {
        sCss = 'chat-button';
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
};

export default Button;