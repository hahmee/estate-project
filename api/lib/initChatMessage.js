// initChatMessage.js
import prisma from "./prisma.js";
import 'dotenv/config';
import { generateChatUUID } from "../controllers/chat.controller.js";

async function seedChatMessageData() {
    try {
        // 기존 채팅 관련 데이터 삭제 (Chat, Message, ChatUser)
        await prisma.message.deleteMany({});
        await prisma.chatUser.deleteMany({});
        await prisma.chat.deleteMany({});
        console.log("기존 채팅 관련 데이터 삭제 완료.");

        // 최소 9명의 유저가 필요 (첫번째 유저 + 8명의 대화 상대)
        const users = await prisma.user.findMany({
            select: { id: true },
            orderBy: { createdAt: "asc" }
        });
        if (users.length < 9) {
            throw new Error("채팅 데이터를 생성하려면 최소 9명의 유저가 필요합니다.");
        }
        const firstUser = users[0];
        const chatPartners = users.slice(1, 9); // 8명의 대화 상대

        // 8개의 대화 내용을 미리 정의 (각각 매물 관련 문의/답변)
        const conversations = [
            {
                chatCreatedAt: new Date("2025-03-06T03:35:12.666Z"),
                lastChatAt: new Date("2025-03-06T03:35:37.509Z"),
                lastMessage: "조건은 매매, 전세 모두 가능합니다.",
                messages: [
                    { sender: "first", text: "안녕하세요, 이 매물의 가격이 궁금합니다.", createdAt: new Date("2025-03-06T03:35:14.203Z") },
                    { sender: "partner", text: "안녕하세요, 가격은 협상 가능합니다.", createdAt: new Date("2025-03-06T03:35:20.000Z") },
                    { sender: "first", text: "그럼, 거래 조건은 어떻게 되나요?", createdAt: new Date("2025-03-06T03:35:30.000Z") },
                    { sender: "partner", text: "조건은 매매, 전세 모두 가능합니다.", createdAt: new Date("2025-03-06T03:35:37.509Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:36:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:36:20.000Z"),
                lastMessage: "알겠습니다, 감사합니다.",
                messages: [
                    { sender: "first", text: "매물의 위치가 어디인지 알고 싶어요.", createdAt: new Date("2025-03-06T03:36:05.000Z") },
                    { sender: "partner", text: "서울 강남구에 위치해 있습니다.", createdAt: new Date("2025-03-06T03:36:10.000Z") },
                    { sender: "first", text: "알겠습니다, 감사합니다.", createdAt: new Date("2025-03-06T03:36:20.000Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:37:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:37:30.000Z"),
                lastMessage: "사진 보내주세요.",
                messages: [
                    { sender: "first", text: "이 매물의 내부 사진을 볼 수 있을까요?", createdAt: new Date("2025-03-06T03:37:05.000Z") },
                    { sender: "partner", text: "네, 사진을 바로 보내드리겠습니다.", createdAt: new Date("2025-03-06T03:37:15.000Z") },
                    { sender: "first", text: "사진 보내주세요.", createdAt: new Date("2025-03-06T03:37:30.000Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:38:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:38:25.000Z"),
                lastMessage: "문의주셔서 감사합니다.",
                messages: [
                    { sender: "first", text: "매물의 관리비는 어떻게 되나요?", createdAt: new Date("2025-03-06T03:38:05.000Z") },
                    { sender: "partner", text: "관리비는 월 20만원 정도입니다.", createdAt: new Date("2025-03-06T03:38:15.000Z") },
                    { sender: "first", text: "문의주셔서 감사합니다.", createdAt: new Date("2025-03-06T03:38:25.000Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:39:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:39:30.000Z"),
                lastMessage: "예약 진행할게요.",
                messages: [
                    { sender: "first", text: "이 매물 방문 예약을 하고 싶습니다.", createdAt: new Date("2025-03-06T03:39:05.000Z") },
                    { sender: "partner", text: "예약 가능 시간은 오후 2시 이후입니다.", createdAt: new Date("2025-03-06T03:39:15.000Z") },
                    { sender: "first", text: "예약 진행할게요.", createdAt: new Date("2025-03-06T03:39:30.000Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:40:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:40:25.000Z"),
                lastMessage: "상담 후 연락드릴게요.",
                messages: [
                    { sender: "first", text: "매물 상태가 어떤가요?", createdAt: new Date("2025-03-06T03:40:05.000Z") },
                    { sender: "partner", text: "상태는 매우 양호합니다.", createdAt: new Date("2025-03-06T03:40:15.000Z") },
                    { sender: "first", text: "상담 후 연락드릴게요.", createdAt: new Date("2025-03-06T03:40:25.000Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:41:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:41:20.000Z"),
                lastMessage: "확인해보겠습니다.",
                messages: [
                    { sender: "first", text: "매물 관련 추가 정보가 있나요?", createdAt: new Date("2025-03-06T03:41:05.000Z") },
                    { sender: "partner", text: "네, 상세 정보는 홈페이지에 있습니다.", createdAt: new Date("2025-03-06T03:41:10.000Z") },
                    { sender: "first", text: "확인해보겠습니다.", createdAt: new Date("2025-03-06T03:41:20.000Z") }
                ]
            },
            {
                chatCreatedAt: new Date("2025-03-06T03:42:00.000Z"),
                lastChatAt: new Date("2025-03-06T03:42:30.000Z"),
                lastMessage: "좋은 하루 보내세요.",
                messages: [
                    { sender: "first", text: "이 매물에 대한 문의를 남깁니다.", createdAt: new Date("2025-03-06T03:42:05.000Z") },
                    { sender: "partner", text: "문의 주셔서 감사합니다.", createdAt: new Date("2025-03-06T03:42:15.000Z") },
                    { sender: "first", text: "좋은 하루 보내세요.", createdAt: new Date("2025-03-06T03:42:30.000Z") }
                ]
            }
        ];

        // 각 대화 상대별로 채팅 생성
        for (let i = 0; i < conversations.length; i++) {
            const conversation = conversations[i];
            const partner = chatPartners[i]; // 8명의 대화 상대 (인덱스 0~7)

            // Chat 생성
            const chat = await prisma.chat.create({
                data: {
                    chatUUID: generateChatUUID(),
                    userIDs: [firstUser.id, partner.id],
                    createdAt: conversation.chatCreatedAt,
                    lastChatAt: conversation.lastChatAt,
                    lastMessage: conversation.lastMessage
                }
            });
            console.log(`Chat ${i + 1} 생성 완료: ${chat.id}`);

            // 각 메시지 생성
            for (const msg of conversation.messages) {
                const senderId = msg.sender === "first" ? firstUser.id : partner.id;
                await prisma.message.create({
                    data: {
                        text: msg.text,
                        userId: senderId,
                        chat: { connect: { id: chat.id } },
                        createdAt: msg.createdAt
                    }
                });
            }
            console.log(`Chat ${i + 1} 메시지 생성 완료.`);

            // ChatUser 레코드 생성
            // user1 (firstUser)의 경우, 인덱스 0~2는 읽지 않은 상태로 설정 (lastReadAt < lastChatAt)
            let user1LastReadAt;
            if (i < 3) {
                // 아직 읽지 않음 (마지막 메시지 시각보다 5초 이전)
                user1LastReadAt = new Date(conversation.lastChatAt.getTime() - 5000);
            } else {
                // 읽은 상태 (마지막 메시지 시각보다 5초 이후)
                user1LastReadAt = new Date(conversation.lastChatAt.getTime() + 5000);
            }
            const partnerLastReadAt = new Date(conversation.lastChatAt.getTime() + 5000);

            await prisma.chatUser.create({
                data: {
                    chatId: chat.id,
                    userId: firstUser.id,
                    lastReadAt: user1LastReadAt
                }
            });
            await prisma.chatUser.create({
                data: {
                    chatId: chat.id,
                    userId: partner.id,
                    lastReadAt: partnerLastReadAt
                }
            });
            console.log(`Chat ${i + 1} ChatUser 레코드 생성 완료.`);
        }

        console.log("모든 채팅 데이터 삽입 완료.");
    } catch (error) {
        console.error("채팅 데이터 삽입 에러:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedChatMessageData();
