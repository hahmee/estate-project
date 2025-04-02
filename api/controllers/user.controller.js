import prisma from "../lib/prisma.js";
import bcrypt from "bcrypt";

export const getUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.status(200).json(users);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 가져오는데 실패했습니다." });
  }
};

export const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    res.status(200).json(user);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 가져오는데 실패했습니다." });
  }
};

export const updateUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;
  const { password, avatar, ...inputs } = req.body;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  let updatedPassword = null;
  try {
    if (password) {
      updatedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        ...inputs,
        ...(updatedPassword && { password: updatedPassword }),
        ...(avatar && { avatar }),
      },
    });

    const { password: userPassword, ...rest } = updatedUser;

    res.status(200).json(rest);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 수정하는데 실패했습니다." });
  }
};

export const deleteUser = async (req, res) => {
  const id = req.params.id;
  const tokenUserId = req.userId;

  if (id !== tokenUserId) {
    return res.status(403).json({ message: "권한이 없습니다." });
  }

  try {
    await prisma.user.delete({
      where: { id },
    });
    res.status(200).json({ message: "사용자 정보가 삭제되었습니다." });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "사용자 정보를 삭제하는데 실패했습니다." });
  }
};

export const savePost = async (req, res) => {
  const postId = req.body.postId;
  const tokenUserId = req.userId;

  try {
    const savedPost = await prisma.savedPost.findUnique({
      where: {
        userId_postId: {
          userId: tokenUserId,
          postId,
        },
      },
    });

    if (savedPost) {
      await prisma.savedPost.delete({
        where: {
          id: savedPost.id,
        },
      });
      res.status(200).json({ message: "저장된 리스트에서 게시물이 삭제되었습니다." });
    } else {
      await prisma.savedPost.create({
        data: {
          userId: tokenUserId,
          postId,
        },
      });
      res.status(200).json({ message: "게시물이 저장되었습니다." });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "게시물을 저장하는데 실패했습니다." });
  }
};

export const profilePosts = async (req, res) => {
  const tokenUserId = req.userId;
  try {

    //좋아요 누른 거
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    let savedIdList = [];

    const savedPosts = saved.map((item) =>
    {
      item.post.isSaved = true;
      savedIdList = [...savedIdList, item.postId];
      return item.post;
    });

    const userPosts = await prisma.post.findMany({
      where: { userId: tokenUserId },
    });


    userPosts.forEach((post) => {
      post.isSaved = false;
      savedIdList.forEach((savedId) => {
        if(post.id === savedId) {
          post.isSaved = true;
        }
      })
    })

    res.status(200).json({ userPosts, savedPosts });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "프로필 정보를 가져오는데 실패했습니다." });
  }
};

//아직 읽히지 않은 채팅방의 개수
export const getUnreadChatNumber = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // 각 채팅방의 마지막 메시지를 찾고, 해당 메시지가 사용자가 마지막으로 읽은 시간 이후인지 확인
    const unreadChats = await prisma.chatUser.findMany({
      where: {
        userId: tokenUserId,
      },
      select: {
        chatId: true,
        lastReadAt: true,
        chat: {
          select: {
            messages: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1, // 최신 메시지 하나만 가져옴
            },
          },
        },
      },
    });

    // 아직 읽지 않은 채팅방 개수 계산
    const unreadChatId = unreadChats.filter(chatUser => {
      const lastMessage = chatUser.chat.messages[0];
      return lastMessage && lastMessage.createdAt > chatUser.lastReadAt;
    }).map(chatUser => chatUser.chatId);


    return res.json(unreadChatId);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: '서버 오류' });
  }
};


export const getSavedPosts = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    const saved = await prisma.savedPost.findMany({
      where: { userId: tokenUserId },
      include: {
        post: true,
      },
    });

    return res.status(200).json(saved);
  } catch (err) {
    res.status(500).json({ message: "저장된 포스트를 가져오는데 실패했습니다." });
  }

}

//현재 사용자의 채팅방에 있는 유저들 가져온다.
export const getReceivers = async (req, res) => {
  const tokenUserId = req.userId;

  try {
    // 유저가 속한 모든 채팅방의 상대방들을 조회
    const chats = await prisma.chat.findMany({
      where: {
        userIDs: {
          has: tokenUserId, // userIDs 배열에 특정 userId가 포함된 채팅방 조회
        },
      },
    });

    // new Set 중복 제거, flatMap 배열 평탄화 (배열 하나로)
    const receiverList = Array.from(
        new Set(
            chats.flatMap(chat => chat.userIDs.filter(userId => userId !== tokenUserId))
        )
    );

    return res.status(200).json(receiverList);

  } catch (err) {
    res.status(500).json({ message: "저장된 포스트를 가져오는데 실패했습니다." });
  }

}