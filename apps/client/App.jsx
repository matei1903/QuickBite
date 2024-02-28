import React, { Suspense } from "react";
import styled, { createGlobalStyle } from "styled-components";
import variables from "./scripts/variables.js";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { FirebaseProvider } from "@quick-bite/components/context/Firebase";
const Home = React.lazy(() => import("./pages/Home.jsx"));
const NotFound = React.lazy(() => import("./pages/NotFound.jsx"));
const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/*", element: <NotFound /> },
]);
const GlobalStypes = createGlobalStyle`
  body {
    background: #2a606c;
    color: ${variables.primaryColor};
    font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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