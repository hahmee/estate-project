import HomePage from "./routes/homePage/homePage";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import { CommonLayout, CreateProcess, Layout } from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import { homePageLoader, messagePageLoader, profilePageLoader, singlePageLoader, wishPageLoader } from "./lib/loaders";
import NewLocationPage from "./routes/newLocationPage/newLocationPage.jsx";
import UpdatePage from "./routes/updatePage/updatePage.jsx";
import MessagePage from "./routes/messagePage/messagePage.jsx";
import RedirectNaverURI from "./routes/redirect/redirectNaverURI.jsx";
import WishPage from "./routes/wish/wishPage.jsx";
import NotFoundPage from "./routes/notFound/notFoundPage.jsx";
import ErrorPage from "./routes/error/errorPage.jsx";

function App() {
  const router = createBrowserRouter([
    // 홈, 읽기 페이지 등: isSearchBar true, isFooter true
    {
      path: "/",
      element: (
          <CommonLayout isSearchBar={true} isLoginCheck={true}>
            <Layout isFooter={true} />
          </CommonLayout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <HomePage />,
          loader: homePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "read/:id",
          element: <SinglePage />,
          loader: singlePageLoader,
          errorElement: <ErrorPage />,
        },
      ],
    },
    // /list 경로: isSearchBar true, isFooter false
    {
      path: "/list",
      element: (
          <CommonLayout isSearchBar={true} isLoginCheck={true}>
            <Layout isFooter={false} />
          </CommonLayout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          index: true,
          element: <ListPage />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    // 로그인, 회원가입 페이지: isLoginLayout true, 기타 false
    {
      path: "/",
      element: (
          <CommonLayout isSearchBar={false} isLoginCheck={false} isLoginLayout>
            <Layout />
          </CommonLayout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/login",
          element: <Login />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/register",
          element: <Register />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    // 위치, 새 포스트, 업데이트, 프로필 업데이트 등
    {
      path: "/",
      element: (
          <CommonLayout isSearchBar={false} isLoginCheck={true}>
            <CreateProcess />
          </CommonLayout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/location",
          element: <NewLocationPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "/add",
          element: <NewPostPage />,
          errorElement: <ErrorPage />,
        },
        {
          path: "update/:id",
          element: <UpdatePage />,
          loader: singlePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    // 프로필, 메시지, 위시 페이지
    {
      path: "/",
      element: (
          <CommonLayout isSearchBar={false} isLoginCheck={true}>
            <Layout isFooter={false} />
          </CommonLayout>
      ),
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/messages",
          element: <MessagePage />,
          loader: messagePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/messages/:userId",
          element: <MessagePage />,
          loader: messagePageLoader,
          errorElement: <ErrorPage />,
        },
        {
          path: "/wish",
          element: <WishPage />,
          loader: wishPageLoader,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "/redirectURI",
          element: <RedirectNaverURI />,
          errorElement: <ErrorPage />,
        },
      ],
    },
    {
      path: "*",
      element: <NotFoundPage />,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
