import React, {useCallback, useState} from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import SearchMapBar2 from "../searchBar/SearchMapBar2.jsx";

function Filter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    // city: searchParams.get("city") || "",
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
    console.log('e.target.name', e.target.name);
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const handleFilter = () => {
    setSearchParams(query);
  };

  const getMapResult = useCallback((itemList) => {
    console.log('itemListdd', itemList);
    setItemList(itemList);
    setQuery({
      ...query,
      // location: itemList[0].placeId
      latitude: itemList[0].latitude,
      longitude: itemList[0].longitude,
    });
  }, [itemList]);

  return (
    <div className="filter">
      <h1>
        <b>{searchParams.get("location")}</b>에 대한 검색결과
      </h1>
      <div className="">
        <div className="">
          <SearchMapBar2 getMapResult={getMapResult} searchOptions={['geocode']}/>
          {/*<label htmlFor="city">Location</label>*/}
          {/*<input*/}
          {/*  type="text"*/}
          {/*  id="city"*/}
          {/*  name="city"*/}
          {/*  placeholder="City Location"*/}
          {/*  onChange={handleChange}*/}
          {/*  defaultValue={query.city}*/}
          {/*/>*/}
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="search" />
        </button>
      </div>
    </div>
  );
}

export default Filter;
