import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {useContext, useState} from "react";
import apiRequest from "../../lib/apiRequest";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import {GoogleLogin} from "@react-oauth/google";
import {jwtDecode} from "jwt-decode";
import {AuthContext} from "../../context/AuthContext.jsx";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const {updateUser} = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });

      navigate("/login");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoginGoogle = async (email, username, avatar, externalId) => {
    setError("");
    setIsLoading(true);
    try {
      await apiRequest.post("/auth/register", {
        username: username,
        email:email,
        avatar: avatar,
        externalType: 'google',
        externalId: externalId
      });

      const res = await apiRequest.post("/auth/login", {
        username: username,
        externalType: 'google',
        externalId: externalId,
      });

      updateUser(res.data);
      navigate("/");

    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  }
  return (
      <div className="registerPage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h2>회원가입</h2>
            <Input name="username" type="text" label="사용자 이름"/>
            <Input name="email" type="email" label="이메일"/>
            <Input name="password" type="password" label="비밀번호"/>


            <div className="lineDiv">
              <div className="line"></div>
              <p className="or">or</p>
              <div className="line"></div>
            </div>

            <div>
            <GoogleLogin
                className="googleLogin"
                onSuccess={credentialResponse => {
                  const credentialData = jwtDecode(credentialResponse.credential);
                  const email = credentialData.email;
                  const name = credentialData.name;
                  const avatar = credentialData.picture;
                  const externalId = credentialData.sub;
                  handleLoginGoogle(email, name,avatar,externalId);
                }}
                onError={() => {
                  console.log('구글 로그인 실패했습니다.');
                }}
            />
            </div>

            <Button disabled={isLoading} type='submit'>등록</Button>
            {error && <span>{error}</span>}
            <Link to="/login">계정이 있으십니까?</Link>


          </form>
        </div>
      </div>
  );
}

export default Register;
