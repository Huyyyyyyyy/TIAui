import { RouteObject } from "react-router";
import HomePage from "../pages/HomePage";

export const HomeRouter: RouteObject = {
  index: true,
  path: "/home",
  element: <HomePage />,
};
