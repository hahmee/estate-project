import Message from "../message/Message.jsx";
import {useEffect, useRef} from "react";

const MessageList = (props) => {
    const { messages, currentUser, currentChat } = props;
    const scrollRef = useRef();

    useEffect(() => {
        console.log('messages', scrollRef.current)
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth", block: "nearest" });
        }
    }, [messages]);

    if(!messages || Object.keys(messages).length === 0) {

        return <div>아직 진행중인 대화가 없습니다.</div>
    }


    return (
        <div className="messages">
            {Object.entries(messages).map(([date, messagesForDate]) => (
                <div key={date} ref={scrollRef}>
                    <h3>날짜: {date}</h3>
                    <div>
                        {
                            messagesForDate?.map((m) => (
                                <div key={m.id}>
                                    <Message
                                        message={m}
                                        own={m.userId === currentUser.id}
                                        avatar={
                                            m.userId === currentUser.id
                                                ? currentUser.avatar
                                                : currentChat.receiver.avatar
                                        }
                                    />
                                </div>
                            ))}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default MessageList;
