import React from 'react';
import { states } from '../../../../utils/constants';
import { Controller } from 'react-hook-form';
export const FormInput = ({ name, register, requiredMessage, placeholder, onChange, value, errors }) => (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} placeholder={placeholder} className="border-2 border-gray-200 rounded-md p-2 w-full" onChange={onChange} value={value} />
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
);

  export const FormSelect = ({ name, control, requiredMessage, placeholder, errors, options }) => (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{placeholder}</label>
      <Controller 
        control={control}
        name={name}
        rules={{ required: requiredMessage }}
        render={({ field }) => (
          <select {...field} className="border-2 border-gray-200 rounded-md p-2 w-full">
            <option value="">{placeholder}</option>
            {options.map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        )}
      />
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
  );
  export const FormDate = ({ name, register, requiredMessage, placeholder, errors }) => (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} placeholder={placeholder} className="border-2 border-gray-200 rounded-md p-2 w-full" type="date" />
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
  );
  
  export const FormPhone = ({ name, register, requiredMessage, placeholder, value, onChange, errors }) => (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} value={value} onChange={onChange} placeholder={placeholder} className="border-2 border-gray-200 rounded-md p-2 w-full" />
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
  );
  
  export const FormSSN = ({ name, register, requiredMessage, placeholder, value, onChange, errors }) => (
    <div className="w-full md:w-1/2 px-3 mb-6 md:mb-6">
      <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{placeholder}</label>
      <input {...register(name, { required: requiredMessage })} value={value} onChange={onChange} placeholder={placeholder} className="border-2 border-gray-200 rounded-md p-2 w-full" />
      {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
    </div>
  );
  export const FileUpload = ({ name, register, requiredMessage, placeholder, errors }) => {
    return (
      <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
        <label className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2">{placeholder}</label>
        <input type="file" {...register(name, { required: requiredMessage })} className="border-2 border-gray-200 rounded-md p-2" />
        {errors[name] && <p className="text-red-500">{errors[name].message}</p>}
      </div>
    );
  };
  
// Continue with the other fields
// ...