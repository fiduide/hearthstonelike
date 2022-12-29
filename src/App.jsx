import * as React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Index from "./containers/Index/Index";

function App() {
  return (
    <Routes>
      <Route path="/hearthstonelike/" element={<Index />} />
    </Routes>
  );
}

export default App;
