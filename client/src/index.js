import { createRoot } from "react-dom/client";
import App from "./App.js";
import "./index.css";
import "./App.css";

const root = createRoot(document.getElementById("react-container"));

root.render(<App />);
