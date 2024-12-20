import React from "react";
import { useRouteError } from "react-router-dom";
import "./errorPage.scss"; // SCSS 파일을 불러옵니다.

function ErrorPage() {
    const error = useRouteError();

    return (
        <div className="error-page">
            <h1 className="error-page__title">에러가 발생했습니다!</h1>
            <p className="error-page__message">{error.statusText || "알 수 없는 오류입니다."}</p>
            <p className="error-page__details">{error.message}</p>
            <a href="/" className="error-page__home-link">홈으로 돌아가기</a>
        </div>
    );
}

export default ErrorPage;
