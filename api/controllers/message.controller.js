import prisma from "../lib/prisma.js";
import {updateRead} from "./chat.controller.js";

//메지시를 추가한다.
export const addMessage = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
      },
    });

    if (!chat) return res.status(404).json({ message: "Chat not found!" });

    const message = await prisma.message.create({
      data: {
        text,
        chatId,
        userId: tokenUserId,
      },
    });

     const updatedChat =  await prisma.chat.update({
      where: {
        id: chatId,
      },
      data: {
        lastMessage: text,
        lastChatAt: new Date(), // 현재 시간으로 업데이트
      },
    });


    await updateRead(chatId, tokenUserId);
     //읽었다고도 표시한다.

    res.status(200).json({message: message, chat: updatedChat});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
