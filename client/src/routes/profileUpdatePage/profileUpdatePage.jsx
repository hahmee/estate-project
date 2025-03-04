import React, {useCallback, useContext, useEffect, useState} from "react";
import "./profileUpdatePage.scss";
import {AuthContext} from "../../context/AuthContext";
import apiRequest from "../../lib/apiRequest";
import {useNavigate} from "react-router-dom";
import Input from "../../UI/Input.jsx";
import DropZone from "../../components/dropZone/DropZone.jsx";
import axios from "axios";
import {CLOUDINARY_URL} from "../newPostPage/newPostPage.jsx";
import {UserProgressContext} from "../../context/UserProgressContext.jsx";
import {toast} from "react-toastify";

function ProfileUpdatePage() {
  const { currentUser, updateUser } = useContext(AuthContext);

  const navigate = useNavigate();
  const [files, setFiles] = useState([]);
  const {progress, setProgress} = useContext(UserProgressContext);



  const handleSubmit =  useCallback(async (e) => {
    e.preventDefault();
    setProgress('',{...progress, loading: true});
    const formData = new FormData(e.target);

    let imageUrl = "";

    const {username, email, password} = Object.fromEntries(formData);

    try {

      // await imageUpload();
      if (files.length > 0) {
        const formData = new FormData();
        const config = {
          header: {
            'content-Type': 'multipart/form-data',
          }
        }
        formData.append('file', files[0]);
        formData.append('upload_preset', 'estate');


        //이게 늦게 응답 옴
        const res = await axios.post(CLOUDINARY_URL, formData, config);

        imageUrl = res.data.secure_url;
        // setImageUrl(res.data.secure_url); //useState으로 하면 빈 값으로 나옴
      }

      const putRes = await apiRequest.put(`/users/${currentUser.id}`, {
        username,
        email,
        password,
        ...(imageUrl && {avatar: imageUrl})
      });

      updateUser(putRes.data);
      toast.success('성공적으로 수정되었습니다.');
      navigate("/profile");

    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setProgress('', {...progress, loading: false});
    }
  },[files, updateUser, currentUser]);

  useEffect(() => {
    setProgress('profile');
  }, []);

  return (
      <div className="profileUpdatePage">
        <div className="formContainer">
          <form onSubmit={handleSubmit} id="estate-profile-form">
            <h2>프로필 수정</h2>
            <div className="item">
              <Input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={currentUser.username}
                  label="사용자 이름"
                  maxLength="10"
                  minLength="3"
              />
            </div>
            <div className="item">
              <Input
                  disabled
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={currentUser.email}
                  label="이메일"
              />
            </div>

            <div className="item">
              <p>프로필 이미지</p>
              <div className="avatarDiv">
                <img src={files[0]?.preview || currentUser.avatar || "/noavatar.jpg"} alt="avatar" className="avatar"/>
                <DropZone files={files} setFiles={setFiles}/>
              </div>

            </div>
            <div className="item">
              <Input id="password" name="password" type="password" label="비밀번호"/>
            </div>
          </form>
        </div>

      </div>
  );
}

export default ProfileUpdatePage;
