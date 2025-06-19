import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/" />;
  }

  return children;
}

export default ProtectedRoute;






// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { useAuth } from '../context/AuthContext';

// const ProtectedRoute = ({ children }) => {
//     const { isAuthenticated, loading } = useAuth();

//     if (loading) {
//         return <div>Loading...</div>;
//     }

//     if (!isAuthenticated) {
//         return <Navigate to="/login" replace />;
//     }

//     return children;
// };

// export default ProtectedRoute;