import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home.jsx";
import RegisterStudent from "./registerstudent.jsx";
import Contact from "./contactNavbalk.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/studenten/nieuw" element={<RegisterStudent />} />
        <Route path="/contactNavbalk" element= {<Contact />}></Route>
      </Routes>
    </Router>
  );
}

export default App;
