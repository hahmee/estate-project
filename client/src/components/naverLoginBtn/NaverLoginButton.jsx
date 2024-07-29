import React, {useContext, useEffect} from 'react';
import Button from "../../UI/Button.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";

function NaverLoginButton(props) {
    const navigate = useNavigate();
    const {currentUser, updateUser} = useContext(AuthContext);
    const NAVER_CLIENT_ID = process.env.VITE_NAVER_CLIENT_ID; // 발급받은 클라이언트 아이디
    // const REDIRECT_URI = 'http://localhost:8800/api/auth/naverLoginAccessToken'// 'http://localhost:5173/redirectURI'; // Callback URL
    const REDIRECT_URI = 'http://localhost:5173/redirectURI'; // Callback URL

    const STATE = Math.random().toString(36).substring(1,11); // 사이트 간 요청 위조(CSRF)공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰값. URL 인코딩을 적용한 값을 사용
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
    let naverPopup = null;

    const naverLogin = async () => {

        naverPopup = window.open(NAVER_AUTH_URL, "naverLoginPopup", "width=600, height=600");
        // 혹시나 팝업윈도우 제한이 걸려있는 경우에는 Alert을 뿌려 팝업윈도우 해제를 하도록 유도한다


        if(naverPopup === null || typeof(naverPopup) === 'undefined'){
            alert("팝업윈도우 설정을 해제해 주세요");
            return;
        }

    };

    //
    window.parentFunc = () => {
        //자식 창 닫기
        naverPopup.close();
        console.log('test');
        // navigate('/');
        window.location.reload();
        toast.success('로그인 되었습니다.');
    };

    return (
        <Button outlined onClick={naverLogin} type="button" style={{gap:'15px'}}>
            <span className="googleIcon">
                {/*<img src="https://img.clerk.com/static/google.svg?width=80" alt="naver"/>*/}
            </span>
            <p>Naver 로그인</p>
        </Button>
    );
}

export default NaverLoginButton;