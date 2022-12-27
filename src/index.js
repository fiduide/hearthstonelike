import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./index.css";
import App from "./App";

import { createRoot } from "react-dom/client";
import { PlayerManagerProvider } from "context/playerManagerContext";
import { CardManagerProvider } from "context/cardManagerContext";
const container = document.getElementById("root");
const root = createRoot(container); // createRoot(container!) if you use TypeScript
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <PlayerManagerProvider>
        <CardManagerProvider>
          <App />
        </CardManagerProvider>
      </PlayerManagerProvider>
    </BrowserRouter>
  </React.StrictMode>
);
