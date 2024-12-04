import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const postPromise = await apiRequest("/posts/" + params.id);
  const writerId = postPromise.data.userId;
  console.log('writerId', writerId);
  // const chatUUIDPromise = await apiRequest.get("/chats/chatUUID/" + writerId); //채팅방 아이디 가져오기

  // console.log('chatUUIDPromise', chatUUIDPromise);
  return defer({
    postResponse: postPromise,
    // chatUUIDResponse: chatUUIDPromise,
  });
};


export const messagePageLoader = async ({request, params}) => {

  const {userId} = params;
  const resWriterPromise = await apiRequest("/users/search/" + userId); //글쓴사람 정보
  //이 사람이랑 대화했던 내역이 없으면 채팅방만 만든다. 있으면 가져온다.
  const resChatPromise = await apiRequest.get("/chats/checkUserId/" + userId);
  //왼쪽 모든 채팅방 목록을 가져온다. (최신순으로)
  //순서 resChatPromise -> resChatListPromise
  const resChatListPromise = await apiRequest.get("/chats");
  console.log('resChatsPromise',resChatListPromise)
  console.log('resUserPromise',resWriterPromise)

  console.log('resChatPromise',resChatPromise)

  return defer({
    resWriterPromise: resWriterPromise,
    resChatListResponse: resChatListPromise,
    resChatResponse: resChatPromise,
  });
};


// export const listPageLoader = async ({ request, params }) => {
//   const query = request.url.split("?")[1];
//   console.log('query', query);
//   const postPromise = apiRequest("/posts?" + query);
//   return defer({
//     postResponse: postPromise,
//   });
// };

export const wishPageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  return defer({
    postResponse: postPromise,
  });
};

export const profilePageLoader = async () => {
  const postPromise = apiRequest("/users/profilePosts");
  // const chatPromise = apiRequest("/chats");
  return defer({
    postResponse: postPromise,
    // chatResponse: chatPromise,
  });
};

export const chatPageLoader = async ({ request, params }) => {
  const query = request.url.split("=")[1];
  const chatByUserIdPromise = apiRequest("/chats/userId?receiver="+ query);
  const userPromise = apiRequest("/users/search/"+ query);
  return defer({
    chatByUserIdResponse: chatByUserIdPromise,
    userDataResponse: userPromise
  });
};
//
// export const messagePageLoader = async ({ request, params }) => {
//   const userId = params.userId;
//   const chatPromise = apiRequest("/chats");
//   const userPromise = userId ? apiRequest("/users/search/" + userId) : null;
//
//   console.log('userId', userId);
//
//   return defer({
//     chatResponse: chatPromise,
//     userResponse: userPromise,
//   });
// };


