import React from 'react';

const Textarea = ({label, id, ...props}) => {
    return (
        <div className="control">
            <label htmlFor={id}>{label}</label>
            <textarea id={id} name={id} {...props} />
        </div>
    );
}

export default Textarea;