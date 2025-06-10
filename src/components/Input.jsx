import React, { useState } from "react";

const Input = ({
  type,
  label,
  placeholder = "",
  error = "",
  ...otherProps
}) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex flex-col">
      <label>{label}</label>
      <input
        type={`${type}`}
        id={otherProps.id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className="border-1 border-gray-400 px-2 py-1"
        {...otherProps}
      />
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};

export default Input;
