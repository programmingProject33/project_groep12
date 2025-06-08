import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import RegisterStudent from "./registerstudent.jsx";
import Login from "./login.jsx";

function App() {
  return (
    <Router>
      {/* Navigatie is hier verwijderd */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studenten/nieuw" element={<RegisterStudent />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
