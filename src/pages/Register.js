import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    username: '',
    password: '',
    telefono: '',
    oficio: '',
    ciudad: '',
    horario: ''
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
      const res = await axios.post('http://localhost:3000/api/auth/register', formData);

      if (res.data.success) {
        setSuccess('Registro exitoso. Tu cuenta está pendiente de aprobación por el administrador.');
        setTimeout(() => navigate('/login'), 3000);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error al registrar');
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
        maxWidth: '500px',
        textAlign: 'center'
      }}>
        <div style={{
          width: '120px',
          height: '120px',
          background: 'linear-gradient(to right, #00bcd4, #ff9800)',
          borderRadius: '50%',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '50px',
          fontWeight: 'bold'
        }}>
          SL
        </div>
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
        <h2 style={{color: '#555', marginBottom: '30px'}}>
          Registro de Prestador
        </h2>

        <form onSubmit={handleSubmit}>
          <input name="nombre" placeholder="Nombre completo" value={formData.nombre} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />
          <input name="username" placeholder="Usuario" value={formData.username} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />
          <input name="password" type="password" placeholder="Contraseña" value={formData.password} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />
          <input name="telefono" placeholder="Teléfono" value={formData.telefono} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />
          <input name="oficio" placeholder="Oficio (ej. Plomero, Electricista)" value={formData.oficio} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />
          <input name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />
          <input name="horario" placeholder="Horario de atención" value={formData.horario} onChange={handleChange} style={{width: '100%', padding: '12px', margin: '10px 0', borderRadius: '8px', border: '1px solid #ccc'}} required />

          {error && <p style={{color: 'red', margin: '15px 0'}}>{error}</p>}
          {success && <p style={{color: 'green', margin: '15px 0'}}>{success}</p>}

          <button type="submit" disabled={loading} style={{
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
            {loading ? 'Registrando...' : 'Registrarse'}
          </button>
        </form>

        <div style={{marginTop: '20px'}}>
          <a href="/login" style={{color: '#00bcd4', textDecoration: 'none', fontWeight: 'bold'}}>
            ← Volver al login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Register;