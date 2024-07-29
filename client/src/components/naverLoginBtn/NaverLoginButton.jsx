import React, {useContext, useEffect} from 'react';
import Button from "../../UI/Button.jsx";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";

function NaverLoginButton(props) {
    const navigate = useNavigate();
    const {updateUser} = useContext(AuthContext);
    const NAVER_CLIENT_ID = process.env.VITE_NAVER_CLIENT_ID;
    const REDIRECT_URI = process.env.VITE_NAVER_REDIRECT_URI;

    const STATE = Math.random().toString(36).substring(1,11); // 사이트 간 요청 위조(CSRF)공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰값. URL 인코딩을 적용한 값을 사용
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
    let naverPopup = null;

    const naverLogin = async () => {

        naverPopup = window.open(NAVER_AUTH_URL, "naverLoginPopup", "width=600, height=600");
        // 혹시나 팝업윈도우 제한이 걸려있는 경우에는 Alert을 뿌려 팝업윈도우 해제를 하도록 유도한다

        if(naverPopup === null || typeof(naverPopup) === 'undefined') {
            alert("팝업윈도우 설정을 해제해 주세요");
            return;
        }

    };

    //redirectURI에서 부모창으로 데이터 전달
    window.parentFunc = (userData) => {
        //자식 창 닫기
        naverPopup.close();
        updateUser(userData);
        toast.success('로그인 되었습니다.');
        navigate('/');
    };

    return (
        <Button outlined onClick={naverLogin} type="button" style={{gap:'15px'}}>
            <span className="googleIcon">
                <img src="/naver.png" alt="naver" style={{width:'20px'}}/>
            </span>
            <p>Naver 로그인</p>
        </Button>
    );
}

export default NaverLoginButton;