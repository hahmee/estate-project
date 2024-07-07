import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import GoogleLoginButton from "../../components/googleLoginBtn/GoogleLoginButton.jsx";
import {toast} from "react-toastify";

function Login() {
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);

  const navigate = useNavigate();


  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        email,
        password,
      });

      updateUser(res.data);
      toast.success('로그인 되었습니다.');
      navigate("/");
    } catch (err) {
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
     <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h2>로그인</h2>
          <GoogleLoginButton/>

          <div className="lineDiv">
            <div className="line"></div>
            <p className="or">or</p>
            <div className="line"></div>
          </div>

          <Input
              name="email"
              required
              type="email"
              label="이메일"
          />
          <Input
              name="password"
              type="password"
              required
              label="비밀번호"
          />

          <Button loading={isLoading}>로그인</Button>
          <Link to="/register">계정이 없으신가요?</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
