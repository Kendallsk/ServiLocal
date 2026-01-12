import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false); // ← Esto soluciona el error no-undef
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:3000/api/auth/login', {
        username,
        password
      });

      if (res.data.success) {
          localStorage.setItem('currentUser', JSON.stringify(res.data.user));
          window.dispatchEvent(new Event('storage'));
          
          if (res.data.user.rol === 'admin') {
            navigate('/admin');
          } else if (res.data.user.rol === 'cliente') {
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
        {/* Logo oficial */}
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

        

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              margin: '10px 0',
              border: '1px solid #ccc',
              borderRadius: '8px',
              fontSize: '16px'
            }}
            required
          />
          {error && <p style={{ color: 'red', margin: '15px 0' }}>{error}</p>}
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

          {/* Enlace Registrarse */}
          <div style={{ marginTop: '20px', fontSize: '14px' }}>
            <span style={{ color: '#555' }}>¿No tienes cuenta? </span>
            <span
              onClick={() => setShowModal(true)}
              style={{
                color: '#00bcd4',
                fontWeight: 'bold',
                textDecoration: 'none',
                cursor: 'pointer'
              }}
              onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
              onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
              Registrarse
            </span>
          </div>
        </form>

        {/* Modal de selección */}
        {showModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            background: 'rgba(0,0,0,0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
          }}>
            <div style={{
              background: 'white',
              padding: '40px',
              borderRadius: '16px',
              boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
              textAlign: 'center',
              width: '90%',
              maxWidth: '500px'
            }}>
              <h2 style={{ marginBottom: '30px', color: '#333' }}>
                ¿Cómo te quieres registrar?
              </h2>

              <button
                onClick={() => {
                  setShowModal(false);
                  navigate('/register/cliente');
                }}
                style={{
                  width: '100%',
                  padding: '15px',
                  marginBottom: '15px',
                  background: 'linear-gradient(to right, #00bcd4, #ff9800)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Como Cliente
              </button>

              <button
                onClick={() => {
                  setShowModal(false);
                  navigate('/register/prestador');
                }}
                style={{
                  width: '100%',
                  padding: '15px',
                  background: 'linear-gradient(to right, #00bcd4, #ff9800)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '18px',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                Como Prestador
              </button>

              <button
                onClick={() => setShowModal(false)}
                style={{
                  marginTop: '20px',
                  background: 'none',
                  border: 'none',
                  color: '#777',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Cancelar
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;