import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  // Carga el usuario inicial desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Escucha cambios en localStorage (para cuando cambies de usuario sin recargar)
  useEffect(() => {
    const handleStorageChange = () => {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        setCurrentUser(JSON.parse(storedUser));
      } else {
        setCurrentUser(null);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/admin"
          element={currentUser && currentUser.rol === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/provider"
          element={currentUser && currentUser.rol === 'prestador' ? <ProviderDashboard /> : <Navigate to="/login" />}
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;