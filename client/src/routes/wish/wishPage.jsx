import "./wishPage.scss";
import {Suspense} from "react";
import {Await, useLoaderData} from "react-router-dom";
import List from "../../components/list/List.jsx";

function WishPage() {

  const data = useLoaderData();

  return <div className="wish-container">
    <div className="wish-container__title">
      <h1>나의 리스트</h1>
    </div>
    <Suspense fallback={<p>Loading...</p>}>
      <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
        {(postResponse) => <List posts={postResponse.data.userPosts}/>}
      </Await>
    </Suspense>
    <div className="wish-container__title">
      <h1>위시 리스트</h1>
    </div>
    <Suspense fallback={<p>Loading...</p>}>
      <Await
          resolve={data.postResponse}
          errorElement={<p>Error loading posts!</p>}
      >
        {(postResponse) => <List posts={postResponse.data.savedPosts} savedList={true}/>}
      </Await>
    </Suspense>
  </div>;
}

export default WishPage;

