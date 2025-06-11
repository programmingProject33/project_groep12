import React from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home.jsx";
import Registreer from "./registreer.jsx";
import Contact from "./contactNavbalk.jsx";
import Login from "./login.jsx";
import Bedrijven from "./bedrijven.jsx";
import StudentDashboard from "./StudentDashboard.jsx";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registreer" element={<Registreer />} />
        <Route path="/contactNavbalk" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/bedrijven" element={<Bedrijven />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
