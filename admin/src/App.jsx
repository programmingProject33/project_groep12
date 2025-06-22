import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import BedrijvenLijst from './pages/BedrijvenLijst';
import StudentenLijst from './pages/StudentenLijst';
import Speeddastes from './pages/Speeddates';
import Profile from './pages/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import AdminsLijst from './pages/AdminsLijst';
import AdminCreate from './pages/AdminCreate';
import AdminDetail from './pages/AdminDetail';
import Layout from './components/Layout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<ProtectedRoute><Layout><Dashboard /></Layout></ProtectedRoute>} />
        <Route path="/bedrijven" element={<ProtectedRoute><Layout><BedrijvenLijst /></Layout></ProtectedRoute>} />
        <Route path="/studenten" element={<ProtectedRoute><Layout><StudentenLijst /></Layout></ProtectedRoute>} />
        <Route path="/speeddates" element={<ProtectedRoute><Layout><Speeddastes /></Layout></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Layout><Profile /></Layout></ProtectedRoute>} />
        <Route path="/admins" element={<ProtectedRoute><Layout><AdminsLijst /></Layout></ProtectedRoute>} />
        <Route path="/admins/nieuw" element={<ProtectedRoute><Layout><AdminCreate /></Layout></ProtectedRoute>} />
        <Route path="/admins/:id" element={<ProtectedRoute><Layout><AdminDetail /></Layout></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
