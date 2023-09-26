import React, { useState, useEffect } from 'react';
import { Controller } from 'react-hook-form';
import { states } from '../../../../utils/constants';
import { FormInput, FormDate, FormSSN, FormSelect, FormPhone, FormEmail} from './AdminFormComponents';

const ApplicantInfo = ({ formMethods }) => {
  const { register, control, watch, setValue, formState: { errors }, } = formMethods;
  console.log(errors)
  const residenceYears = ["Less than 1 year", "1 year", "2 years", "3 years", "4 years", "5+ years"];
  const ssnWatch = watch("applicant.Ssn");

  const [ssn, setSSN] = useState('');
  const [monthlyPayment, setMonthlyPayment] = useState('');
  const [phone, setPhone] = useState('');
  const [displaySSN, setDisplaySSN] = useState("");


  useEffect(() => {
    let displayValue = "";
    if(ssnWatch) {
        let value = ssnWatch.replace(/\D/g, ""); // Remove all non-numeric characters
        value = value.replace(/^(\d{3})(\d)/g,"$1-$2"); // Add the first hyphen after the third digit
        value = value.replace(/-(\d{2})(\d)/,"-$1-$2"); // Add the second hyphen after the fifth digit
        value = value.substring(0, 11); // Maximum SSN length is 11 characters (9 digits + 2 hyphens)
        if (value.length > 0) {
            displayValue = "*".repeat(value.length - 1) + value.slice(-1);
        }
        setDisplaySSN(displayValue);
    }
}, [ssnWatch]);


  const handleSSNInput = (event) => {
    setValue('applicant.Ssn', event.target.value);
};

  const handleSSNChange = (event) => {
    let value = event.target.value;
    value = value.replace(/\D/g, ""); // Remove all non-numeric characters
    value = value.replace(/^(\d{3})(\d)/g,"$1-$2"); // Add the first hyphen after the third digit
    value = value.replace(/-(\d{2})(\d)/,"-$1-$2"); // Add the second hyphen after the fifth digit
    value = value.substring(0, 11); // Maximum SSN length is 11 characters (9 digits + 2 hyphens)
    setValue('applicant.Ssn', value);
};

  
  
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
    <h3 className="text-xl text-gray-200 mb-4 font-semibold">Personal Information</h3>

    <div className="flex flex-wrap -mx-3 ">
    <FormInput name="applicant.FirstName" register={register} requiredMessage="First Name is required" placeholder="First Name" errors={errors} />
      <FormInput name="applicant.LastName" register={register} requiredMessage="Name is required" placeholder="Last Name*" errors={errors} />
      <FormPhone name="applicant.Phone" register={register} requiredMessage="Phone Number is required" placeholder="Phone Number*" value={phone} onChange={handlePhoneChange} errors={errors} />
      <FormEmail
          name="applicant.Email"
          register={register}
          requiredMessage="Email is required"
          placeholder="Email*"
          errors={errors}
        />      <FormDate name="applicant.Dob" register={register} requiredMessage="Date of Birth is required" placeholder="Date of Birth*" errors={errors} />
<FormSSN 
  name="applicant.Ssn" 
  control={control}
  requiredMessage="SSN is required" 
  placeholder="Social Security Number*" 
  errors={errors} 
/>



    </div>
    <hr className="my-4" />

<h3 className="text-xl text-gray-200 mb-4 font-semibold">Residential Information</h3>

    <div className="flex flex-wrap -mx-3 mt-4">
      <FormInput  name="applicant.Address" register={register} requiredMessage="Address is required" placeholder="Address*" errors={errors} />
      <FormInput name="applicant.AptNumber" register={register} requiredMessage="" placeholder="Apt Number" errors={errors} />
      <FormInput name="applicant.City" register={register} requiredMessage="City is required" placeholder="City*" errors={errors} />
      <FormSelect name="applicant.State" control={control} requiredMessage="State is required" options={states} placeholder="Select a State*" errors={errors} />
      <FormInput name="applicant.ZipCode" register={register} requiredMessage="Zip Code is required" placeholder="Zip Code*" errors={errors} />
      <FormSelect name="applicant.HousingStatus" control={control} requiredMessage="Housing status is required" options={["Rent", "Own"]} placeholder="Rent/Own - Select a Status*" errors={errors} />
      <FormSelect name="applicant.ResidenceDuration" control={control} requiredMessage="Residence duration is required" options={residenceYears} placeholder="Residence Duration - Select Years*" errors={errors} />
      <FormInput name="applicant.MonthlyPayment" register={register} requiredMessage="Monthly Payment is required" placeholder="Monthly Payment*" value={monthlyPayment} onChange={handleMonthlyPaymentChange} errors={errors} />
      <FormInput name= "applicant.insurancePolicy" register={register} requiredMessage="Insurance Policy is required" placeholder="Insurance Policy Number*" errors={errors} />

    </div>

  
    
  </form>
  );
};


export default ApplicantInfo;