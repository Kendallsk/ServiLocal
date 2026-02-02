import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosPublic from '../api/axiosPublic';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axiosPublic.post('/api/auth/login', {
        username,
        password
      });

      if (res.data.success) {
        const user = res.data.user;

        localStorage.setItem(
          'currentUser',
          JSON.stringify({
            id: user.id,
            nombre: user.nombre,
            rol: user.rol
          })
        );

        // Notificar a App.js
        window.dispatchEvent(new Event('storage'));

        if (user.rol === 'admin') {
          navigate('/admin');
        } else if (user.rol === 'cliente') {
          navigate('/cliente');
        } else {
          navigate('/provider');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al conectar');
    } finally {
      setLoading(false);
    }
  };

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
        maxWidth: '400px',
        textAlign: 'center'
      }}>
        {/* Logo */}
        <div style={{
          width: '120px',
          height: '120px',
          backgroundImage: "url(/images/LogoServiLocal.png)",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderRadius: '50%',
          margin: '0 auto 20px'
        }} />

        <h1 style={{
          fontSize: '36px',
          background: 'linear-gradient(to right, #00bcd4, #ff9800)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '10px'
        }}>
          ServiLocal
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />

          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '8px'
            }}
          />

          {error && <p style={{ color: 'red' }}>{error}</p>}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              background: 'linear-gradient(to right, #00bcd4, #ff9800)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            {loading ? 'Ingresando...' : 'Iniciar Sesión'}
          </button>

          <div style={{ marginTop: '20px', fontSize: '14px' }}>
            <span>¿No tienes cuenta? </span>
            <span
              onClick={() => navigate('/register')}
              style={{
                color: '#00bcd4',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
            >
              Registrarse
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
