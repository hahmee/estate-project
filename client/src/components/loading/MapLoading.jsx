import React from 'react';
import './mapLoading.scss';
import { PulseLoader } from "react-spinners";

function MapLoading(props) {
    return (
        <div className="mapLoader"><PulseLoader size={7}/></div>
    );
}

export default MapLoading;