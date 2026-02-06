import InputField from './InputField';
import ScheduleInput from './ScheduleInput';

const RegisterForm = ({
  formData,
  handleChange,
  handleSubmit,
  loading,
  error,
  showInlineError = true
}) => {
  return (
    <form onSubmit={handleSubmit}>
      <InputField name="nombre" label="Nombre completo" value={formData.nombre} onChange={handleChange} />
      <InputField name="cedula" label="Cédula" value={formData.cedula} onChange={handleChange} />
      <InputField name="username" label="Usuario" value={formData.username} onChange={handleChange} />
      <InputField name="password" type="password" label="Contraseña" value={formData.password} onChange={handleChange} />
      <InputField name="telefono" label="Teléfono" value={formData.telefono} onChange={handleChange} />
      
      <div className="input-group">
        <select 
          name="oficio" 
          className="input" 
          value={formData.oficio} 
          onChange={handleChange}
          required
        >
          <option value="" disabled></option>
          <option value="Electricista">Electricista</option>
          <option value="Plomero">Plomero</option>
          <option value="Gas">Gas</option>
          <option value="Carpintero">Carpintero</option>
          <option value="Albañil">Albañil</option>
          <option value="Niñera">Niñera</option>
        </select>
        <label>Oficio</label>
      </div>

      <InputField name="ciudad" label="Ciudad" value={formData.ciudad} onChange={handleChange} />
      <InputField name="direccion" label="Dirección" value={formData.direccion} onChange={handleChange} />

      <ScheduleInput
        value={formData.horario}
        onChange={(val) =>
          handleChange({ target: { name: 'horario', value: val } })
        }
      />

      {showInlineError && error && <p className="error-msg">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? 'Registrando...' : 'Registrarse'}
      </button>
    </form>
  );
};

export default RegisterForm;
