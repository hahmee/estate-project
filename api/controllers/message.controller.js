import prisma from "../lib/prisma.js";

export const addMessage = async (req, res) => {
  console.log('add')
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  const text = req.body.text;

  try {
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
        // userIDs: {
        //   hasSome: [tokenUserId],
        // },
        // userIDs: {
        //   hasSome: [tokenUserId],
        // },
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
        seenBy: [tokenUserId],
        lastMessage: text,
        lastChatAt: new Date(), // 현재 시간으로 업데이트
      },
    });

    res.status(200).json({message: message, chat: updatedChat});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add message!" });
  }
};
