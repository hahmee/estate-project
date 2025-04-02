import React from 'react';
import './listLoading.scss';

function ListLoading(props) {
    return (
        <>
            <div className="loadingDiv">
                <div className="imgElement loading"/>
                <div className="textElement">
                    <div className="loading"/>
                    <div className="loading"/>
                    <div className="loading"/>
                    <div className="loading"/>
                </div>
            </div>
            <div className="loadingDiv">
                <div className="imgElement loading"/>
                <div className="textElement">
                    <div className="loading"/>
                    <div className="loading"/>
                    <div className="loading"/>
                    <div className="loading"/>
                </div>
            </div>

        </>
    );
}

export default ListLoading;