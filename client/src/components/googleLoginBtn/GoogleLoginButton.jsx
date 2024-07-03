import React, {useContext} from 'react';
import Button from "../../UI/Button.jsx";
import { useGoogleLogin } from '@react-oauth/google';
import apiRequest from "../../lib/apiRequest.js";
import {useNavigate} from "react-router-dom";
import {AuthContext} from "../../context/AuthContext.jsx";
import "./googleLoginButton.scss";

function GoogleLoginButton(props) {
    const navigate = useNavigate();
    const {updateUser} = useContext(AuthContext);

    const handleLoginGoogle = async (email, username, avatar, externalId) => {
        // setError("");
        // setIsLoading(true);
        try {
            await apiRequest.post("/auth/register", {
                username: username,
                email:email,
                avatar: avatar,
                externalType: 'google',
                externalId: externalId
            });

            const res = await apiRequest.post("/auth/login", {
                username: username,
                externalType: 'google',
                externalId: externalId,
            });

            updateUser(res.data);
            navigate("/");

        } catch (err) {
            //setError(err.response.data.message);
        } finally {
            //setIsLoading(false);
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: (tokenResponse) =>{
            console.log('tokenResponse', tokenResponse);
            apiRequest.post("/auth/googleLoginAccessToken", {
                accessToken: tokenResponse.access_token,
            }).then((response) => {
                const data = response.data;
                handleLoginGoogle(data.email, data.name, data.picture, data.id);

            }).catch((error) => {
                console.log(error);
            });
        },
        onError: (error) => {
            console.log('구글 로그인 실패했습니다.', error);
        },
    });

    return (
        <Button outlined onClick={googleLogin} type="button" style={{gap:'15px'}}>
            <span className="googleIcon">
                <img src="https://img.clerk.com/static/google.svg?width=80" alt="google"/>
            </span>
            <p>Google 로그인 버튼</p>
        </Button>
    );
}

export default GoogleLoginButton;