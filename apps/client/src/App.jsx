import * as React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import NotFound from "./pages/NotFound.jsx";
import Home from "./pages/Home.jsx";
import { FirebaseProvider } from '@quick-bite/shared/context/Firebase';

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/*",
    element: <NotFound />,
  },
]);

export default () => {
  return (
    <div className="customTheme1">
      <FirebaseProvider><RouterProvider router={router} /></FirebaseProvider>

    </div>
  );
};