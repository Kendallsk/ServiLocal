import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const adminName = localStorage.getItem('adminName') || 'Administrador';

  const handleLogout = () => {
    localStorage.removeItem('adminLoggedIn');
    localStorage.removeItem('adminName');
    window.dispatchEvent(new Event('storage'));
    navigate('/login');
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #e0f7fa, #fff3e0)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '16px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
        textAlign: 'center',
        maxWidth: '600px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '36px',
          background: 'linear-gradient(to right, #00bcd4, #ff9800)',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          ServiLocal - Panel Admin
        </h1>
        <h2 style={{margin: '30px 0'}}>Bienvenido, {adminName}</h2>
        <p style={{fontSize: '20px'}}>¡Login funcionando correctamente! 🎉</p>
        <p>Backend conectado</p>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px',
            background: 'linear-gradient(to right, #00bcd4, #ff9800)',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '18px',
            fontWeight: 'bold',
            cursor: 'pointer',
            marginTop: '30px'
          }}
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;