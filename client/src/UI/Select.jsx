import React from 'react';

const Select = ({label, id,children, ...props}) => {
    return (
        <div className="selectDiv">
            <label htmlFor={id}>{label}</label>
            <select id={id} name={id} {...props}>{children}</select>
        </div>
    );
}

export default Select;