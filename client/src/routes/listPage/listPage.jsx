import "./listPage.scss";
import Filter from "../../components/filter/Filter";
import Card from "../../components/card/Card";
import Map from "../../components/map/Map";
import {Await, useLoaderData, useSearchParams} from "react-router-dom";
import {Suspense, useEffect, useRef, useState} from "react";
import apiRequest from "../../lib/apiRequest.js";
import {savedPostStore} from "../../lib/savedPostStore.js";
import * as searchParams from "leaflet/src/dom/DomUtil.js";


function ListPage() {
  const data = useLoaderData();
  const [searchParams, setSearchParams] = useSearchParams();
  const query = {
      type: searchParams.get("type") || "",
      city: searchParams.get("city") || "",
      property: searchParams.get("property") || "",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      bedroom: searchParams.get("bedroom") || "",
  }


  const savedPosts = savedPostStore((state) => state.savedPosts);

  const callback = async () => {
    console.log('callback');
  }

  useEffect(() => {
    const getPostList = async() => {
      await setSearchParams(query);
    }

    getPostList();

  }, [savedPosts]);

  return (
    <div className="listPage">
      <div className="listContainer">
        <div className="wrapper">
          <Filter />
          <Suspense fallback={<p>Loading...</p>}>
            <Await
              resolve={data.postResponse}
                errorElement={<p>Error loading posts!</p>}
            >
              {(postResponse) =>
                postResponse.data.map((post) => (
                  <Card key={post.id} card={post} callback={callback}/>
                ))
              }
            </Await>
          </Suspense>
        </div>
      </div>
      <div className="mapContainer">
        <Suspense fallback={<p>Loading...</p>}>
          <Await
            resolve={data.postResponse}
            errorElement={<p>Error loading posts!</p>}
          >
            {(postResponse) => <Map items={postResponse.data} />}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export default ListPage;
