import { useContext, useState } from "react";
import "./navbar.scss";
import {Link, useNavigate} from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { useNotificationStore } from "../../lib/notificationStore";
import Button from "../../UI/Button.jsx";

function Navbar() {
  const [open, setOpen] = useState(false);

  const { currentUser } = useContext(AuthContext);

  const fetch = useNotificationStore((state) => state.fetch);

  const number = useNotificationStore((state) => state.number);

  const navigate = useNavigate();


  if(currentUser) fetch();

  return (
      <nav>
        <div className="left">
          <a href="/" className="logo">
            <span>Estate</span>
          </a>
          <a href="/">Home</a>
          <a href="/">About</a>
          <a href="/">Contact</a>
          <a href="/">Agents</a>
        </div>
        <div className="right">
          {currentUser ? (
              <div className="user">
                <Button onClick={()=>navigate("/location")}>포스팅하기</Button>

                <Link to= "/profile"  className="profile">
                  {number > 0 && <div className="notification">{number}</div>}
                  <img src={currentUser.avatar || "/noavatar.jpg"} alt="avatar"/>
                  <span>{currentUser.username}</span>
                </Link>
                {/*<div className="menuDiv">*/}
                {/*  <div className="myAccount">내 계정</div>*/}
                {/*  <div className="menus">프로파일</div>*/}
                {/*  <div className="menus">정보 수정</div>*/}
                {/*  <div className="menus">로그아웃</div>*/}
                {/*</div>*/}

                {/*<Link to= "/profile" className="profile">*/}
                {/*  {number > 0 && <div className="notification">{number}</div>}*/}
                {/*  <div>Profile</div>*/}
                {/*</Link>*/}

              </div>
          ) : (
              <>
                <a href="/login">Sign in</a>
                <a href="/register" className="register">
                  Sign up
                </a>
              </>
          )}
          <div className="menuIcon">
            <img
                src="/menu.png"
                alt=""
                onClick={() => setOpen((prev) => !prev)}
            />
          </div>
          <div className={open ? "menu active" : "menu"}>
            <a href="/">Home</a>
            <a href="/">About</a>
            <a href="/">Contact</a>
            <a href="/">Agents</a>
            <a href="/">Sign in</a>
            <a href="/">Sign up</a>
          </div>
        </div>
      </nav>
  );
}

export default Navbar;
