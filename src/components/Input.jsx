import React, { useState } from "react";

const Input = ({
  type = "text",
  label = "",
  placeholder = "",
  error = "",
  className = "",
  ...otherProps
}) => {
  const [value, setValue] = useState("");

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div className="flex w-full flex-col gap-2">
      <label>{label}</label>
      <input
        type={`${type}`}
        id={otherProps.id}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`border-none px-2 py-1 ring-2 ring-gray-300 focus:ring-2 focus:ring-gray-500 ${className}`}
        {...otherProps}
      />
      {error && <div className="text-red-400">{error}</div>}
    </div>
  );
};

export default Input;
