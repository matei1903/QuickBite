import React, { Suspense } from "react";
import styled, { createGlobalStyle } from "styled-components";
import variables from "./scripts/variables.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FirebaseProvider } from "@quick-bite/components/context/Firebase";
const Login = React.lazy(() => import("./pages/Login.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));
const Menu = React.lazy(() => import("./pages/Menu.jsx"));
const Comenzi = React.lazy(() => import("./pages/Comenzi.jsx"));
const router = createBrowserRouter([
  { path: "/", element: <Login />},
  { path: "/Menu", element: <Menu /> },
  { path: "/Comenzi/:masa", element: <Comenzi /> },
  { path: "/*", element: <NotFound /> },
  
]);
const GlobalStypes = createGlobalStyle`
  body {
    background: #192440;
    color: ${variables.primaryColor};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif, fantasy;
  }
 
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