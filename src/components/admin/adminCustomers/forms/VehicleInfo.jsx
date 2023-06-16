import React, { useEffect } from 'react';
import { FormInput, FormSelect } from './AdminFormComponents';
import { carMakes } from '../../../../utils/constants';

const VehicleInfo = ({ formMethods,}) => {
  const { register, control, formState: { errors }, } = formMethods;
  
  return (
    <form className="p-4 space-y-4">
      <h2 className="text-2xl text-cyan-500 mb-10 font-semibold">Vehicle Info</h2>
      <h3 className="text-xl text-gray-200 mb-4 font-semibold">Vehicle Information</h3>

      <div className="flex flex-wrap -mx-3">
      <FormInput name="vehicle.Vin" register={register} requiredMessage="VIN is required" placeholder="VIN" errors={errors} />
        <FormInput name="vehicle.Year" register={register} requiredMessage="Year is required" placeholder="Year" errors={errors} />
        <FormInput name="vehicle.Model" register={register} requiredMessage="Model is required" placeholder="Model" errors={errors} />
        <FormInput name="vehicle.Mileage" register={register} requiredMessage="Mileage is required" placeholder="Mileage" errors={errors} />
        <FormSelect name="vehicle.Make" control={control} requiredMessage="Make is required" options={carMakes} placeholder="Make - Select a Car Make" errors={errors} />
      </div>
    </form>
  );
};

export default VehicleInfo;
