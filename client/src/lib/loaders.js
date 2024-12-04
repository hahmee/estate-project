import { defer } from "react-router-dom";
import apiRequest from "./apiRequest";

export const singlePageLoader = async ({ request, params }) => {
  const res = await apiRequest("/posts/" + params.id);
  return res.data;
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

export const messagePageLoader = async ({request, params}) => {

  const userId = params.userId;
  const resUserPromise = await apiRequest("/users/search/" + userId); //글쓴사람 정보
  const resChatsPromise = await apiRequest.get("/chats");
  const isChatExistPromise = await apiRequest.get("/chats/checkUserId/" + resUserPromise.data.id); //이 사람이랑 대화했던 내역 있는지
  console.log('resUserPromise',resUserPromise)
  console.log('resChatsPromise',resChatsPromise)
  console.log('isChatExistPromise',isChatExistPromise)

  return defer({
    resUserResponse: resUserPromise,
    resChatsResponse: resChatsPromise,
    isChatExistResponse: isChatExistPromise,
  });
};


