import React from 'react';
import SearchMapBar from "../../components/searchBar/SearchMapBar.jsx";
import SearchMapBar2 from "../../components/searchBar/SearchMapBar2.jsx";
import "./newLocation.scss";

function NewLocationPage() {
    return (
        <div className="locationPage">
            <div><h1>위치는 어디인가요?</h1></div>
            <SearchMapBar2/>
        </div>
    );
}

export default NewLocationPage;