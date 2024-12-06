import React, {useCallback, useContext, useEffect, useMemo, useRef, useState} from 'react';
import "./messagePage.scss";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import ChatItem from "../../components/message/ChatItem.jsx";
import Message from "../../components/message/Message.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {SocketContext} from "../../context/SocketContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import Button from "../../UI/Button.jsx";
import {toast} from "react-toastify";
import Profile from "../../components/profile/Profile.jsx";

function MessagePage() {
    const data = useLoaderData();
    const {userId} = useParams(); //작성자 아이디
    const navigate = useNavigate();
    const chatListRef = useRef([]);
    const [chatList, setChatList] = useState([]);
    const [currentChat, setCurrentChat] = useState(); // 현재 누른
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(AuthContext);
    const [isUserOnline, setIsUserOnline] = useState(false);

    // 원하는 채팅창을 클릭한다.
    const clickChat = useCallback(async (currentChat) => {
        setCurrentChat(currentChat);
        //path variable 변경
        navigate('/messages/' + currentChat.receiver.id);

    }, [currentChat]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (!text) return;

        try {
            const res = await apiRequest.post("/messages/" + currentChat.id, {text});
            setMessages([...messages, res.data.message]);
            const updatedChat = res.data.chat;

            // //res의 chat의 Id가 가장 상단에 있어야 함
            reorderChatList(updatedChat.id, text);

            e.target.reset();

            socket.emit("sendMessage", {
                receiverId: currentChat.receiver.id,
                data: res.data.message,
            });
        } catch (err) {
            console.log(err);
            toast.error((err).message);
        }
    };

    useEffect(() => {
        scrollRef.current?.scrollIntoView({behavior: "smooth",block: "nearest",});
    }, [messages]);

    useEffect(() => {
        chatListRef.current = chatList; // 상태가 변경될 때 ref 업데이트
    }, [chatList]);

    useEffect(() => {
        const initializeChat = () => {
            const {resChatListResponse, resChatResponse} = data;
            const existedChatList = [...resChatListResponse.data];

            chatListRef.current = resChatListResponse.data;

            if (!userId) {
                setCurrentChat(null);
            } else {
                setCurrentChat(existedChatList.find(chat => chat.receiver.id === userId)); //받는사람이 게시글쓴사람과 같은게 현재
            }

            if (resChatResponse) {
                setMessages(resChatResponse.data.messages || [])
            } else {
                setMessages([]);
            }

        };

        initializeChat();

    }, [data, userId]);

    //targetId를 찾아서 해당하는 대화창을 1번째로 정렬 및 lastMessage 변경한다.
    const reorderChatList = (targetId, lastMessage) => {
        //chatList를 복사하여 새로운 배열을 생성한 후 정렬하면 React가 상태 변화를 감지가능
        const reorderedChatList = [...chatListRef.current].sort((a, b) => a.id === targetId ? -1 : b.id === targetId ? 1 : 0
        );
        reorderedChatList[0].lastMessage = lastMessage;
        setChatList(reorderedChatList);
    };

    //비어있으면 서버에서 데이터 가져온다.
    const checkIfChatEmpty = async () => {
        if (chatList && chatList.length < 1) {
            // 빈칸이라면
            try {
                const res = await apiRequest.get("/chats");
                setChatList(res.data);
            } catch (error) {
                console.error("Failed to fetch chats:", error);
                toast.error((error).message);
            }
        }
    };

    useEffect(() => {

        const handleSocketMessage = async (data) => {
            //chat이 비어있으면 서버에서 데이터 가져온다.
            await checkIfChatEmpty(); // 잘 안된다...
            // chatlist 순서 첫번째로 변경 및 lastMessage 변경
            reorderChatList(data.chatId, data.text);
            if (currentChat && currentChat.id === data.chatId) {
                setMessages((prev) => [...prev, data]);
                // read();
            }
        };

        const checkIfChatListOnline = async () => {
            //문제 발생 --> 이 함수 실행 전에 setState로 chats 값을 넣어줬는데, 바로 반영이 안되는 문제
            // 해결 --> useRef 사용
            const chatListRefCurrent = chatListRef.current;

            //chat리스트들의 online상태 가져온다.
            if (chatListRefCurrent && chatListRefCurrent.length > 0) {
                const users = chatListRefCurrent.map((data) => {
                    return {
                        ...data.receiver,
                        chatId: data.id //추가했음
                    };
                });

                socket.emit("checkUserListOnline", {users}, (updatedUsers) => {
                    //이중포문 대신, updatedUsers를 Map으로 변환하여 검색을 빠르게
                    const updatedUsersMap = new Map(updatedUsers.map(user => [user.chatId, user]));

                    // chatList를 업데이트합
                    const updatedChatList = chatListRefCurrent.map(chat => {
                        const updatedUser = updatedUsersMap.get(chat.id); // chatId와 chat.id 매칭
                        if (updatedUser) {
                            return {
                                ...chat,
                                receiver: {
                                    ...chat.receiver,
                                    ...updatedUser, // updatedUser로 receiver 업데이트
                                },
                            };
                        }
                        return chat; // 매칭되는 updatedUser가 없으면 그대로 반환
                    });

                    // 하지만 의존성 배열에 chatList를 넣으면 무한루프돈다...
                    setChatList(updatedChatList); //현재 online상태인지까지 포함해서 chatList에 저장
                });
            }
        };

        //실행 시작 부분
        if (socket) {
            socket.on("getMessage", handleSocketMessage);

            //현재 대화창의 유저가 온라인인지 표시한다.
            userId && socket.emit("checkUserOnline", {userId}, (isOnline) => {
                setIsUserOnline(isOnline);
            });

            //왼쪽 대화 리스트들의 유저들이 온라인 상태인지 표시한다.
            checkIfChatListOnline();
        }

        return () => {
            if (socket) {
                socket.off("getMessage", handleSocketMessage);
                socket.off("checkUserOnline");
                socket.off("checkUserListOnline"); // 왼쪽 chatList 의 유저들 온라인 상태인지 확인한다.
            }
        };

    }, [socket, currentChat, userId, data]);

    return (
        <div className="chat">
            <div className="chat__sidebar">
                <div className="chat__sidebar-user">{currentUser.username}</div>
                <div className="chat__menu">
                    {
                        chatList && chatList.length < 1 ?
                            <div>채팅 리스트가 없습니다.</div>
                            :
                            chatList.map((c, idx) => (
                                <ChatItem
                                    key={idx}
                                    chat={c}
                                    clickChat={clickChat}
                                />
                            ))
                    }
                </div>
            </div>

            <div className="chat__main">
                <div className="chat__header">
                    {currentChat && (
                        <div className="chat__receiver">
                            <Profile receiver={currentChat.receiver} isOnline={isUserOnline}/>
                        </div>
                    )}
                </div>
                <div className="chat__wrapper">
                    {currentChat ? (
                        <>
                            <div className="chat__messages">
                                {messages && messages.length > 0 ?
                                    messages.map((m) => (
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
                                                        : currentChat.receiver.avatar
                                                }
                                            />
                                        </div>
                                    ))
                                    : "아직 진행중인 대화가 없습니다."}
                            </div>

                        </>
                    ) : (
                        <span className="chat__no-conversation">
                                채팅을 시작하기 위해서 대화상자를 열어주세요.
                        </span>
                    )}
                </div>

                {currentChat &&
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

                }

            </div>
        </div>

    );


}

export default MessagePage;