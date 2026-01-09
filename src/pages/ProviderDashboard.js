import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProviderDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedUser = localStorage.getItem('currentUser');
    if (loggedUser) {
      setUser(JSON.parse(loggedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  if (!user) {
    return <div>Cargando...</div>;
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa, #fff3e0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          backgroundImage: "url('/images/LogoServiLocal.png')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          
        </div>
        <h1 style={{
          fontSize: '36px',
          background: 'linear-gradient(to right, #00bcd4, #ff9800)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ServiLocal
        </h1>
        <h2 style={{margin: '20px 0'}}>Bienvenido, {user.nombre}</h2>
        <p style={{fontSize: '20px', margin: '20px 0'}}>
          Dashboard de Prestador de Servicios
        </p>
        <div style={{margin: '30px 0', textAlign: 'left'}}>
          <p><strong>Rol:</strong> Prestador</p>
          <p><strong>Usuario:</strong> {user.username}</p>
          <p><strong>Visitas a tu perfil:</strong> 0 (próximo paso)</p>
          <p><strong>QR para compartir:</strong> Pendiente</p>
        </div>
        <button onClick={handleLogout} style={{
          width: '100%',
          padding: '14px',
          background: 'linear-gradient(to right, #00bcd4, #ff9800)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          fontSize: '18px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ProviderDashboard;