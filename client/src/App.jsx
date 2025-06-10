import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Registreer from "./registreer.jsx";
import Contact from "./contactNavbalk.jsx";
import Login from "./login.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registreer" element={<Registreer />} />
        <Route path="/contactNavbalk" element={<Contact />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </Router>
  );
}

export default App;
