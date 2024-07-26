import HomePage from "./routes/homePage/homePage";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import ListPage from "./routes/listPage/listPage";
import {CreateProcess, Layout, RequireAuth} from "./routes/layout/layout";
import SinglePage from "./routes/singlePage/singlePage";
import ProfilePage from "./routes/profilePage/profilePage";
import Login from "./routes/login/login";
import Register from "./routes/register/register";
import ProfileUpdatePage from "./routes/profileUpdatePage/profileUpdatePage";
import NewPostPage from "./routes/newPostPage/newPostPage";
import {chatPageLoader, messagePageLoader, profilePageLoader, singlePageLoader} from "./lib/loaders";
import NewChatPage from "./routes/newChatPage/NewChatPage.jsx";
import NewLocationPage from "./routes/newLocationPage/newLocationPage.jsx";
import UpdatePage from "./routes/updatePage/updatePage.jsx";
import MessagePage from "./routes/messagePage/messagePage.jsx";

function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "/list",
          element: <ListPage />,
          // loader: listPageLoader,
        },
        {
          path: "read/:id",
          element: <SinglePage/>,
          loader: singlePageLoader,
        },
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/register",
          element: <Register />,
        },
      ],
    },
    {
      path: "/",
      element: <CreateProcess />,
      children: [
        {
          path: "/location",
          element: <NewLocationPage/>,
        },
        {
          path: "/add",
          element: <NewPostPage />,
        },
        {
          path: "update/:id",
          element: <UpdatePage />,
          loader: singlePageLoader,
        },
        {
          path: "/profile/update",
          element: <ProfileUpdatePage />,
        },
        ]
    },
    {
      path: "/",
      element: <RequireAuth />,
      children: [
        {
          path: "/profile",
          element: <ProfilePage />,
          loader: profilePageLoader
        },
        {
          path: "/messages",
          element: <MessagePage />,
          loader: messagePageLoader
        },
        {
          path: "/messages/:userId",
          element: <MessagePage />,
          loader: messagePageLoader
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
          path:"/chat",
          element: <NewChatPage/>,
          loader: chatPageLoader
        }
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
