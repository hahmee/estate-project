import React, {useState} from 'react';
import "./messageInput.scss";
import Button from "../../UI/Button.jsx";

function MessageInput({ handleSubmit, message, setMessage }) {
    const [disabled, setDisabled] = useState(true);

    // 입력값 변경 핸들러
    const handleInputChange = (e) => {
        const { value } = e.target;
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
    };

    // Enter 키 입력 핸들러
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault(); // 새 줄 추가 방지
            handleFormSubmit(e); // 메시지 전송
        }
    };

    return (
        <div className="chatForm">
            <form onSubmit={handleFormSubmit} className="chatForm__form">
                <textarea
                    name="text"
                    placeholder="메시지를 입력해주세요."
                    className="chatForm__textarea"
                    value={message}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown} // Enter 키 이벤트 추가
                ></textarea>
                <Button chatButton className="chatForm__button" disabled={disabled}>
                    전송
                </Button>
            </form>
        </div>
    );
}

export default MessageInput;
