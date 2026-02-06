import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Home from './pages/Home';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProviderDashboard from './pages/ProviderDashboard';
import ProviderProfile from './pages/ProviderProfile';
import Register from './pages/Register';
import RegisterCliente from './pages/RegisterCliente';
import ClientDashboard from './pages/ClientDashboard';
import 'leaflet/dist/leaflet.css';
import ServicesByCategory from "./pages/ServicesByCategory";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





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
      <ToastContainer position="top-right" autoClose={4000} />
      <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path="/servicios/:categoria" element={<ServicesByCategory />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        {/* Ruta pública para ver perfil de prestador */}
        <Route path="/prestador/:id" element={<ProviderProfile />} />
        
        <Route
          path="/admin"
          element={currentUser && currentUser.rol === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />}
        />
        <Route
          path="/provider"
          element={currentUser && currentUser.rol === 'prestador' ? <ProviderDashboard /> : <Navigate to="/login" />}
        />

        <Route
            path="/cliente"
            element={
              currentUser && currentUser.rol === 'cliente' 
                ? <ClientDashboard /> 
                : <Navigate to="/login" />
            }
          />

        <Route path="*" element={<Navigate to="/login" />} />

        <Route path="/register/cliente" element={<RegisterCliente />} />
        <Route path="/register/prestador" element={<Register />} />

      </Routes>
    </Router>
  );
}

export default App;
