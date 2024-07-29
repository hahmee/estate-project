import React, {useContext, useEffect} from "react";
import apiRequest from "../../lib/apiRequest.js";
import {AuthContext} from "../../context/AuthContext.jsx";


const RedirectURI = (props) => {
    const {updateUser} = useContext(AuthContext);

    useEffect(() => {
        console.log('!!1')

        // 백엔드로 코드값을 넘겨주는 로직
        // 요청 성공 코드값
        const code = new URL(window.location.href).searchParams.get("code");
        const state = new URL(window.location.href).searchParams.get("state");

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

            console.log('!!', res.data);
            updateUser(res.data);

            //부모 창 함수 실행
            window.opener.parentFunc();


            if (code && state) {
                handleLoginNaver();
            }
        }

    });

    return (
        <div>
            {/* 로그인중이라는 것을 표시할 수 있는 로딩중 화면 */}
         로딩중.....
        </div>
    );
};


export default RedirectURI;
