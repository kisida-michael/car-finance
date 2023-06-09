import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { states } from '../../../../utils/constants';

const ApplicantInfo = ({ formMethodsRef }) => {
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
  const { register, handleSubmit, control, formState: { errors } } = methods;
  
  return (
    <form className="p-4 space-y-4">
    <h2 className="text-2xl text-cyan-500 mb-4 font-semibold">Applicant Info</h2>
    <div className="flex flex-col space-y-1">
      <input {...register("name", { required: "Name is required" })} placeholder="Name" className="border-2 border-gray-200 rounded-md p-2" />
      {errors.name && <p className="text-red-500">{errors.name.message}</p>}
    </div>
  
    <div className="flex flex-col space-y-1">
      <input {...register("dob", { required: "Date of Birth is required" })} placeholder="Date of Birth" type="date" className="border-2 border-gray-200 rounded-md p-2" />
      {errors.dob && <p className="text-red-500">{errors.dob.message}</p>}
    </div>
  
    <div className="flex flex-col space-y-1">
      <input {...register("currentAddress", { required: "Current Address is required" })} placeholder="Current Address" className="border-2 border-gray-200 rounded-md p-2" />
      {errors.currentAddress && <p className="text-red-500">{errors.currentAddress.message}</p>}
    </div>
  
    {/* Repeat this pattern for the rest of the fields... */}
    
    <div className="flex flex-col space-y-1">
      <Controller 
        name="state"
        control={control}
        rules={{ required: "State is required" }}
        render={({ field }) => (
          <select {...field} className="border-2 border-gray-200 rounded-md p-2">
          <option value="" disabled selected>Select a state</option>
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </select>
        
        )}
      />
      {errors.state && <p className="text-red-500">{errors.state.message}</p>}
    </div>
  
    <div className="flex flex-col space-y-1">
      <input {...register("rent", { required: "Rent is required" })} placeholder="Rent" className="border-2 border-gray-200 rounded-md p-2" />
      {errors.rent && <p className="text-red-500">{errors.rent.message}</p>}
    </div>
  </form>
  
  );
};

export default ApplicantInfo;
