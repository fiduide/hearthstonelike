import Recipe from "containers/Recipe/Recipe";

import * as React from "react";
import { Routes, Route } from "react-router-dom";

import "./App.css";
import Index from "./containers/Index/Index";

function App() {
  return (
    <div className="main">
      <Routes>
        <Route path="/" element={<Index />} />
        <Route exact path="/random" element={<Recipe />} />
        <Route path="/recipe/:idRecipe" element={<Recipe />} />
      </Routes>
    </div>
  );
}

export default App;
