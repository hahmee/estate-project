import React from 'react';
import "./messageInput.scss";
import Button from "../../UI/Button.jsx";

function MessageInput({handleSubmit}) {
    return (
        <div className="chatForm">
            <form onSubmit={handleSubmit} className="chatForm__form">
                <textarea name="text" placeholder="메시지를 입력해주세요." className="chatForm__textarea"></textarea>
                <Button className="chatForm__button">전송</Button>
            </form>
        </div>
    );
}

export default MessageInput;