import React, {Suspense, useCallback, useContext, useEffect, useRef, useState} from 'react';
import "./messagePage.scss";
import {Await, useLoaderData} from "react-router-dom";
import Conversation from "../../components/message/Conversation.jsx";
import Message from "../../components/message/Message.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {SocketContext} from "../../context/SocketContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../UI/Button.jsx";

function MessagePage() {
    const data = useLoaderData();

    const [currentConversation, setCurrentConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const { socket } = useContext(SocketContext);
    const { currentUser } = useContext(AuthContext);

    const clickConversation = useCallback((currentConversation) => {
        setCurrentConversation(currentConversation);
    }, []);


    useEffect(() => {
        const getMessages = async () => {
            try {
                const res = await apiRequest.get("/chats/" + currentConversation?.id);
                console.log('res', res.data);
                setMessages(res.data.messages);
            } catch (err) {
                console.log(err);
            }
        };
        currentConversation && getMessages();
    }, [currentConversation]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (!text) return;

        try {
            const res = await apiRequest.post("/messages/" + currentConversation.id, { text });
            console.log('res', res.data);
            console.log('currentConversation', currentConversation);
            setMessages([...messages, res.data]);
            e.target.reset();
            //이거 해야함 (왜?)
                // socket.emit("sendMessage", {
                //     receiverId: chat.receiver.id,
                //     data: res.data,
                // });
        } catch (err) {
            console.log(err);
        }
    };


    return (
        <div className="messagePage">
            <div className="messenger">
                <div className="chatMenuWrapper">
                    <Suspense fallback={<p>로딩 중...</p>}>
                        <Await
                            resolve={data.chatResponse}
                            errorElement={<p>메시지를 로딩하는데 실패했습니다.</p>}
                        >
                            {(chatResponse) => <Conversation conversations={chatResponse.data} clickConversation={clickConversation}/>}
                        </Await>
                    </Suspense>
                </div>
            </div>

            <div className="chatBox">
                <div className="chatBoxWrapper">
                    {
                        currentConversation ? (
                            <>
                                <div className="chatBoxTop">
                                    {messages?.map((m) => (
                                        <div ref={scrollRef} key={m.id}>
                                            <Message message={m} own={m.userId === currentUser.id}
                                                     avatar={m.userId === currentUser.id ? currentUser.avatar : currentConversation.receiver.avatar}/>
                                        </div>
                                    ))}
                                </div>
                                <div className="chatBoxBottom">
                                    <form onSubmit={handleSubmit} className="chatBoxForm">
                                        <textarea name="text" className="chatMessageInput" placeholder="메시지를 입력해주세요."></textarea>
                                        <Button>보내기</Button>
                                    </form>
                                </div>
                            </>
                        ) : (<span className="noConversationText">채팅을 시작하기 위해서 대화상자를 열어주세요.</span>)}
                </div>
            </div>
        </div>
    );
}

export default MessagePage;