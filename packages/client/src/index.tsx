import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import GlobalStyles from "./GlobalStyles";
import "./styles.css";

const container = document.getElementById("root");
const root = createRoot(container!); // `!` asserts that container is not null
root.render(
  <>
    <GlobalStyles />
    <App />
  </>
);
