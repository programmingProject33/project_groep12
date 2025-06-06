import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import RegisterStudent from "./RegisterStudent"; // Die maken we zo!
 
function App() {
  return (
<Router>
<Routes>
<Route path="/" element={<Home />} />
<Route path="/register-student" element={<RegisterStudent />} />
</Routes>
</Router>
  );
}
 
export default App;