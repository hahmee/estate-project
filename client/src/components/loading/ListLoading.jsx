import React from 'react';
import './listLoad.scss';

function ListLoading(props) {
    return (
        <div className="loadingDiv">
            <div className="imgElement loading"/>
            <div className="textElement">
                <div className="loading"/>
                <div className="loading"/>
                <div className="loading"/>
                <div className="loading"/>
            </div>
        </div>
    );
}

export default ListLoading;