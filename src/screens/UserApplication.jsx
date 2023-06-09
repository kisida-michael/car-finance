import React, { useState, useRef } from 'react';
import ApplicantInfo from '../components/client/apply/forms/ApplicantInfo';
import EmploymentInfo from '../components/client/apply/forms/EmploymentInfo';
import CustomAlert from '../components/client/CustomAlert';
import LandingHeader from '../components/client/LandingHeader';
const UserApplication = () => {
  const [step, setStep] = useState(0);
  const stepValidationStatus = useRef([]);
  const [errorMessage, setErrorMessage] = useState(null);
  const formMethods = useRef();

  const handleNext = async () => {
    const isFormValid = await formMethods.current.trigger();
  
    if (isFormValid) {
      const formData = formMethods.current.getValues();
      console.log(formData);  // You can replace this with logic to save the data in your application state
      if (step < components.length - 1) {
        setStep(step + 1);
      }
    } else {
      setErrorMessage('Please correct the errors before proceeding');
    }
  };
  const handleAlertDismiss = () => {
    setErrorMessage(null);
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const isFormValid = await formMethods.current.trigger();    if (isFormValid) {
      // Submit the form
      console.log('Form submitted')
      console.log(formMethods.current.getValues());

   
    } else {
      setErrorMessage('Please correct the errors before proceeding');
    }
  };

  const components = [
    <ApplicantInfo formMethodsRef={formMethods} />,
    <EmploymentInfo formMethodsRef={formMethods} />,
  ];

  return (
 <div className="flex flex-col h-screen bg-cyan-50 ">
  
        <LandingHeader />

        <div className="w-full max-w-md justify-center items-center mx-auto mt-20 bg-white rounded-md p-4 shadow-md" >
        {components[step]}

        <div className="flex justify-between mt-4">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 text-white bg-cyan-500 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          {step < components.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
      {errorMessage && <CustomAlert message={errorMessage} onDismiss={handleAlertDismiss} />}
    </div>
  );
};

export default UserApplication;
