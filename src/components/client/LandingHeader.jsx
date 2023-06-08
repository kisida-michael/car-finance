import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Navigate to the sign in page. Update with your route.
    navigate('/signin');
  }

  return (
    <div>
      <header className="flex flex-col sm:flex-row justify-between items-center py-4 px-4 sm:px-40 bg-cyan-500 text-white shadow-md">
        <h1 className="text-2xl font-bold text-center sm:text-left mb-2 sm:mb-0">AW Auto</h1>

        <button 
          onClick={handleSignIn} 
          className="bg-white text-cyan-500 px-6 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 transition-colors duration-200 self-center sm:self-auto"
        >
          Sign In
        </button>
      </header>

      <div className="bg-white text-cyan-500 px-4 sm:px-40 py-3 shadow-md">
        <p className="text-sm font-bold uppercase text-center sm:text-left">Auto Financing</p>
      </div>
    </div>
  );
};

export default LandingHeader;
