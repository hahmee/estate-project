import prisma from "../lib/prisma.js";
import {randomUUID} from 'crypto';

//채팅방 리스트 (왼쪽) 가져온다.
export const getChats = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          hasSome: [tokenUserId],
        },
      },
      orderBy: {
        lastChatAt: 'desc',
      },
    });

    const chatsWithUnreadMessagesAndReceiver = await Promise.all(
        chats.map(async (chat) => {
          //사용자가 해당하는 채팅 마지막 읽은 시간을 가져온다.
          const chatUser = await prisma.chatUser.findUnique({
            where: {userId_chatId: {userId: tokenUserId, chatId: chat.id}},
            select: {lastReadAt: true},
          });

          // 기본값 설정: lastReadAt이 없으면 유효하지 않은 날짜 대신 Date(0)으로 처리
          const lastReadAt = chatUser?.lastReadAt || new Date(0);

          //안 읽은 메시지 카운트
          const unreadMessagesCount = await prisma.message.count({
            where: {
              chatId: chat.id,
              createdAt: {
                gt: lastReadAt,
              },
              NOT: {
                userId: tokenUserId, // 본인이 작성한 메시지는 제외
              },
            },
          });

          const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

          //수신자 정보
          const receiver = await prisma.user.findUnique({
            where: {
              id: receiverId,
            },
            select: {
              id: true,
              username: true,
              avatar: true,
            },
          });

          return {
            ...chat,
            unreadMessagesCount,
            receiver
          };
        })
    );
    res.status(200).json(chatsWithUnreadMessagesAndReceiver);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};

//대화 상대방이 안 읽은 개수를 가져온다.
export const getReceiverUnreadCount = async (req, res) => {
  const { receiverId, chatId } = req.query;
  console.log(receiverId);
  try {

    //사용자가 해당하는 채팅 마지막 읽은 시간을 가져온다.
    const chatUser = await prisma.chatUser.findUnique({
      where: {userId_chatId: {userId: receiverId, chatId}},
      select: {lastReadAt: true},
    });

    // 기본값 설정: lastReadAt이 없으면 유효하지 않은 날짜 대신 Date(0)으로 처리
    const lastReadAt = chatUser?.lastReadAt || new Date(0);

    //안 읽은 메시지 카운트
    const unreadMessagesCount = await prisma.message.count({
      where: {
        chatId: chatId,
        createdAt: {
          gt: lastReadAt,
        },
        NOT: {
          userId: receiverId, // 상대방이 작성한 메시지는 제외
        },
      },
    });

    return res.status(200).json(unreadMessagesCount);

  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Failed to get chat!"});
  }


}
//이 사람이랑 대화했던 내역이 없으면 채팅방만 만든다.
// 대화내역이 있으면 가져온다.
export const getChatOrMakeChat = async (req, res) => {
  const tokenUserId = req.userId; //현재 접속자 아이디
  const userIDs = [tokenUserId, req.params.userId].sort(); //나중에 여러명일 수 있음.

  try {

    //url의 userId가 존재하는 회원인지 체크 (url에 아무거나 입력해서 들어올 수 있으므로)
    const isValidUser = await prisma.user.findUnique({
      where: {id: req.params.userId },
    });

    if (!isValidUser) {
      return res.status(400).json({ message: 'Invalid user' });  // 예외 던지지 않고 바로 응답 반환
    }

    const chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: userIDs, //Every value exists in the list.
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });
    if(!chat) {
      //채팅방 없으면 채팅방 만든다.
      const newChat = await prisma.chat.create({
        data: {
          userIDs: userIDs,
          chatUUID: generateChatUUID(),
          chatUsers: {
            create: userIDs.map((userId) => ({
              userId,
              lastReadAt: new Date(),  // 각 사용자의 `lastReadAt`을 현재 시간으로 설정
            })),
          },
        },
      });

      // 메시지를 날짜별로 그룹화해서 보낸다.
      const groupedMessages = newChat.messages?.reduce((acc, message) => {
        const dateKey = message.createdAt.toLocaleDateString('en-CA'); // 날짜만 추출 (YYYY-MM-DD)
        if (!acc[dateKey]) {
          acc[dateKey] = []; // 날짜 그룹 초기화
        }
        acc[dateKey].push(message); // 해당 날짜 그룹에 메시지 추가
        return acc;
      }, {});


      res.status(200).json(groupedMessages);

    }else{

      // 메시지를 날짜별로 그룹화해서 보낸다.
      const groupedMessages = chat.messages.reduce((acc, message) => {
        const dateKey = message.createdAt.toLocaleDateString('en-CA'); // 날짜만 추출 (YYYY-MM-DD)
        if (!acc[dateKey]) {
          acc[dateKey] = []; // 날짜 그룹 초기화
        }
        acc[dateKey].push(message); // 해당 날짜 그룹에 메시지 추가
        return acc;
      }, {});


      //message가 하나라도 있다면
      //현재 접속자 Chat 봤다고 표시한다.
      const isMessageExist = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
        },
      });
      //message가 하나라도 있다면
      if(isMessageExist){
        //현재 접속자 Chat 봤다고 표시하기
        await updateRead(chat.id, tokenUserId)
      }
      res.status(200).json(groupedMessages);
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

// 특정 사용자 Chat 봤다고 표시하기
export const updateRead = async (chatId, userId)  => {
  await prisma.chatUser.update({
    where: {
      userId_chatId: {
        chatId: chatId,  // 채팅방 ID
        userId: userId,    // 사용자 ID
      },
    },
    data: {
      lastReadAt: new Date(), //현재 시간
    },
  });

}
//
// //chat ID로 조회한다.
// export const getChat = async (req, res) => {
//   const tokenUserId = req.userId;
//   try {
//
//     await prisma.chat.update({
//       where: {
//         id: req.params.id,
//       },
//       data: {
//         seenBy: {
//           push: [tokenUserId],
//         },
//       },
//     });
//
//     //여기 이상  Cannot set headers after they are sent to the client 에러 ->
//     const chat = await prisma.chat.findUnique({
//       where: {
//         id: req.params.id,
//       },
//       include: {
//         messages: {
//           orderBy: {
//             createdAt: "asc",
//           },
//         },
//       },
//     });
//
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chat!" });
//   }
// };

// 읽었다고 표시한다.
export const readChatUser = async (req, res) => {
  const tokenUserId = req.userId;
  const chatId = req.params.chatId;
  try {
    await updateRead(chatId, tokenUserId);
    res.status(200).json({ message: "Success to update chatUser!" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to update chatUser!" });
  }
};

// userid로 Chat 아이디 찾기
export const getChatUUID = async (req, res) => {
  const tokenUserId = req.userId; //현재 접속자 아이디
  const userIDs = [tokenUserId, req.params.userId].sort();

  try {

    const chat = await prisma.chat.findFirst({
      where: {
        userIDs: {
          hasEvery: userIDs, //Every value exists in the list.
        },
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    if(chat){
      res.status(200).json({chatId: chat.chatUUID});

    }else{ //채팅방이 없다면 null 반환
      res.status(200).json({chatId: null});
    }


  } catch (err) {
    console.log(err);
    res.status(500).json({message: "Failed to get chat id!"});
  }
};


export function generateChatUUID() {
  return randomUUID();
}