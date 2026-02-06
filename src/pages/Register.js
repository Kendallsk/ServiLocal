import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/RegisterForm';
import axiosPublic from '../api/axiosPublic';
import { toast } from 'react-toastify';

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
    setSuccess('');

    try {
      const res = await axiosPublic.post(
  '/api/auth/register/prestador',
  formData
);

      if (res.data.success) {
        const successMsg = 'Registro exitoso. Tu cuenta está pendiente de aprobación.';
        setSuccess(successMsg);
        toast.success(successMsg);
        setTimeout(() => navigate('/login'), 5000);
      }
    } catch (err) {
      const backendMsg = err.response?.data?.message || '';
      const normalized = backendMsg.toLowerCase();
      const isDuplicate =
        normalized.includes('ya existe') ||
        normalized.includes('duplic') ||
        normalized.includes('registrad');
      const errorMsg = isDuplicate
        ? 'Este usuario ya existe.'
        : backendMsg || 'Error al registrar';
      setError(errorMsg);
      toast.error(errorMsg);
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

        <RegisterForm
          formData={formData}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          loading={loading}
          error={error}
          showInlineError={false}
        />
      </div>
    </div>
  );
};

export default Register;
