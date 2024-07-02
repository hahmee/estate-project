import "./register.scss";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import apiRequest from "../../lib/apiRequest";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";

function Register() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("")
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
  return (
    <div className="registerPage">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h2>회원가입</h2>
          <Input name="username" type="text" label="유저이름" />
          <Input name="email" type="email" label="이메일"  />
          <Input name="password" type="password"  label="비밀번호"  />
          <Button disabled={isLoading}>Register</Button>
          {error && <span>{error}</span>}
          <Link to="/login">계정이 있으십니까?</Link>
        </form>
      </div>
    </div>
  );
}

export default Register;
