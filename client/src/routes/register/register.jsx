import "./register.scss";
import {Link, useNavigate} from "react-router-dom";
import {useState} from "react";
import apiRequest from "../../lib/apiRequest";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";
import GoogleLoginButton from "../../components/googleLoginBtn/GoogleLoginButton.jsx";
import {toast} from "react-toastify";
import NaverLoginButton from "../../components/naverLoginBtn/NaverLoginButton.jsx";

function Register() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");

    try {
      await apiRequest.post("/auth/register", {
        username,
        email,
        password,
      });
      toast.success('회원가입 되었습니다.');
      navigate("/login");
    } catch (err) {
      console.log('err', err);
      toast.error(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };


  return (
      <div className="registerPage">
        <div className="formContainer">
          <form onSubmit={handleSubmit}>
            <h2>회원가입</h2>

            <GoogleLoginButton/>
            <NaverLoginButton/>

            <div className="lineDiv">
              <div className="line"></div>
              <p className="or">or</p>
              <div className="line"></div>
            </div>



            <Input name="username" type="text" label="사용자 이름"  maxLength="10" minLength="3" />
            <Input name="email" type="email" label="이메일"/>
            <Input name="password" type="password" label="비밀번호"/>


            <Button type='submit' loading={isLoading}>등록</Button>
            <Link to="/login">계정이 있으십니까?</Link>


          </form>
        </div>
      </div>
  );
}

export default Register;
