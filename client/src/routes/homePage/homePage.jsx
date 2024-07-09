import SearchBar from "../../components/searchBar/SearchBar";
import "./homePage.scss";
import SearchMapBar from "../../components/searchBar/SearchMapBar.jsx";
import SearchMapBar2 from "../../components/searchBar/SearchMapBar2.jsx";
import {useCallback, useState} from "react";
import {useSearchParams} from "react-router-dom";
import Filter from "../../components/filter/Filter.jsx";

function HomePage() {
  // const [itemList, setItemList] = useState([]);
  // const [searchParams, setSearchParams] = useSearchParams();
  // const [query, setQuery] = useState({
  //   type: searchParams.get("type") || "",
  //   // city: searchParams.get("city") || "",
  //   // location: searchParams.get("placeId") || "",
  //   latitude: searchParams.get("latitude") || "",
  //   longitude: searchParams.get("longitude") || "",
  //   property: searchParams.get("property") || "",
  //   minPrice: searchParams.get("minPrice") || "",
  //   maxPrice: searchParams.get("maxPrice") || "",
  //   bedroom: searchParams.get("bedroom") || "",
  // });
  //
  // const getMapResult = useCallback((itemList) => {
  //   console.log('itemListdd', itemList);
  //   setItemList(itemList);
  //
  // }, [itemList]);

  return (
    <div className="homePage">
      <div className="textContainer">
        <div className="wrapper">
          <h1 className="title">Estate Website</h1>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Eos
            explicabo suscipit cum eius, iure est nulla animi consequatur
            facilis id pariatur fugit quos laudantium temporibus dolor ea
            repellat provident impedit!
          </p>
          {/*<SearchMapBar2 getMapResult={getMapResult} searchOptions={['geocode']}/>*/}
          {/*<SearchBar/>*/}

          <Filter/>

          <div className="boxes">
            <div className="box">
              <h1>16+</h1>
              <h2>Years of Experience</h2>
            </div>
            <div className="box">
              <h1>200</h1>
              <h2>Award Gained</h2>
            </div>
            <div className="box">
              <h1>2000+</h1>
              <h2>Property Ready</h2>
            </div>
          </div>
        </div>
      </div>
      {/*<div className="imgContainer">*/}
      {/*  <img src="" alt="" />*/}
      {/*</div>*/}
    </div>
  );
}

export default HomePage;
