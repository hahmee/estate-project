import React, {useEffect} from "react";
import apiRequest from "../../lib/apiRequest.js";


const RedirectNaverURI = (props) => {

    useEffect(() => {

        // 백엔드로 코드값을 넘겨주는 로직
        // 요청 성공 코드값
        const code = new URL(window.location.href).searchParams.get("code");
        const state = new URL(window.location.href).searchParams.get("state");

        console.log(code, state);
        const handleLoginNaver = async () => {
            //백엔드 전달해준다.
            const data = await apiRequest.post("/auth/naverLoginAccessToken", {
                code: code,
                state: state
            });

            const res = await apiRequest.post("/auth/login", {
                email: data.data.email,
                externalType: 'naver',
                externalId: data.data.externalId,
            });

            // 부모 창 함수 실행
            window.opener.parentFunc(res.data);
        }

        if (code && state) {
            handleLoginNaver();
        }
    }, []);

    return (
        <div style={{marginTop: '30px'}}>
         네이버 로그인 중입니다......
        </div>
    );
};


export default RedirectNaverURI;
