import React from 'react';

const Button = ({ children, textOnly, className, outlined, ...props}) => {

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
        <button className={sCss} {...props}>{children}</button>
    );
}

export default Button;