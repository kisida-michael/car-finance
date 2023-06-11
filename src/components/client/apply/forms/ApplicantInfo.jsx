import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { states } from '../../../../utils/constants';
import { FormInput, FormDate, FormSSN, FormSelect, FormPhone} from './FormComponents';

const ApplicantInfo = ({ formMethods }) => {
  const { register, control, formState: { errors } } = formMethods;
  const residenceYears = ["Less than 1 year", "1 year", "2 years", "3 years", "4 years", "5+ years"];

  const [ssn, setSSN] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [phone, setPhone] = useState('');

  const handleSSNChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove all non-numeric characters
    value = value.replace(/^(\d{3})(\d)/g,"$1-$2"); // Add the first hyphen after the third digit
    value = value.replace(/-(\d{2})(\d)/,"-$1-$2"); // Add the second hyphen after the fifth digit
    setSSN(value.substring(0, 11)); // Maximum SSN length is 11 characters (9 digits + 2 hyphens)
  }
  const handleMonthlyPaymentChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    value = value ? (value / 100).toFixed(2) : ""; // Divide by 100 and fix to 2 decimal places only if there's a value
    setMonthlyPayment(value);
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
    <h2 className="text-2xl text-cyan-500 mb-10 font-semibold">Applicant Info</h2>
    <h3 className="text-xl text-gray-500 mb-4 font-semibold">Personal Information</h3>

    <div className="flex flex-wrap -mx-3 ">
      <FormInput name="applicantFirstName" register={register} requiredMessage="Name is required" placeholder="First Name" errors={errors} />
      <FormInput name="applicantLastName" register={register} requiredMessage="Name is required" placeholder="Last Name" errors={errors} />
      <FormPhone name="phone" register={register} requiredMessage="Phone Number is required" placeholder="Phone Number" value={phone} onChange={handlePhoneChange} errors={errors} />
      <FormDate name="applicantDOB" register={register} requiredMessage="Date of Birth is required" placeholder="Date of Birth" errors={errors} />
      <FormSSN name="ssn" register={register} requiredMessage="SSN is required" placeholder="Social Security Number" value={ssn} onChange={handleSSNChange} errors={errors} />
    </div>
    <hr className="my-4" />

<h3 className="text-xl text-gray-500 mb-4 font-semibold">Residential Information</h3>

    <div className="flex flex-wrap -mx-3 mt-4">
      <FormInput  name="applicantAddress" register={register} requiredMessage="Address is required" placeholder="Address" errors={errors} />
      <FormInput name="applicantAptNumber" register={register} requiredMessage="" placeholder="Apt Number" errors={errors} />
      <FormInput name="applicantCity" register={register} requiredMessage="City is required" placeholder="City" errors={errors} />
      <FormSelect name="applicantState" control={control} requiredMessage="State is required" options={states} placeholder="Select a State" errors={errors} />
      <FormInput name="applicantZipCode" register={register} requiredMessage="Zip Code is required" placeholder="Zip Code" errors={errors} />
      <FormSelect name="housingStatus" control={control} requiredMessage="Housing status is required" options={["Rent", "Own"]} placeholder="Rent/Own - Select a Status" errors={errors} />
      <FormSelect name="residenceDuration" control={control} requiredMessage="Residence duration is required" options={residenceYears} placeholder="Residence Duration - Select Years" errors={errors} />
      <FormInput name="monthlyPayment" register={register} requiredMessage="Monthly Payment is required" placeholder="Monthly Payment" value={monthlyPayment} onChange={handleMonthlyPaymentChange} errors={errors} />

    </div>

  
    
  </form>
  );
};


export default ApplicantInfo;