import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';

const Register = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    username: '',
    password: '',
    telefono: '',
    oficio: '',
    ciudad: '',
    direccion: '',
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
    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        'http://localhost:3000/api/auth/register/prestador',
        formData
      );

      if (res.data.success) {
        setSuccess('Registro exitoso. Tu cuenta está pendiente de aprobación.');
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
        {/* Logo */}
        <div style={{
          width: '120px',
          height: '120px',
          backgroundImage: "url(/images/LogoServiLocal.png)",
          backgroundSize: 'cover',
          borderRadius: '50%',
          margin: '0 auto 20px'
        }} />

        <h1 className="gradient-title">ServiLocal</h1>
        <h2 className="subtitle">Registro de Prestador</h2>

        {success && <p className="success-msg">{success}</p>}

        <RegisterForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
        />
      </div>
    </div>
  );
};

export default Register;
