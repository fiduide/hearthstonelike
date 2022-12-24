import * as React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Index from "./containers/Index/Index";

function App() {
  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<Index />} />
      </Routes>
    </div>
  );
}

export default App;
