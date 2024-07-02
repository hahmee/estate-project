import React from 'react';

function MessageInput({handleSubmit}) {
    return (
        <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>보내기</button>
        </form>
    );
}

export default MessageInput;