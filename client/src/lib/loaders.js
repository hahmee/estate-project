import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const homePageLoader = async ({request, params}) => {
  const featuredPromise = await apiRequest("/posts/featuredItems");

  return defer({
    featuredResponse: featuredPromise,
  });
};

export const singlePageLoader = async ({ request, params }) => {
  const postPromise = await apiRequest("/posts/" + params.id);

  return defer({
    postResponse: postPromise,
  });

  // try {
  //   const postPromise = await apiRequest("/posts/" + params.id);
  //   return defer({
  //     postResponse: postPromise,
  //   });
  // } catch (error) {
  //   // 에러를 처리하여 메시지나 에러 객체를 반환합니다.
  //   console.error("Error fetching post:", error);
  //
  //   // 에러 페이지로 리다이렉트하거나 에러 데이터를 반환합니다.
  //   throw new Response("포스트를 불러오는데 실패했습니다.", {
  //     status: 500,
  //     statusText: "Internal Server Error",
  //   });
  // }
};


export const messagePageLoader = async ({request, params}) => {

  const {userId} = params;

  if (!userId) { //userId 가 undefined
    //리스트를 다 보여준다.
    const resChatListPromise = await apiRequest.get("/chats");

    return defer({
      resWriterResponse: null,
      resChatListResponse: resChatListPromise,
      resChatResponse: null,
      // resReceiverUnreadCountResponse: null,
    });

  }else {
    const resWriterPromise = await apiRequest("/users/search/" + userId); //글쓴사람 정보
    //이 사람이랑 대화했던 내역이 없으면 채팅방만 만든다. 있으면 가져온다.
    const resChatPromise = await apiRequest.get("/chats/getChatOrMakeChat/" + userId);
    //왼쪽 모든 채팅방 목록을 가져온다. (최신순으로)
    //순서 resChatPromise -> resChatListPromise
    const resChatListPromise = await apiRequest.get("/chats");



    // 첫 번째 키를 동적으로 가져와서 chatId 추출
    // const firstKey = Object.keys(resChatPromise.data)[0];
    // const chatId = resChatPromise.data[firstKey][0].chatId.toString();
    //상대방이 안 읽은 메시지 개수
    // const resReceiverUnreadCountPromise = await apiRequest.get(`/chats/getReceiverUnreadCount?receiverId=${userId}&chatId=${chatId}`);

    // console.log('resReceiverUnreadCountPromise', resReceiverUnreadCountPromise);

    return defer({
      resWriterResponse: resWriterPromise,
      resChatListResponse: resChatListPromise,
      resChatResponse: resChatPromise,
      // resReceiverUnreadCountResponse: resReceiverUnreadCountPromise,
    });

  }


};


export const wishPageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};



