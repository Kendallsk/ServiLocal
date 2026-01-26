const InputField = ({ name, label, type = 'text', value, onChange }) => {
  return (
    <div className="input-group">
      <input
        name={name}
        type={type}
        placeholder=" "
        value={value}
        onChange={onChange}
        required
      />
      <label>{label}</label>
    </div>
  );
};

export default InputField;
