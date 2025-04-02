import React, {useCallback, useContext, useEffect, useState} from 'react';
import SearchMapBar from "../../components/searchBar/SearchMapBar.jsx";
import "./newLocation.scss";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import MapSingle from "../../components/map/MapSingle.jsx";

function NewLocationPage() {

    const [itemList, setItemList] = useState([]);
    const {setProgress} = useContext(UserProgressContext);

    const getMapResult = useCallback((itemList) => {
        setItemList(itemList);
        setProgress('add');
    }, [itemList]);

    useEffect(() => {
        setProgress('add');
    }, []);

    return (
        <div className="locationPage">
            <div className="locationText">위치는 어디인가요?</div>
            <div className="locationSmallText">정확한 위치를 입력해주세요.</div>
            <div>
                <SearchMapBar getMapResult={getMapResult}/>
                <div className="mapContainer">
                    <MapSingle items={itemList}/>
                </div>
            </div>

        </div>
    );
}

export default NewLocationPage;