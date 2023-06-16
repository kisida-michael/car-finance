import React from 'react';
import { states } from '../../../../utils/constants';
import { Controller } from 'react-hook-form';

const getNestedObject = (nestedObj, pathArr) => {
  return pathArr.reduce((obj, key) =>
    (obj && obj[key] !== 'undefined') ? obj[key] : undefined, nestedObj);
}


export const FormInput = ({ name, register, requiredMessage, placeholder, onChange, value, errors, prefix }) => {
  // Split the name and destructure the elements
  const [parentName, childName] = name.split('.');

  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6 text-gray-300">
      <label className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2">{placeholder}</label>
      <div className="relative">
        {prefix && <span className="text-cyan-500 absolute inset-y-0 left-0 flex items-center pl-2">{prefix}</span>}
        <input 
          {...register(name, { required: requiredMessage })} 
          placeholder={placeholder} 
          className={`border-cardAlt border-b-3 bg-admin p-2 w-full focus:border-cyan-500 focus:outline-none ${prefix ? 'pl-6' : ''}`}
          onChange={onChange} 
          value={value} 
        />
      </div>
      {errors[parentName] && errors[parentName][childName] && <p className="text-red-500">{errors[parentName][childName].message}</p>}
    </div>
  )
};


export const FormSelect = ({ name, control, requiredMessage, placeholder, errors, options }) => {
  const [parentName, childName] = name.split('.');
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6 text-gray-300">
      <label className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2">{placeholder}</label>
      <Controller 
        control={control}
        name={name}
        rules={{ required: requiredMessage }}
        render={({ field }) => (
        <select {...field} className="border-t-0 border-r-0 border-l-0 border-b-3 border-cardAlt bg-admin p-2 w-full focus:border-cyan-500 focus:outline-none focus:ring-0">
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      />
      {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
    </div>
  );
};
export const FormDate = ({ name, register, requiredMessage, placeholder, errors }) => {
  const [parentName, childName] = name.split('.');
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6 text-gray-300">
      <label className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} placeholder={placeholder} className="border-t-0 border-r-0 border-l-0 border-b-3 border-cardAlt bg-admin p-2 w-full focus:border-cyan-500 focus:outline-none focus:ring-0" type="date" />
      {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
    </div>
  );
};
  
export const FormPhone = ({ name, register, requiredMessage, placeholder, value, onChange, errors }) => {
  const [parentName, childName] = name.split('.');
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6 text-gray-300">
      <label className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} value={value} onChange={onChange} placeholder={placeholder} className="border-cardAlt border-b-3 bg-admin p-2 w-full focus:border-cyan-500 focus:outline-none" />
      {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
    </div>
  );
};

export const FormSSN = ({ name, register, requiredMessage, placeholder, value, onChange, errors }) => {
  const [parentName, childName] = name.split('.');
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6 text-gray-300">
      <label className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} value={value} onChange={onChange} placeholder={placeholder} className="border-cardAlt border-b-3 bg-admin p-2 w-full focus:border-cyan-500 focus:outline-none" />
      {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
    </div>
  );
};

export const FileUpload = ({ name, register, requiredMessage, placeholder, errors, onChange }) => {
  const [parentName, childName] = name.split('.');
  return (
    <div className="w-full px-3 mb-4 md:mb-0">
      <label 
        className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2" 
        htmlFor={name}>
        {placeholder}
      </label>
      <label 
        className="w-full text-gray-300 border-cardAlt rounded-md p-2 mb-4 flex items-center justify-center cursor-pointer bg-cardAlt hover:bg-admin " 
        htmlFor={name}>
        Choose file
      </label>
      <input
        type="file"
        id={name}
        {...register(name, { required: requiredMessage })}
        onChange={onChange}
        className="hidden" // Hide the actual input
      />
      {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
    </div>
  );
};
export const FormCheckbox = ({ name, control, label, onChange, errors }) => {
  const [parentName, childName] = name.split('.');
  return (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6 text-gray-300">
      <label className="uppercase tracking-wide text-gray-300 text-xs font-bold mb-2 flex items-center">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <>
              <input 
                {...field} 
                type="checkbox"
                className="hidden" // This hides the native checkbox
                onChange={(e) => {
                  field.onChange(e);
                  if(onChange) onChange(e);
                }} 
              />
              <span 
                className={`w-4 h-4 inline-block border-2 rounded ${field.value ? 'bg-cyan-500' : 'bg-white'} border-cyan-500 mr-2`} 
              />
            </>
          )}
        />
        {label}
      </label>
      {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
    </div>
  );
};

export const FormEmail = ({ name, register, requiredMessage, placeholder, onChange, value, errors }) => {
  const [parentName, childName] = name.split('.');
  const pattern = name === "email" ? {
      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
      message: "Invalid email address"
  } : {};

  return (
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb text-gray-300-6">
          <label className="block uppercase tracking-wide text-gray-300 text-xs font-bold mb-2">{placeholder}</label>
          <input 
              {...register(name, { 
                  required: requiredMessage,
                  pattern: pattern
              })} 
              placeholder={placeholder} 
              className="border-2 border-cardAlt rounded-md p-2 w-full" 
              onChange={onChange} 
              value={value} 
          />
          {getNestedObject(errors, [parentName, childName]) && <p className="text-red-500">{getNestedObject(errors, [parentName, childName]).message}</p>}
      </div>
  );
};
