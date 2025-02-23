import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import Layout from "../layout/Layout";
import { HomeRouter } from "./HomeRouter";
import { WalletRouter } from "./WalletRouter";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to={"/home"} />,
      },
      HomeRouter,
      WalletRouter,
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router}></RouterProvider>;
};

export default AppRouter;
