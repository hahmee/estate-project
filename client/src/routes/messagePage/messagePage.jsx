import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react';
import "./messagePage.scss";
import {useLoaderData, useNavigate, useParams} from "react-router-dom";
import ChatItem from "../../components/message/ChatItem.jsx";
import apiRequest from "../../lib/apiRequest.js";
import {SocketContext} from "../../context/SocketContext.jsx";
import {AuthContext} from "../../context/AuthContext.jsx";
import {toast} from "react-toastify";
import Profile from "../../components/profile/Profile.jsx";
import MessageList from "../../components/messageList/MessageList.jsx";
import MessageInput from "../../components/message/MessageInput.jsx";
import {useNotificationStore} from "../../lib/notificationStore.js";

function MessagePage() {
    const data = useLoaderData();
    const { userId } = useParams(); // 문자열
    const navigate = useNavigate();

    const { socket } = useContext(SocketContext);
    const { currentUser } = useContext(AuthContext);
    const decrease = useNotificationStore((state) => state.decrease);

    const [chatList, setChatList] = useState([]);                 // 좌측 리스트
    const [currentChat, setCurrentChat] = useState(null);         // 선택된 채팅방
    const [messages, setMessages] = useState({});                 // { 'YYYY-MM-DD': Message[] }
    const [isUserOnline, setIsUserOnline] = useState(false);
    const [message, setMessage] = useState('');

    // 날짜 키 안전생성(UTC)
    const dateKeyFrom = (d) => new Date(d).toISOString().slice(0, 10);

    // 메시지 상태에 안전하게 푸시
    const pushDataToMessages = useCallback((newMessage) => {
        const key = dateKeyFrom(newMessage.createdAt);
        setMessages(prev => {
            const base = { ...(prev ?? {}) };
            base[key] = base[key] ? [...base[key], newMessage] : [newMessage];
            return base;
        });
    }, []);

    // 채팅 클릭
    const clickChat = useCallback((chat) => {
        setCurrentChat(chat);
        navigate('/messages/' + chat.receiver.id);
    }, [navigate]);

    // 서버 데이터 로드시 초기화
    useEffect(() => {
        const initializeChat = () => {
            const { resChatListResponse, resChatResponse } = data || {};
            const existedChatList = [...(resChatListResponse?.data ?? [])];

            setChatList(existedChatList);
            setMessages(resChatResponse?.data ?? {}); // 객체로 통일

            if (!userId) {
                setCurrentChat(null);
            } else {
                const found = existedChatList.find(chat => String(chat.receiver.id) === String(userId));
                setCurrentChat(found ?? null);
            }
        };

        initializeChat();
        setMessage("");
    }, [data, userId]);

    // 현재 채팅방 바뀌면 알림 카운트 감소
    useEffect(() => {
        if (currentChat) decrease(currentChat.id);
    }, [currentChat, decrease]);

    // 채팅 리스트가 비어있으면 서버에서 가져오기 (UI에도 반영)
    const ensureChatListLoaded = useCallback(async () => {
        if (!chatList || chatList.length < 1) {
            try {
                const res = await apiRequest.get("/chats");
                setChatList(res.data ?? []);
            } catch (error) {
                console.error("Failed to fetch chats:", error);
                toast.error(error?.message || "Failed to fetch chats");
            }
        }
    }, [chatList]);

    // 리스트 정렬 + lastMessage + unread 증가 (현재방이 아니면)
    const reorderChatList = useCallback((targetId, lastMessage) => {
        setChatList(prev => {
            const list = [...(prev ?? [])];
            const idx = list.findIndex(c => c.id === targetId);
            if (idx === -1) return list;

            const isCurrent = currentChat?.id === targetId;
            const t = list[idx];
            const updated = {
                ...t,
                lastMessage,
                unreadMessagesCount: isCurrent
                  ? (t.unreadMessagesCount ?? 0)
                  : (t.unreadMessagesCount ?? 0) + 1,
            };

            list.splice(idx, 1);
            list.unshift(updated);
            return list;
        });
    }, [currentChat]);

    // 메시지 전송
    const handleSubmit = useCallback(async (value) => {
        const text = value?.trim();
        if (!text || !currentChat) return;

        try {
            const res = await apiRequest.post("/messages/" + currentChat.id, { text });

            // 오늘 처음이면 날짜키 자동 생성되어 들어감
            pushDataToMessages(res.data.message);

            // 리스트 상단 이동 및 마지막 메시지 갱신
            reorderChatList(res.data.chat.id, text);

            // 소켓 전파
            socket?.emit("sendMessage", {
                receiverId: currentChat.receiver.id,
                data: res.data.message,
            });
        } catch (err) {
            console.log(err);
            toast.error(err?.message || "Failed to send message");
        }
    }, [currentChat, pushDataToMessages, reorderChatList, socket]);

    // 소켓 이벤트: 최신 상태를 캡처하기 위해 currentChat을 의존성으로 사용 → 리스너 재바인딩
    useEffect(() => {
        if (!socket) return;

        const handleSocketGetReceiverStatus = async (payload) => {
            await ensureChatListLoaded();

            // 해당 유저만 온라인 상태 수정 (다른 유저는 그대로)
            setChatList(prev => {
                if (!prev?.length) return prev ?? [];
                let changed = false;
                const next = prev.map(chat => {
                    if (String(chat.receiver.id) === String(payload.userId)) {
                        const nextChat = {
                            ...chat,
                            receiver: { ...chat.receiver, isOnline: payload.online }
                        };
                        changed = changed || (chat.receiver.isOnline !== payload.online);
                        return nextChat;
                    }
                    return chat;
                });
                return changed ? next : prev;
            });
        };

        const handleSocketGetMessage = async (dataMsg) => {
            // 리스트 정렬/카운트
            reorderChatList(dataMsg.chatId, dataMsg.text);

            // 현재방이면 메시지 추가 + 읽음 처리
            if (currentChat && currentChat.id === dataMsg.chatId) {
                pushDataToMessages(dataMsg);
                try {
                    await apiRequest.put(`/chats/readChatUser/${currentChat.id}`);
                } catch (err) {
                    console.log(err);
                    toast.error(err?.message || "Failed to mark as read");
                }
            }
        };

        socket.on("getMessage", handleSocketGetMessage);
        socket.on("getReceiverStatus", handleSocketGetReceiverStatus);

        // 현재 대화 상대 온라인 여부
        if (userId) {
            socket.emit("checkUserOnline", { userId }, (isOnline) => {
                setIsUserOnline(!!isOnline);
            });
        }

        // 좌측 리스트 유저들의 온라인 상태 일괄 확인
        if (chatList && chatList.length > 0) {
            const users = chatList.map(c => ({ ...c.receiver, chatId: c.id }));
            socket.emit("checkUserListOnline", { users }, (updatedUsers) => {
                const mapByChatId = new Map(updatedUsers.map(u => [u.chatId, u]));
                setChatList(prev => {
                    if (!prev?.length) return prev ?? [];
                    let changed = false;
                    const next = prev.map(chat => {
                        const updated = mapByChatId.get(chat.id);
                        if (!updated) return chat;
                        const nextChat = {
                            ...chat,
                            receiver: { ...chat.receiver, ...updated }
                        };
                        // 간단한 변경 감지
                        if (chat.receiver.isOnline !== nextChat.receiver.isOnline) changed = true;
                        return nextChat;
                    });
                    return changed ? next : prev;
                });
            });
        }

        return () => {
            socket.off("getMessage", handleSocketGetMessage);
            socket.off("getReceiverStatus", handleSocketGetReceiverStatus);
        };
    }, [socket, userId, chatList, currentChat, ensureChatListLoaded, pushDataToMessages, reorderChatList]);

    return (
      <div className={`chat ${!userId ? "borderNone" : ""}`}>
          <div className={`chat__sidebar ${!userId ? "chat__sidebar--full" : ""}`}>
              <div
                className={`chat__sidebar-user ${!userId ? "chat__sidebar-user--none" : ""}`}
                onClick={() => navigate("/messages")}
              >
                  {currentUser.username}
              </div>

              <div className="chat__sidebar-menu">
                  {(!chatList || chatList.length < 1)
                    ? <div className="chat__sidebar-menu--noChatting">채팅 리스트가 없습니다.</div>
                    : chatList.map((c) => (
                      <ChatItem
                        key={c.id}                 // 고유키 사용
                        chat={c}
                        clickChat={clickChat}
                      />
                    ))
                  }
              </div>
          </div>

          <div className={`chat__main ${!userId ? "chat__main--none" : ""}`}>
              {userId && (
                <div className="chat__header">
                    {currentChat && (
                      <Profile receiver={currentChat.receiver} isOnline={isUserOnline} onlineStatus={true} />
                    )}
                </div>
              )}

              {currentChat ? (
                <div className="chat__wrapper">
                    <MessageList messages={messages} currentUser={currentUser} currentChat={currentChat} />
                </div>
              ) : (
                <div className="chat__noWrapper">
            <span className={`chat__no-conversation ${!userId ? "chat__no-conversation--none" : ""}`}>
              채팅을 시작하기 위해서 대화상자를 열어주세요.
            </span>
                </div>
              )}

              {currentChat && (
                <MessageInput handleSubmit={handleSubmit} message={message} setMessage={setMessage} />
              )}
          </div>
      </div>
    );
}

export default MessagePage;
