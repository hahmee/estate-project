// initChatMessage.js
import prisma from "./prisma.js";
import 'dotenv/config';
import {generateChatUUID} from "../controllers/chat.controller.js";

async function seedChatMessageData() {
    try {
        // 기존 채팅 관련 데이터 삭제 (Chat, Message, ChatUser)
        await prisma.message.deleteMany({});
        await prisma.chatUser.deleteMany({});
        await prisma.chat.deleteMany({});
        console.log("기존 채팅 관련 데이터 삭제 완료.");

        // 가장 먼저 생성된 유저(첫번째 유저)와 대화 상대용 2명의 유저 조회
        const users = await prisma.user.findMany({
            select: { id: true },
            orderBy: { createdAt: "asc" }
        });
        if (users.length < 4) {
            throw new Error("채팅 데이터를 생성하려면 최소 4명의 유저가 필요합니다.");
        }

        const firstUser = users[0];
        const secondUser = users[1];
        const thirdUser = users[2];
        const fourthUser = users[3];

        // ── Chat 1: 첫번째 유저와 두번째 유저 간의 대화 ──
        const chat1CreatedAt = new Date("2025-03-05T03:43:54.908Z");
        const chat1 = await prisma.chat.create({
            data: {
                chatUUID: generateChatUUID(),
                userIDs: [firstUser.id, secondUser.id],
                createdAt: chat1CreatedAt,
                lastChatAt: chat1CreatedAt,
            }
        });
        console.log("Chat 1 생성 완료:", chat1.id);

        // Chat 1 메시지 (첫번째 유저가 문의, 두번째 유저가 답변)
        await prisma.message.create({
            data: {
                text: "안녕하세요, 이 매물에 대해 문의드립니다. 상세 정보와 사진을 볼 수 있을까요?",
                userId: firstUser.id,
                chat: { connect: { id: chat1.id } },
                createdAt: new Date("2025-03-05T03:45:00.000Z")
            }
        });
        await prisma.message.create({
            data: {
                text: "안녕하세요, 해당 매물은 최근 리모델링이 완료되었고, 추가 사진은 별도로 제공됩니다.",
                userId: secondUser.id,
                chat: { connect: { id: chat1.id } },
                createdAt: new Date("2025-03-05T03:46:00.000Z")
            }
        });
        console.log("Chat 1 메시지 생성 완료.");

        // Chat 1 참여자(ChatUser) 기록 생성
        await prisma.chatUser.create({
            data: {
                chatId: chat1.id,
                userId: firstUser.id,
                lastReadAt: new Date("2025-03-05T03:45:10.000Z")
            }
        });
        await prisma.chatUser.create({
            data: {
                chatId: chat1.id,
                userId: secondUser.id,
                lastReadAt: new Date("2025-03-05T03:46:10.000Z")
            }
        });
        console.log("Chat 1 ChatUser 레코드 생성 완료.");

        // ── Chat 2: 첫번째 유저와 세번째 유저 간의 대화 ──
        const chat2CreatedAt = new Date("2025-03-05T05:14:53.701Z");
        const chat2LastChatAt = new Date("2025-03-05T05:45:20.152Z");
        const chat2 = await prisma.chat.create({
            data: {
                chatUUID: generateChatUUID(),
                userIDs: [firstUser.id, thirdUser.id],
                createdAt: chat2CreatedAt,
                lastChatAt: chat2LastChatAt,
                lastMessage: "감사합니다, 답변 기다리고 있겠습니다."
            }
        });
        console.log("Chat 2 생성 완료:", chat2.id);

        // Chat 2 메시지 (첫번째 유저의 문의와 세번째 유저의 답변, 추가 문의)
        await prisma.message.create({
            data: {
                text: "매물의 위치가 정확히 어디인지 알려주실 수 있나요?",
                userId: firstUser.id,
                chat: { connect: { id: chat2.id } },
                createdAt: new Date("2025-03-05T05:15:00.000Z")
            }
        });
        await prisma.message.create({
            data: {
                text: "물론입니다. 해당 매물은 서울 강남구 중심에 위치해 있으며, 주변 편의시설도 잘 갖춰져 있습니다.",
                userId: thirdUser.id,
                chat: { connect: { id: chat2.id } },
                createdAt: new Date("2025-03-05T05:30:00.000Z")
            }
        });
        await prisma.message.create({
            data: {
                text: "감사합니다, 답변 기다리고 있겠습니다.",
                userId: firstUser.id,
                chat: { connect: { id: chat2.id } },
                createdAt: new Date("2025-03-05T05:45:00.000Z")
            }
        });
        console.log("Chat 2 메시지 생성 완료.");

        // Chat 2 참여자(ChatUser) 기록 생성
        await prisma.chatUser.create({
            data: {
                chatId: chat2.id,
                userId: firstUser.id,
                lastReadAt: new Date("2025-03-05T05:45:10.000Z")
            }
        });
        await prisma.chatUser.create({
            data: {
                chatId: chat2.id,
                userId: thirdUser.id,
                lastReadAt: new Date("2025-03-05T05:45:20.152Z")
            }
        });
        console.log("Chat 2 ChatUser 레코드 생성 완료.");



        //

        console.log("모든 채팅 데이터 삽입 완료.");
    } catch (error) {
        console.error("채팅 데이터 삽입 에러:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedChatMessageData();
