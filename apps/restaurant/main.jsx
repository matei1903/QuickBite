import React from "react";
import { createRoot } from "react-dom/restaurant";

const App = React.lazy(() => import("./App.jsx"));

createRoot(document.getElementById("root")).render(<App />);