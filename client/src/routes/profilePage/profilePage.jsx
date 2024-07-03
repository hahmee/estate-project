import Chat from "../../components/chat/Chat";
import List from "../../components/list/List";
import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import {Await, defer, Link, useLoaderData, useNavigate, useRevalidator, useSearchParams} from "react-router-dom";
import {Suspense, useContext, useEffect, useState} from "react";
import { AuthContext } from "../../context/AuthContext";
import {savedPostStore} from "../../lib/savedPostStore.js";
import Button from "../../UI/Button.jsx";
import { googleLogout } from '@react-oauth/google';

function ProfilePage() {
  const data = useLoaderData();

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const savedPosts = savedPostStore((state) => state.savedPosts);

  const [searchParams, setSearchParams] = useSearchParams();

  const query = {
    type: searchParams.get("type") || "",
    city: searchParams.get("city") || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  }

  const handleLogout = async () => {
    try {
      await apiRequest.post("/auth/logout");
      updateUser(null);

      if(currentUser.externalType == 'google') {
        googleLogout();
      }

      navigate("/");
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const getPostList = () => {
      setSearchParams(query);
    }
    getPostList();

  }, [savedPosts]);

  return (
      <div className="profilePage">
        <div className="details">
          <div className="wrapper">
            <div className="title">
              <h1>사용자 정보</h1>
              <div className="buttonList">
                <Button outlined onClick={() => navigate("/profile/update")}>프로필 수정</Button>
                <Button outlined onClick={handleLogout}>로그아웃</Button>
              </div>
            </div>
            <div className="info">
              <div className="info-top">
                <p>프로필</p>
              </div>
              <div className="info-bottom">
                <img src={currentUser.avatar || "noavatar.jpg"} alt="avatar"/>
              </div>
              <div className="info-top">
                <p>사용자이름</p>
              </div>
              <div className="info-bottom">
                {currentUser.username}
              </div>
              <div className="info-top">
                <p>사용자 이메일</p>
              </div>
              <div className="info-bottom">
                {currentUser.email}
              </div>
            </div>
            <div className="title">
              <h1>나의 리스트</h1>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
              >
                {(postResponse) => <List posts={postResponse.data.userPosts}/>}
              </Await>
            </Suspense>
            <div className="title">
              <h1>저장 리스트</h1>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                  resolve={data.postResponse}
                  errorElement={<p>Error loading posts!</p>}
              >
                {(postResponse) => <List posts={postResponse.data.savedPosts} savedList={true}/>}
              </Await>
            </Suspense>
          </div>
        </div>
        <div className="chatContainer">
          <div className="wrapper">
            <div className="title">
              <h1>메시지</h1>
            </div>
            <Suspense fallback={<p>Loading...</p>}>
              <Await
                  resolve={data.chatResponse}
                  errorElement={<p>Error loading chats!</p>}
              >
                {(chatResponse) => <Chat chats={chatResponse.data}/>}
              </Await>
            </Suspense>
          </div>
        </div>
      </div>
  );
}

export default ProfilePage;
