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
        //
        // // 최소 8명의 유저가 필요 (첫번째 유저 + 7명의 대화 상대)
        // const users = await prisma.user.findMany({
        //     select: { id: true },
        //     orderBy: { createdAt: "asc" }
        // });
        // if (users.length < 8) {
        //     throw new Error("채팅 데이터를 생성하려면 최소 8명의 유저가 필요합니다.");
        // }
        //
        // const firstUser = users[0];
        // // 대화 상대: 두번째부터 8번째 유저 (총 7명)
        // const chatPartners = users.slice(1, 8);
        //
        // // 각 대화별 설정 (생성일, 메시지 내역 등)
        // const conversations = [
        //     {
        //         chatCreatedAt: new Date("2025-03-05T03:43:54.908Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "안녕하세요, 이 매물에 대해 문의드립니다. 상세 정보와 사진을 볼 수 있을까요?",
        //                 createdAt: new Date("2025-03-05T03:45:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "안녕하세요, 해당 매물은 최근 리모델링이 완료되었고, 추가 사진은 별도로 제공됩니다.",
        //                 createdAt: new Date("2025-03-05T03:46:00.000Z")
        //             }
        //         ]
        //     },
        //     {
        //         chatCreatedAt: new Date("2025-03-05T05:14:53.701Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "매물의 위치가 정확히 어디인지 알려주실 수 있나요?",
        //                 createdAt: new Date("2025-03-05T05:15:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "물론입니다. 해당 매물은 서울 강남구 중심에 위치해 있으며, 주변 편의시설도 잘 갖춰져 있습니다.",
        //                 createdAt: new Date("2025-03-05T05:30:00.000Z")
        //             },
        //             {
        //                 sender: "first",
        //                 text: "감사합니다, 답변 기다리고 있겠습니다.",
        //                 createdAt: new Date("2025-03-05T05:45:00.000Z")
        //             }
        //         ]
        //     },
        //     {
        //         chatCreatedAt: new Date("2025-03-06T09:20:00.000Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "이 매물의 가격은 협상 가능한가요?",
        //                 createdAt: new Date("2025-03-06T09:21:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "네, 가격 협상은 가능합니다. 자세한 조건은 상담 후 결정됩니다.",
        //                 createdAt: new Date("2025-03-06T09:30:00.000Z")
        //             }
        //         ]
        //     },
        //     {
        //         chatCreatedAt: new Date("2025-03-06T11:00:00.000Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "추가 사진을 받아볼 수 있을까요?",
        //                 createdAt: new Date("2025-03-06T11:01:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "네, 추가 사진은 이메일로 보내드리겠습니다.",
        //                 createdAt: new Date("2025-03-06T11:05:00.000Z")
        //             }
        //         ]
        //     },
        //     {
        //         chatCreatedAt: new Date("2025-03-07T08:30:00.000Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "매물의 관리비는 얼마인가요?",
        //                 createdAt: new Date("2025-03-07T08:31:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "관리비는 매달 30만원 정도 예상됩니다.",
        //                 createdAt: new Date("2025-03-07T08:35:00.000Z")
        //             }
        //         ]
        //     },
        //     {
        //         chatCreatedAt: new Date("2025-03-07T10:00:00.000Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "매물 방문 예약을 잡고 싶습니다.",
        //                 createdAt: new Date("2025-03-07T10:01:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "예약 확인 후 일정 조율해드리겠습니다.",
        //                 createdAt: new Date("2025-03-07T10:10:00.000Z")
        //             }
        //         ]
        //     },
        //     {
        //         chatCreatedAt: new Date("2025-03-07T12:15:00.000Z"),
        //         messages: [
        //             {
        //                 sender: "first",
        //                 text: "상세 정보와 함께 근처 학교 정보도 부탁드려요.",
        //                 createdAt: new Date("2025-03-07T12:16:00.000Z")
        //             },
        //             {
        //                 sender: "partner",
        //                 text: "주변에 좋은 학교들이 있습니다. 자세한 정보는 상담 후 안내해드리겠습니다.",
        //                 createdAt: new Date("2025-03-07T12:20:00.000Z")
        //             }
        //         ]
        //     }
        // ];
        //
        // // conversations 배열의 각 항목마다 첫번째 유저와 대화 상대 간의 채팅 생성
        // for (let i = 0; i < conversations.length; i++) {
        //     const conversation = conversations[i];
        //     const partner = chatPartners[i]; // 7개의 대화 상대 (인덱스 0 ~ 6)
        //
        //     // 마지막 메시지 정보를 기반으로 lastChatAt 및 lastMessage 설정
        //     const lastMsg = conversation.messages[conversation.messages.length - 1];
        //
        //     const chat = await prisma.chat.create({
        //         data: {
        //             chatUUID: generateChatUUID(),
        //             userIDs: [firstUser.id, partner.id],
        //             createdAt: conversation.chatCreatedAt,
        //             lastChatAt: lastMsg.createdAt,
        //             lastMessage: lastMsg.text
        //         }
        //     });
        //     console.log(`Chat ${i + 1} 생성 완료:`, chat.id);
        //
        //     // 각 메시지 생성
        //     for (const msg of conversation.messages) {
        //         const senderId = msg.sender === "first" ? firstUser.id : partner.id;
        //         await prisma.message.create({
        //             data: {
        //                 text: msg.text,
        //                 userId: senderId,
        //                 chat: { connect: { id: chat.id } },
        //                 createdAt: msg.createdAt
        //             }
        //         });
        //     }
        //     console.log(`Chat ${i + 1} 메시지 생성 완료.`);
        //
        //     // ChatUser 기록 생성 (각 사용자별로 마지막 읽은 시간은 마지막 메시지 시간에 약 10초를 더한 값 사용)
        //     const partnerLastReadAt = new Date(lastMsg.createdAt.getTime() + 10000);
        //     await prisma.chatUser.create({
        //         data: {
        //             chatId: chat.id,
        //             userId: firstUser.id,
        //             lastReadAt: partnerLastReadAt
        //         }
        //     });
        //     await prisma.chatUser.create({
        //         data: {
        //             chatId: chat.id,
        //             userId: partner.id,
        //             lastReadAt: partnerLastReadAt
        //         }
        //     });
        //     console.log(`Chat ${i + 1} ChatUser 레코드 생성 완료.`);
        // }
        //
        // console.log("모든 채팅 데이터 삽입 완료.");
    } catch (error) {
        console.error("채팅 데이터 삽입 에러:", error);
    } finally {
        await prisma.$disconnect();
    }
}

seedChatMessageData();
