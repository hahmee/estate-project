import React from 'react';
import Select from "react-select";

const Selection = ({label, options,  id, ...props}) => {
    return (
        <div className="selectDiv">
            <label htmlFor={id}>{label}</label>
            <Select
                id={id}
                options={options}
                className="basic-multi-select"
                classNamePrefix="select"
                placeholder=""
                {...props}
            />
        </div>
    );
}

export default Selection;