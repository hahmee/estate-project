import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
import "./messagePage.scss";
import {useLoaderData, useNavigate, useParams, useSearchParams} from "react-router-dom";
import Conversation from "../../components/message/Conversation.jsx";
import Message from "../../components/message/Message.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {SocketContext} from "../../context/SocketContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../UI/Button.jsx";
import {toast} from "react-toastify";

function MessagePage() {
    const data = useLoaderData();
    const {userId} = useParams(); //작성자 아이디
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null); // 현재 누른
    const [receiver, setReceiver] = useState(data.resUserResponse?.data || null);
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(AuthContext);

    console.log('conversations', conversations);
    console.log('messages', messages);

    const clickConversation = useCallback(async (currentConversation) => {
        setCurrentConversation(currentConversation);
        //path variable 변경
        navigate('/messages/' + currentConversation.receiver.id);

    }, []);

    // useEffect(() => {
    //     console.log('??', currentConversation);
    //     const getMessages = async () => {
    //         try {
    //             const res = await apiRequest.get("/chats/userId/" + userId);
    //             console.log('res', res);
    //             setMessages(res.data?.messages);
    //         } catch (err) {
    //             console.log(err);
    //         }
    //     };
    //     currentConversation && getMessages();
    // }, [currentConversation]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (!text) return;

        try {

            if(!currentConversation.id) { //완전 처음
                //chat 추가
                const chatRes = await apiRequest.post("/chats", {
                    receiverId: currentConversation.receiver.id
                });
                const res = await apiRequest.post("/messages/" + chatRes.data.id, {text});
                setMessages([res.data.message]);
                setCurrentConversation(chatRes.data);


            } else { //채팅 내역 있음
                const res = await apiRequest.post("/messages/" + currentConversation.id, {text});

                setMessages([...messages, res.data.message]);
                const updatedChat = res.data.chat;

                const targetId = updatedChat.chatId;
                // console.log('targetId', targetId);
                //res의 chatId가 가장 상단에 있어야 함

                const reorderedConversations = conversations.sort((a, b) => (a.id === targetId ? -1 : b.id === targetId ? 1 : 0));
                //
                // console.log('reorderedConversations', reorderedConversations);
                setConversations(reorderedConversations);

            }

            e.target.reset();
            //이거 해야함 (왜?)
            // socket.emit("sendMessage", {
            //     receiverId: chat.receiver.id,
            //     data: res.data,
            // });
        } catch (err) {
            console.log(err);
            toast.error((err).message);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth",block: "nearest",});
    }, [messages]);


    useEffect(() => {
        const initializeChat = () => {
            const { resChatsResponse, resUserResponse, isChatExistResponse } = data;

            if (isChatExistResponse.data) { // 채팅 내역 존재
                const existingConversations = [...resChatsResponse.data];
                setConversations(resChatsResponse.data);
                setCurrentConversation(existingConversations.find(chat => chat.receiver.id === userId));
                setMessages(isChatExistResponse.data?.messages);
            } else { //새로운 채팅
                const newConversation = {
                    receiver: {
                        id: resUserResponse.data.id,
                        username: resUserResponse.data.username,
                        avatar: resUserResponse.data.avatar,
                    },
                };
                setConversations([...resChatsResponse.data, newConversation]);
                setCurrentConversation(newConversation);
            }
        };

        initializeChat();

    }, [data, userId]);


    return (
        <div className="chat">
            <div className="chat__sidebar">
                <div className="chat__sidebar-user">{currentUser.username}</div>
                <div className="chat__menu">
                    {conversations.map((c, idx) => (
                        <Conversation
                            key={idx}
                            conversation={c}
                            clickConversation={clickConversation}
                        />
                    ))}
                </div>
            </div>

            <div className="chat__main">
                <div className="chat__header">
                    {currentConversation && (
                        <div className="chat__receiver">
                            <img
                                src={
                                    currentConversation.receiver.avatar || "/noavatar.jpg"
                                }
                                alt="avatar"
                                className="chat__receiver-avatar"
                            />
                            <div className="chat__receiver-username">
                                {currentConversation.receiver.username}
                            </div>
                        </div>
                    )}
                </div>
                <div className="chat__wrapper">
                    {currentConversation ? (
                        <>
                            <div className="chat__messages">
                                {messages?.map((m) => (
                                    <div
                                        ref={scrollRef}
                                        key={m.id}
                                        className="chat__message"
                                    >
                                        <Message
                                            message={m}
                                            own={m.userId === currentUser.id}
                                            avatar={
                                                m.userId === currentUser.id
                                                    ? currentUser.avatar
                                                    : currentConversation.receiver.avatar
                                            }
                                        />
                                    </div>
                                ))}
                            </div>

                        </>
                    ) : (
                        <span className="chat__no-conversation">
                                채팅을 시작하기 위해서 대화상자를 열어주세요.
                        </span>
                    )}
                </div>

                <div className="chat__input">
                    <form onSubmit={handleSubmit} className="chat__form">
                                    <textarea
                                        name="text"
                                        className="chat__textarea"
                                        placeholder="메시지를 입력해주세요."
                                    ></textarea>
                        <Button>보내기</Button>
                    </form>
                </div>
            </div>
        </div>

    );


}

export default MessagePage;