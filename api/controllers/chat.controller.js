import prisma from "../lib/prisma.js";
import { randomUUID } from 'crypto';

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

    for (const chat of chats) {
      const receiverId = chat.userIDs.find((id) => id !== tokenUserId);

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
      chat.receiver = receiver;


    }
    res.status(200).json(chats);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chats!" });
  }
};
//
// export const getChatByUserId = async (req, res) => {
//   const tokenUserId = req.userId; //현재 접속자 아이디
//
//   try {
//
//     const chat = await prisma.chat.findUnique({
//       where: {
//         getByUserId:{
//           user1Id: tokenUserId,
//           user2Id: req.query.receiver
//         }
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
//     if(chat) {
//       const receiver = await prisma.user.findUnique({
//         where: {
//           id: req.query.receiver,
//         },
//         select: {
//           id: true,
//           username: true,
//           avatar: true,
//         },
//       });
//       chat.receiver = receiver;
//
//
//       await prisma.chat.update({
//         where: {
//           getByUserId: {
//             user1Id: tokenUserId,
//             user2Id: req.query.receiver
//           }
//         },
//         data: {
//           seenBy: {
//             push: [tokenUserId],
//           },
//         },
//       });
//     }
//
//     res.status(200).json(chat);
//   } catch (err) {
//     console.log(err);
//     res.status(500).json({ message: "Failed to get chat!" });
//   }
// };


export const getChatByUserId = async (req, res) => {
  const tokenUserId = req.userId; //현재 접속자 아이디
  const userIDs = [tokenUserId, req.params.userId].sort();

  try {
    await prisma.chat.update({
      where: {
        userIDs: userIDs,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

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

    res.status(200).json(chat);

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};


//이 사람이랑 대화했던 내역이 없으면 채팅방만 만든다. 있으면 가져온다.
export const getChatOrMakeChat = async (req, res) => {
  const tokenUserId = req.userId; //현재 접속자 아이디
  const userIDs = [tokenUserId, req.params.userId].sort();

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
        },
      });

      res.status(200).json(newChat);

    }else{
      //chat의 seenBy에 현재 접속자 표시한다.
      //Message에 해당하는 Chat이 있다면, Chat의 seenBy에 현재 접속자를 push 한다.
      const isMessageExist = await prisma.message.findFirst({
        where: {
          chatId: chat.id,
        },
      });

      console.log('isMessageExist', isMessageExist);

      //message가 하나라도 있다면
      if(isMessageExist){
        //현재 접속자 Chat 봤다고 표시하기
        await updateSeenBy(chat, tokenUserId)
      }
      res.status(200).json(chat);
    }

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};

const updateSeenBy = async (chat, tokenUserId)  => {
  //현재 접속자 Chat 봤다고 표시하기
  await prisma.chat.update({
    where: {
      id: chat.id,
    },
    data: {
      seenBy: {
        push: [tokenUserId],
      },
    },
  });

}

//chat ID로 조회한다.
export const getChat = async (req, res) => {
  const tokenUserId = req.userId;
  try {

    await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });

    //여기 이상  Cannot set headers after they are sent to the client 에러 ->
    const chat = await prisma.chat.findUnique({
      where: {
        id: req.params.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to get chat!" });
  }
};


  export const addChat = async (req, res) => {
  const tokenUserId = req.userId;
  const userIDs = [tokenUserId, req.body.receiverId].sort();
    console.log('tokenUserId', tokenUserId);
    console.log('userIDs', userIDs);

  try {
    const newChat = await prisma.chat.create({
      data: {
        userIDs: userIDs,
      },
    });

    const receiverId = req.body.receiverId;

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

    newChat.receiver = receiver;

    console.log('newChat', newChat);

    res.status(200).json(newChat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to add chat!" });
  }
};

export const readChat = async (req, res) => {
  console.log('??');
  const tokenUserId = req.userId; //현재 접속자 아이디

  console.log('tokenUserId', tokenUserId);
  console.log('req.params.id', req.params.id);

  try {
    const chat = await prisma.chat.update({
      where: {
        id: req.params.id,
      },
      data: {
        seenBy: {
          push: [tokenUserId],
        },
      },
    });
    res.status(200).json(chat);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to read chat!" });
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
    console.log('chat', chat);

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


function generateChatUUID() {
  return randomUUID();
}