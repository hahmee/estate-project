import React, {useCallback, useContext, useEffect, useRef, useState} from 'react';
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
    const [conversations, setConversations] = useState([]);
    const [currentConversation, setCurrentConversation] = useState(null); // 현재 누른
    const [messages, setMessages] = useState([]);
    const scrollRef = useRef();
    const {socket} = useContext(SocketContext);
    const {currentUser} = useContext(AuthContext);
    const [isUserOnline, setIsUserOnline] = useState(false);

    // 원하는 채팅창을 클릭한다.
    const clickConversation = useCallback(async (currentConversation) => {
        setCurrentConversation(currentConversation);
        //path variable 변경
        navigate('/messages/' + currentConversation.receiver.id);

    }, [currentConversation]);


    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData(e.target);
        const text = formData.get("text");

        if (!text) return;

        try {
            const res = await apiRequest.post("/messages/" + currentConversation.id, {text});
            setMessages([...messages, res.data.message]);
            const updatedChat = res.data.chat;

            // //res의 chat의 Id가 가장 상단에 있어야 함
            reorderConversations(updatedChat.id, text);

            e.target.reset();

            socket.emit("sendMessage", {
                receiverId: currentConversation.receiver.id,
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
        console.log('conversations..', conversations);
    }, [conversations]);

    useEffect(() => {
        console.log('initializeChat');
        const initializeChat = () => {
            const {resChatListResponse, resChatResponse} = data;
            const existingConversations = [...resChatListResponse.data];

            setConversations(resChatListResponse.data);

            if (!userId) {
                setCurrentConversation(null);
            } else {
                setCurrentConversation(existingConversations.find(chat => chat.receiver.id === userId)); //받는사람이 게시글쓴사람과 같은게 현재
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
    const reorderConversations = (targetId, lastMessage) => {
        //conversations를 복사하여 새로운 배열을 생성한 후 정렬하면 React가 상태 변화를 감지가능
        const reorderedConversations = [...conversations].sort((a, b) => a.id === targetId ? -1 : b.id === targetId ? 1 : 0
        );
        reorderedConversations[0].lastMessage = lastMessage;
        setConversations(reorderedConversations);

    };

    //비어있으면 서버에서 데이터 가져온다.
    const checkConversationEmpty = async () => {
        if (conversations && conversations.length < 1) {
            // 빈칸이라면
            try {
                const res = await apiRequest.get("/chats");
                setConversations(res.data);
            } catch (error) {
                console.error("Failed to fetch conversations:", error);
                toast.error((error).message);
            }
        }
    };

    useEffect(() => {

        const handleSocketMessage = async (data) => {
            console.log('handleSocketMessage', handleSocketMessage);
            //conversation이 비어있으면 서버에서 데이터 가져온다.
            await checkConversationEmpty();
            // conversations 순서 첫번째로 변경 및 lastMessage 변경
            reorderConversations(data.chatId, data.text);
            if (currentConversation && currentConversation.id === data.chatId) {
                setMessages((prev) => [...prev, data]);
                // read();
            }
        };

        const fetchData = async () => {
            await checkConversationEmpty(); // 의존성배열에 conversation 넣지 않았더니 setState로 변경한 거 감지가 안됨
            console.log('conversations2', conversations);
            //conversations 빈칸 출력
            userId && socket.emit("checkUserOnline", {userId}, (isOnline) => {
                setIsUserOnline(isOnline);
            });

            //conversations리스트들의 online상태 가져온다.
            if (conversations && conversations.length > 0) {
                const users = conversations.map((data) => {
                    return {
                        ...data.receiver,
                        chatId: data.id //추가했음
                    };
                });

                socket.emit("checkUserListOnline", {users}, (updatedUsers) => {
                    //이중포문 대신, updatedUsers를 Map으로 변환하여 검색을 빠르게
                    const updatedUsersMap = new Map(updatedUsers.map(user => [user.chatId, user]));

                    // conversations를 업데이트합
                    const updatedConversations = conversations.map(conversation => {
                        const updatedUser = updatedUsersMap.get(conversation.id); // chatId와 conversation.id 매칭
                        if (updatedUser) {
                            return {
                                ...conversation,
                                receiver: {
                                    ...conversation.receiver,
                                    ...updatedUser, // updatedUser로 receiver 업데이트
                                },
                            };
                        }
                        return conversation; // 매칭되는 updatedUser가 없으면 그대로 반환
                    });

                    // 하지만 의존성 배열에 conversations를 넣으면 무한루프돈다...
                    setConversations(updatedConversations); //현재 online상태인지까지 포함해서 conversations에 저장
                });
            }
        };

        if (socket) {

            socket.on("getMessage", handleSocketMessage);

            fetchData();

        }

        return () => {
            if (socket) {
                socket.off("getMessage", handleSocketMessage);
                socket.off("checkUserOnline");
                socket.off("checkUserListOnline"); // 왼쪽 chatList 의 유저들 온라인 상태인지 확인한다.
            }
        };
    }, [socket, currentConversation, userId]);


    return (
        <div className="chat">
            <div className="chat__sidebar">
                <div className="chat__sidebar-user">{currentUser.username}</div>
                <div className="chat__menu">
                    {
                        conversations && conversations.length < 1 ?
                            <div>채팅 리스트가 없습니다.</div>
                            :
                            conversations.map((c, idx) => (
                                <ChatItem
                                    key={idx}
                                    conversation={c}
                                    clickConversation={clickConversation}
                                />
                            ))
                    }

                </div>
            </div>

            <div className="chat__main">
                <div className="chat__header">
                    {currentConversation && (
                        <div className="chat__receiver">
                           <Profile receiver={currentConversation.receiver} isOnline={isUserOnline}/>
                        </div>
                    )}
                </div>
                <div className="chat__wrapper">
                    {currentConversation ? (
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
                                                        : currentConversation.receiver.avatar
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

                {currentConversation &&
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