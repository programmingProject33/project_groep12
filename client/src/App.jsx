import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studenten/nieuw" element={<RegisterStudent />} />
      </Routes>
    </Router>
  );
}

export default App;
