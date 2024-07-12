import React, {useCallback, useState} from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import SearchMapBar2 from "../searchBar/SearchMapBar2.jsx";
import Selection from "../../UI/Selection.jsx";
import {roomOption, typeOption} from "../../routes/newPostPage/newPostPage.jsx";
import Input from "../../UI/Input.jsx";
import {listPostStore} from "../../lib/listPostStore.js";
import {singlePostData as item} from "../../lib/dummydata.js";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const fetch = listPostStore((state) => state.fetch);
  const posts = listPostStore((state) => state.posts);
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    // location: searchParams.get("placeId") || "",
    latitude: searchParams.get("latitude") || "",
    longitude: searchParams.get("longitude") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });

  const [itemList, setItemList] = useState([]);

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const getMapResult = useCallback(async (itemList) => {
    console.log('itemList', itemList);

  }, [itemList]);

  return (
      <div className="filter">

        <div className="">
          <div className="">
            <SearchMapBar2 getMapResult={getMapResult} searchOptions={['geocode']}/>
          </div>
        </div>
        <div className="bottom">
          <div>
            <h1>
              <b> </b>에 대한 검색결과
            </h1>
          </div>
          <div className="item">

            <Selection
                name="type"
                id="type"
                onChange={handleChange}
                defaultValue={query.type}
                label="거래유형"
                options={typeOption}
            />

          </div>
          <div className="item">
            <Selection
                name="property"
                id="property"
                onChange={handleChange}
                defaultValue={query.property}
                label="방 종류"
                options={roomOption}

            >
            </Selection>
          </div>
          <div className="item">
            <Input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="any"
                onChange={handleChange}
                defaultValue={query.minPrice}
                label="최소금액"
            />
          </div>
          <div className="item">
            <Input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="any"
                onChange={handleChange}
                defaultValue={query.maxPrice}
                label="최대금액"
            />
          </div>
          <div className="item">
            <Input
                type="text"
                id="bedroom"
                name="bedroom"
                placeholder="any"
                onChange={handleChange}
                defaultValue={query.bedroom}
                label="방 수"
            />
          </div>
          {/*<button onClick={handleFilter}>*/}
          {/*  <img src="/search.png" alt="search"/>*/}
          {/*</button>*/}
        </div>
      </div>
  );
}

export default Filter;
