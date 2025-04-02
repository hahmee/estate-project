import "./profilePage.scss";
import apiRequest from "../../lib/apiRequest";
import {useNavigate, useSearchParams} from "react-router-dom";
import {useContext, useEffect} from "react";
import {AuthContext} from "../../context/AuthContext";
import {savedPostStore} from "../../lib/savedPostStore.js";
import Button from "../../UI/Button.jsx";
import {googleLogout} from '@react-oauth/google';
import {toast} from "react-toastify";

function ProfilePage() {

  const { updateUser, currentUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const currentSavedPost = savedPostStore((state) => state.currentSavedPost);

  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {

    setSearchParams();

  }, [currentSavedPost]);


  return (
      <div className="profilePage">
        <div className="details">
          <div className="wrapper">
            <div className="title">
              <h1>사용자 정보</h1>
              <div className="buttonList">
                <Button outlined onClick={() => navigate("/profile/update")}>프로필 수정</Button>
              </div>
            </div>
            <div className="info">
              <div className="info-top">
                <p>프로필</p>
              </div>
              <div className="info-bottom">
                <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar"/>
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

          </div>
        </div>

      </div>
  );
}

export default ProfilePage;
