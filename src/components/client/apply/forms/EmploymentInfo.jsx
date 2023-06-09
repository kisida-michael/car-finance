import React from 'react';
import { useForm, useFormContext, Controller } from 'react-hook-form';
import { states } from '../../../../utils/constants'; // Assuming you have a constants.js file with exported 'states'

const EmploymentInfo = ({ formMethodsRef }) => {
  const methods = useForm({
    defaultValues: {
      name: "",
      dob: "",
      currentAddress: "",
      city: "",
      ssn: "",
      phone: "",
      zip: "",
      state: "",
      rent: "",
    },
    mode: "onBlur",
  });
  formMethodsRef.current = methods;
  const { register, control, formState: { errors } } = methods;
  
  return (
    <form className="p-4 bg-gray-200 rounded-md">
      <h2 className="text-2xl text-cyan-500 mb-4 font-semibold">
        Employment Info 
      </h2>
      <input {...register("name", { required: "Name is required" })} placeholder="Name" />
      {errors.name && <p>{errors.name.message}</p>}
      {/* ...more fields... */}
      <Controller 
        name="state"
        control={control}
        render={({ field }) => (
          <select {...field}>
            {states.map((state) => (
              <option key={state} value={state}>
                {state}
              </option>
            ))}
          </select>
        )}
      />
      {errors.state && <p>{errors.state.message}</p>}
    </form>
  );
};

export default EmploymentInfo;
