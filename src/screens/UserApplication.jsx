import React, { useState } from 'react';

// Step components
import ApplicantInfo from '../components/client/apply/forms/ApplicantInfo'
import EmploymentInfo from '../components/client/apply/forms/EmploymentInfo'
// import VehicleInfo from '../components/client/apply/forms/VehicleInfo'

const UserApplication = () => {
  const [step, setStep] = useState(0);
  const [applicant, setApplicant] = useState({});
  const [employment, setEmployment] = useState({});
  const [vehicle, setVehicle] = useState({});
  const [coApplicant, setCoApplicant] = useState({});

  const components = [
    <ApplicantInfo 
      applicant={applicant} 
      setApplicant={setApplicant} 
      coApplicant={coApplicant} 
      setCoApplicant={setCoApplicant}
    />,
    <EmploymentInfo employment={employment} setEmployment={setEmployment}/>,
    // <VehicleInfo vehicle={vehicle} setVehicle={setVehicle}/>
  ];

  const handleNext = () => {
    if (step < components.length - 1) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSubmit = () => {
    // Handle form submission here
  };

  return (
    <div className="flex flex-col items-center justify-center  bg-white-500">
      <div className="w-full max-w-lg p-6 m-4 bg-gray-100 rounded-lg shadow-md">
        {components[step]}

        <div className="flex justify-between mt-6">
          <button
            onClick={handlePrev}
            className="px-4 py-2 text-gray-600 border border-gray-600 rounded hover:bg-gray-600 hover:text-white transition-colors"
            disabled={step === 0}
          >
            Previous
          </button>
          {step < components.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-white bg-cyan-500 border border-cyan-500 rounded hover:bg-white hover:text-cyan-500 transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-cyan-500 border border-cyan-500 rounded hover:bg-white hover:text-cyan-500 transition-colors"
            >
              Submit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserApplication;
