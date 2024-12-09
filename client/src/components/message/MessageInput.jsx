import React, {useState} from 'react';
import "./messageInput.scss";
import Button from "../../UI/Button.jsx";

function MessageInput({handleSubmit}) {

    const [disabled, setDisabled] = useState(true);
    const [message, setMessage] = useState('');

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setMessage(value);
        setDisabled(value.trim() === '');
    };

    // 폼 제출 핸들러
    const handleFormSubmit = (e) => {
        e.preventDefault();
        if (handleSubmit) {
            handleSubmit(message); // 상위 컴포넌트에 메시지 전달
        }
        setMessage(''); // 입력값 초기화
        setDisabled(true); // 버튼 비활성화
        e.target.reset();
    };


    return (
        <div className="chatForm">
            <form onSubmit={handleFormSubmit} className="chatForm__form">
                <textarea name="text" placeholder="메시지를 입력해주세요." className="chatForm__textarea"
                          value={message}
                          onChange={handleInputChange}
                ></textarea>
                <Button className="chatForm__button" disabled={disabled}>전송</Button>
            </form>
        </div>
    );
}

export default MessageInput;