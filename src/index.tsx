import React from "react";
import ReactDOM from "react-dom/client";
import { GlobalStyles } from "twin.macro";
import App from "./App";

import { Buffer } from "@stacks/common";

global.Buffer = global.Buffer || Buffer;

const container = document.getElementById("root");
const root = ReactDOM.createRoot(container!);
root.render(
  <React.StrictMode>
    <GlobalStyles />
    <App />
  </React.StrictMode>
);
