import HomePage from "./routes/homePage/homePage";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import {CommonLayout, CreateProcess, Layout, RequireAuth,} from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import {chatPageLoader, profilePageLoader, singlePageLoader} from "./lib/loaders";
import NewChatPage from "./routes/newChatPage/NewChatPage.jsx";
import NewLocationPage from "./routes/newLocationPage/newLocationPage.jsx";
import UpdatePage from "./routes/updatePage/updatePage.jsx";
import MessagePage from "./routes/messagePage/messagePage.jsx";
import RedirectNaverURI from "./routes/redirect/redirectNaverURI.jsx";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <CommonLayout isSearchBar={true} isLoginCheck = {true}><Layout/></CommonLayout>,
      children: [
        {
          path: "/",
          element: <HomePage/>,
        },
        {
          path: "/list",
          element: <ListPage/>,
          // loader: listPageLoader,
        },
        {
          path: "read/:id",
          element: <SinglePage/>,
          loader: singlePageLoader,
        },
      ],
    },
    {
      path: "/",
      element: <CommonLayout isSearchBar={false} isLoginCheck = {false}><Layout/></CommonLayout>,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ]
    },
    {
      path: "/",
      element: <CommonLayout isSearchBar={false} isLoginCheck = {true}><CreateProcess/></CommonLayout>,
      children: [
        {
          path: "/location",
          element: <NewLocationPage/>,
        },
        {
          path: "/add",
          element: <NewPostPage/>,
        },
        {
          path: "update/:id",
          element: <UpdatePage/>,
          loader: singlePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage/>,
        },
      ]
    },
    {
      path: "/",
      element: <CommonLayout isSearchBar={false}><RequireAuth/></CommonLayout>,
      children: [
        {
          path: "/profile",
          element: <ProfilePage/>,
          loader: profilePageLoader
        },
        {
          path: "/messages",
          element: <MessagePage/>,
          // loader: messagePageLoader
        },
        {
          path: "/messages/:userId",
          element: <MessagePage/>,
          // loader: messagePageLoader
        },
        // {
        //   path: "/messages/:userId",
        //   element: <MessagePage />,
        //   loader: messagePageLoader
        // },
        // {
        //   path: "/profile/update",
        //   element: <ProfileUpdatePage />,
        // },
        // {
        //   path: "/location",
        //   element: <NewLocationPage />,
        // },
        // {
        //   path: "/add",
        //   element: <NewPostPage />,
        // },
        {
          path: "/chat",
          element: <NewChatPage/>,
          loader: chatPageLoader
        }
      ],
    },
    {
      path: "/",
      children: [
        {
          path: "/redirectURI",
          element: <RedirectNaverURI/>,
        },
      ]
    }
  ]);

  return <RouterProvider router={router}/>;
}

export default App;
