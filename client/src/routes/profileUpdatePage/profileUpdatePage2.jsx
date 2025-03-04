import React, {useCallback, useContext, useEffect, useState} from "react";
import "./profileUpdatePage.scss";
import { AuthContext } from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import { useNavigate } from "react-router-dom";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import Input from "../../UI/Input.jsx";
import DropZone from "../../components/dropZone/DropZone.jsx";
import Button from "../../UI/Button.jsx";
import axios from "axios";
import {cloudinaryUrl} from "../newPostPage/newPostPage.jsx";

function ProfileUpdatePage2() {
  const { currentUser, updateUser } = useContext(AuthContext);
  const [error, setError] = useState("");
  // const [avatar, setAvatar] = useState([]);

  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [otherData, setOtherData] = useState({});
  const [post, setPost] = useState(false);
  const [isImgChanged, setIsImgChanged] = useState(false);

  const imageUpload = useCallback(async () => {
    if (files.length > 0) {
      setIsImgChanged(true);
      const formData = new FormData();
      const config = {
        header: {
          'content-Type': 'multipart/form-data',
        }
      }
      formData.append('file', files[0]);
      formData.append('upload_preset', 'estate');

      //이게 늦게 응답 옴
      const res = await axios.post(cloudinaryUrl, formData, config);
      setImageUrl(res.data.secure_url);

    }

  },[files, imageUrl,isImgChanged]);

  const handleSubmit =  useCallback(async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const {username, email, password} = Object.fromEntries(formData);
    setOtherData({username, email, password});
    setPost(true);

    try {

      await imageUpload();
      //빈 값으로 나옴 -> 당연 -> 큐에 넣어서 한 번에 렌더링시킴

    } catch (err) {
      console.log(err);
      setError(err.response.data.message);
    }
  },[files, updateUser, currentUser, imageUrl]);

  useEffect(() => {

    const dataPost = async () => {
      const putRes = await apiRequest.put(`/users/${currentUser.id}`, {
        username: otherData.username,
        email:otherData.email,
        password:otherData.password,
        ...(imageUrl && {avatar: imageUrl})
      });

      updateUser(putRes.data);
      setPost(false);
      setIsImgChanged(false);
      navigate("/profile");
    }


    //이미지 변경했을 때 isImgChanged, imageUrl 받아올때까지 대기
    if(post && isImgChanged && imageUrl) { //imageUrl 값이 있어야 put 하도록
      dataPost();
    }
    //이미지 변경 안 했을 때
    if(post && !isImgChanged ) {
      dataPost();
    }


  }, [imageUrl, post, isImgChanged]);

  return (
      <div className="profileUpdatePage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h2>프로필 수정</h2>
            <div className="item">
              <Input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={currentUser.username}
                  label="사용자 이름"
              />
            </div>
            <div className="item">
              <Input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                  label="이메일"
              />
            </div>

            <div className="item">
              <p>프로필 이미지</p>
              <img src={files[0]?.preview || currentUser.avatar || "/noavatar.jpg"} alt="avatar" className="avatar"/>

              <DropZone files={files} setFiles={setFiles}/>

            </div>
            <div className="item">
              <Input id="password" name="password" type="password" label="비밀번호"/>
            </div>
            <div className="submit">

              <Button>저장</Button>
              {error && <span>error</span>}
            </div>
          </form>
        </div>

      </div>
  );
}

export default ProfileUpdatePage2;
