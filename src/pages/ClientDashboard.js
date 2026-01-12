import { useNavigate } from 'react-router-dom';

const ClientDashboard = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem('currentUser');
  const user = currentUser ? JSON.parse(currentUser) : { nombre: 'Cliente' };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '800px' }}>
        <div style={{
        width: '120px',
        height: '120px',
        backgroundImage: "url(/images/LogoServiLocal.png)",  // ← Ruta correcta desde public/
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '50%',
        margin: '0 auto 20px'
      }}></div>

        <h1 style={{
          fontSize: '36px',
          background: 'linear-gradient(to right, #00bcd4, #ff9800)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          ServiLocal
        </h1>

        <h2 className="subtitle">
          Bienvenido, {user.nombre || 'Cliente'}!
        </h2>

        <p style={{ fontSize: '18px', margin: '30px 0', color: '#555' }}>
          Encuentra los mejores prestadores de servicios cerca de ti
        </p>

        {/* Placeholder para búsqueda o mapa futuro */}
        <div style={{
          background: '#f5f5f5',
          padding: '30px',
          borderRadius: '12px',
          margin: '30px 0'
        }}>
          <h3 style={{ color: '#333', marginBottom: '15px' }}>¿Qué necesitas hoy?</h3>
          <p style={{ color: '#666' }}>
            Próximamente: búsqueda por oficio, ciudad o prestadores cercanos
          </p>
          <button style={{
            padding: '12px 30px',
            background: 'linear-gradient(to right, #00bcd4, #ff9800)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '20px'
          }}>
            Buscar servicios
          </button>
        </div>

        {/* Botón cerrar sesión */}
        <button
          onClick={handleLogout}
          className="btn-primary"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default ClientDashboard;