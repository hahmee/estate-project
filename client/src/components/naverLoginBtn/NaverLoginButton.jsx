import React, {useCallback, useContext, useEffect} from 'react';
import Button from "../../UI/Button.jsx";
import {useGoogleLogin} from '@react-oauth/google';
import apiRequest from "../../lib/apiRequest.js";
import {useNavigate, useSearchParams} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
// import "./googleLoginButton.scss";
import {toast} from "react-toastify";

function NaverLoginButton(props) {
    const navigate = useNavigate();
    const {updateUser} = useContext(AuthContext);
    const NAVER_CLIENT_ID = process.env.VITE_NAVER_CLIENT_ID; // 발급받은 클라이언트 아이디
    // const REDIRECT_URI = process.env.VITE_NAVER_REDIRECT_URI+'/register'; // Callback URL
    const REDIRECT_URI = 'http://localhost:8800/api/auth/naverLoginAccessToken'// 'http://localhost:5173/redirectURI'; // Callback URL

    const STATE = Math.random().toString(36).substring(1,11); // 사이트 간 요청 위조(CSRF)공격을 방지하기 위해 애플리케이션에서 생성한 상태 토큰값. URL 인코딩을 적용한 값을 사용
    const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=${NAVER_CLIENT_ID}&state=${STATE}&redirect_uri=${REDIRECT_URI}`;
    const [searchParams, setSearchParams] = useSearchParams();

    const handleLoginNaver = async (email, username, avatar, externalId) => {
        try {
            await apiRequest.post("/auth/register", {
                username: username,
                email:email,
                avatar: avatar,
                externalType: 'google',
                externalId: externalId
            });

            const res = await apiRequest.post("/auth/login", {
                email: email,
                externalType: 'google',
                externalId: externalId,
            });

            updateUser(res.data);
            toast.success('로그인 되었습니다.');
            navigate("/");

        } catch (err) {
            toast.error(err.response.data.message);
        } finally {
            //setIsLoading(false);
        }
    }
    const naverLogin = async () => {
        // window.location.href = NAVER_AUTH_URL;
        const naverPopup = window.open(NAVER_AUTH_URL, "naverLoginPopup", "width=600, height=600");
        // 혹시나 팝업윈도우 제한이 걸려있는 경우에는 Alert을 뿌려 팝업윈도우 해제를 하도록 유도한다
        if(naverPopup === null || typeof(naverPopup) === 'undefined'){
            alert("팝업윈도우 설정을 해제해 주세요");
            return;
        }

        //localstorage에 저장이 되면
        // if() {
        //     naverPopup.close();
        //
        // }


        // 팝업을 통해서 네이버 로그인을 하게 되면, Redirect 페이지에서 팝업을 종료하게 된다
        // 팝업이 닫혀졌는지 0.5초로 확인하여, 닫혀져 있으면 로그인이 잘 되었는지 확인한다
        const timer = setInterval(function(){
            if(naverPopup.closed) {

                // naverPopupUnloadTrigger();

                clearInterval(timer)
            }
        }, 500);

        //작업 다 완수하면
        // navigate(`/register?code=${code}&status=${status}`)
    };

    //callback
    useEffect(() => {
        console.log('?!??!!');
        // 백엔드로 코드값을 넘겨주는 로직
        // 요청 성공 코드값
        const code2 = new URL(window.location.href).searchParams.get("code");
        const status2 = new URL(window.location.href).searchParams.get("status");
        console.log('code2',code2);
        console.log('status2',status2);
        //
        const code = searchParams.get("code");
        const status = searchParams.get("status");


        console.log(code);
        console.log(status);

        // 요청이 성공하면 navigate('/main')
    }, []);

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