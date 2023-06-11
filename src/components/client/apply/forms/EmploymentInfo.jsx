import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { states } from '../../../../utils/constants';
import { FormInput, FormDate, FormSSN, FormSelect, FormPhone} from './FormComponents';

const EmploymentInfo = ({ formMethods }) => {
  const { register, control, formState: { errors } } = formMethods;
  const residenceYears = ["Less than 1 year", "1 year", "2 years", "3 years", "4 years", "5+ years"];
  
  const [employerPhone, setEmployerPhone] = useState("");
  const employmentYears = [
    "Less than 1 year",
    "More than 1 year",
    "More than 2 years",
    "More than 3 years",
    "More than 4 years",
    "More than 5+ years",
  ];
  const [grossAnnualIncome, setGrossAnnualIncome] = useState("");

  const handleEmployerPhoneChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove all non-numeric characters
    value = value.replace(/^(\d{3})(\d)/g,"($1) $2"); // Add the first parenthesis after the third digit
    value = value.replace(/(\d{4})(\d)/,"$1-$2"); // Add the dash after the sixth digit
    setEmployerPhone(value.substring(0, 14)); // Maximum phone number length is 14 characters (10 digits + 2 parentheses + 1 space + 1 dash)
  }
  
  const handleIncomeChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    value = value ? (value / 100).toFixed(2) : ""; // Divide by 100 and fix to 2 decimal places only if there's a value
    setGrossAnnualIncome(value);
  };
  const handlePhoneChange = (event) => {
    let value = event.target.value.replace(/\D/g, '');
    
    // Limit input to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }
    
    let formattedValue = '';
  
    if (value.length > 0) {
      formattedValue += '(' + value.substring(0, 3);
    }
    if (value.length >= 3) {
      formattedValue += ') ' + value.substring(3, 6);
    }
    if (value.length >= 6) {
      formattedValue += ' - ' + value.substring(6);
    }
  
    setPhone(formattedValue);
  };
  

  return (
    <form className="p-4 space-y-4">
      <h2 className="text-2xl text-cyan-500 mb-10 font-semibold">Employment Info</h2>
      <h3 className="text-xl text-gray-500 mb-4 font-semibold">Employment Information</h3>

      <div className="flex flex-wrap -mx-3">
        <FormInput name="currentEmployer" register={register} requiredMessage="Current employer is required" placeholder="Current Employer" errors={errors} />
        {/* <FormPhone name="employerPhone" register={register} requiredMessage="Employer's phone is required" placeholder="Employer's Phone Number" value={employerPhone} onChange={handlePhoneChange} errors={errors} /> */}
        <FormSelect name="employmentDuration" control={control} requiredMessage="Employment duration is required" options={employmentYears} placeholder="Employment Duration - Select Years" errors={errors} />
        <FormInput name="position" register={register} requiredMessage="Position is required" placeholder="Position" errors={errors} />
        <FormInput name="grossAnnualIncome" register={register} requiredMessage="Gross annual income is required" placeholder="Gross Annual Income" value={grossAnnualIncome} onChange={handleIncomeChange} errors={errors} />
      </div>
    </form>
  );
};


export default EmploymentInfo;