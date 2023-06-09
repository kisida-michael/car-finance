import React, { useState } from 'react';


const Input = ({ label, value, onChange, validate, onValidation, type }) => {
  const [touched, setTouched] = useState(false);

  const handleBlur = () => {
    setTouched(true);
    const validationError = validate(value);
    onValidation(validationError);
  };

  const handleChange = (event) => {
    onChange(event.target.value);
    const validationError = validate(event.target.value);
    onValidation(validationError);
  };

  const error = validate(value);

  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>
      <input
        value={value}
        onBlur={handleBlur}
        onChange={handleChange}
        type={type}
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      />
      {touched && error && <div className="text-red-500 text-xs italic">{error}</div>}
    </div>
  );
};

export default Input;
