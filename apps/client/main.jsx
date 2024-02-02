import React from "react";
import { createRoot } from "react-dom/client";

const App = React.lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(<App />);