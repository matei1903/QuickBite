import React, { Suspense } from "react";
import styled, { createGlobalStyle } from "styled-components";
import variables from "./scripts/variables.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FirebaseProvider } from "@quick-bite/components/context/Firebase";
const Signup = React.lazy(() => import("./pages/Signup.jsx"));
const Login = React.lazy(() => import("./pages/Login.jsx"));
const Home = React.lazy(() => import("./pages/Home.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));
const router = createBrowserRouter([
  { path: "/", element: <Signup />},
  { path: "/login", element: <Login />},
  { path: "/home", element: <Home /> },
  { path: "/*", element: <NotFound /> },
]);
const GlobalStypes = createGlobalStyle`
  body {
    background: #202b1b;
    color: ${variables.primaryColor};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, fantasy;
`;
const Loader = () => <div>loading...</div>;
export default () => {
  return (
    <FirebaseProvider>
      <GlobalStypes />
      <Suspense fallback={<Loader />}>
        <RouterProvider router={router} />
      </Suspense>
    </FirebaseProvider>
  );
};