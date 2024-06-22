import React from 'react';

function MessageInput({handleSubmit}) {
    return (
        <form onSubmit={handleSubmit} className="bottom">
            <textarea name="text"></textarea>
            <button>Send</button>
        </form>
    );
}

export default MessageInput;