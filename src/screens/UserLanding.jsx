import React from 'react';
import { useNavigate } from 'react-router-dom';
import LandingHeader from '../components/client/LandingHeader';

const UserLanding = () => {
  let navigate = useNavigate();

  const handleApplyNow = () => {
    // Navigate to the application page. Update with your route.
    navigate('/application');
  }

  return (
    <div className="flex flex-col h-screen bg-cyan-50">
      <LandingHeader />

      <div className="flex flex-col justify-center items-center flex-grow px-4 sm:px-0">
        <div className="bg-cyan-500 p-4 sm:p-20 rounded-lg shadow-lg max-w-2xl mx-auto text-center">
          {/* <img src={logoPlaceholder} alt="Logo" className="mb-8 w-32 mx-auto" /> */}
          <h1 className="text-2xl text-white mb-4">Apply for Your Car Loan Today!</h1>
          <p className="text-white mb-6">
            We provide the best financing options for new and used car loans. 
            Apply now and get approval for your car loan!
          </p>
          <button 
            onClick={handleApplyNow} 
            className="bg-white text-cyan-500 px-8 py-4 rounded-lg text-lg font-bold hover:bg-blue-100 transition-colors duration-200 w-full sm:w-auto"
          >
            Apply Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserLanding;
