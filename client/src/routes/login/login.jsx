import { useContext, useState } from "react";
import "./login.scss";
import { Link, useNavigate } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { AuthContext } from "../../context/AuthContext";
import Input from "../../UI/Input.jsx";
import Button from "../../UI/Button.jsx";

function Login() {
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const {updateUser} = useContext(AuthContext);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    const formData = new FormData(e.target);

    const username = formData.get("username");
    const password = formData.get("password");

    try {
      const res = await apiRequest.post("/auth/login", {
        username,
        password,
      });

      updateUser(res.data);

      navigate("/");
    } catch (err) {
      setError(err.response.data.message);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="login">
      <div className="formContainer">
        <form onSubmit={handleSubmit}>
          <h2>로그인</h2>
          <Input
            name="username"
            required
            minLength={3}
            maxLength={20}
            type="text"
            label="사용자 이름"
          />
          <Input
            name="password"
            type="password"
            required
            label="비밀번호"
          />
          <Button disabled={isLoading}>로그인</Button>
          {error && <span>{error}</span>}
          <Link to="/register">계정이 없으신가요?</Link>
        </form>
      </div>
    </div>
  );
}

export default Login;
