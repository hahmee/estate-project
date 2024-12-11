import "./wishPage.scss";
import {Suspense, useState} from "react";
import {Await, useLoaderData} from "react-router-dom";
import List from "../../components/list/List.jsx";

function WishPage() {

  const data = useLoaderData();
  // 활성화된 탭 상태 (myList 또는 wishList)
  const [activeTab, setActiveTab] = useState("myList");

  return <div className="wish-container">
    {/* 탭 메뉴 */}
    <div className="tabs">
      <button
          className={`tab ${activeTab === "myList" ? "active" : ""}`}
          onClick={() => setActiveTab("myList")}
      >
        나의 리스트
      </button>
      <button
          className={`tab ${activeTab === "wishList" ? "active" : ""}`}
          onClick={() => setActiveTab("wishList")}
      >
        위시 리스트
      </button>
    </div>
    {/* 선택된 탭에 따라 다른 내용 렌더링 */}
    {activeTab === "myList" && (
        <div className="wish-container__content">
          <div className="wish-container__title">
            <h1>나의 리스트</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) => <List posts={postResponse.data.userPosts} />}
            </Await>
          </Suspense>
        </div>
    )}

    {activeTab === "wishList" && (
        <div className="wish-container__content">
          <div className="wish-container__title">
            <h1>위시 리스트</h1>
          </div>
          <Suspense fallback={<p>Loading...</p>}>
            <Await resolve={data.postResponse} errorElement={<p>Error loading posts!</p>}>
              {(postResponse) => <List posts={postResponse.data.savedPosts} savedList={true} />}
            </Await>
          </Suspense>
        </div>
    )}

  </div>;
}

export default WishPage;

