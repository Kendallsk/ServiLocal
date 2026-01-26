const ScheduleInput = ({ value, onChange }) => {
  const handleUpdate = (data) => {
    onChange(JSON.stringify(data));
  };

  const handleChange = (field, val) => {
    let parsed = value ? JSON.parse(value) : {};
    parsed[field] = val;
    handleUpdate(parsed);
  };

  return (
    <div className="input-group">
      <label className="static-label"></label>

      <select
        name="dias"
        className="input"
        onChange={(e) => handleChange('dias', e.target.value)}
        defaultValue=""
        required
      >
        <option value="" disabled></option>
        <option value="Lunes a Viernes">Lunes a Viernes</option>
        <option value="Lunes a Sábado">Lunes a Sábado</option>
        <option value="Todos los días">Todos los días</option>
      </select>

      <label className="static-label">Dias de atención</label>

      <div className="time-row">
        <label className="static-label">Horario de atención</label>
        <input
          type="time"
          className="input"
          onChange={(e) => handleChange('inicio', e.target.value)}
          required
        />

        <input
          type="time"
          className="input"
          onChange={(e) => handleChange('fin', e.target.value)}
          required
        />
      </div>
    </div>
  );
};

export default ScheduleInput;
