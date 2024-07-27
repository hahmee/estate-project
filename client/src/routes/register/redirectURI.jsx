import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RedirectURI = (props) => {
    const navigate = useNavigate();

    useEffect(() => {
        // 백엔드로 코드값을 넘겨주는 로직
        // 요청 성공 코드값
        const code = new URL(window.location.href).searchParams.get("code");
        const state = new URL(window.location.href).searchParams.get("state");

        console.log(code);
        console.log(state);
        if (code && state)  {
            //닫는다.
            // 요청이 성공하면 navigate('/main')

            // navigate('/register');
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
