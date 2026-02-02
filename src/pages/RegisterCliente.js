import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

const RegisterCliente = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    password: '',
    telefono: '',
    ciudad: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register/cliente', {
        ...formData,
        rol: 'cliente'
        });

      if (res.data.success) {
        setSuccess('¡Registro exitoso! Ahora puedes iniciar sesión.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="card">
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

        <h2 className="subtitle">Registro como Cliente</h2>

        {success && <p className="success-msg">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="input-group">
          <input type="text" name="nombre" placeholder=" " value={formData.nombre} onChange={handleChange} required />
          <label>Nombre completo</label>
          </div>


          <div className="input-group">
          <input
            type="text"
            name="username"
            placeholder=" "
            value={formData.username}
            onChange={handleChange}
            className="input-field"
            required
          />
          <label>Usuario (email o nombre de usuario)</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            placeholder=" "
            value={formData.password}
            onChange={handleChange}
            className="input-field"
            required
          />
          <label>Contraseña (mínimo 6 caracteres)</label>
        </div>

        <div className="input-group">
          <input
            type="tel"
            name="telefono"
            placeholder=" "
            value={formData.telefono}
            onChange={handleChange}
            className="input-field"
            required
          />
          <label>Teléfono</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            name="ciudad"
            placeholder=" "
            value={formData.ciudad}
            onChange={handleChange}
            className="input-field"
            required
          />
          <label>Ciudad</label>
        </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Registrando...' : 'Registrarme como Cliente'}
          </button>
        </form>

        <div className="mt-5 text-sm">
          <Link
            to="/login"
            style={{
                color: '#00bcd4',
                fontWeight: 'bold',
                textDecoration: 'none'
            }}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
            >
            ← Volver al login
            </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterCliente;