import React from 'react'


const Input = ({ title, value, setValue, type = "text", placeholder = "" }) => {
    return (
      <div className="mb-2">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          {title}
        </label>
        <input
          className=" appearance-none border-gray-300 ring-cyan-500 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-cyan-500 " 
          type={type}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
        />
      </div>
    );
  };
export default Input