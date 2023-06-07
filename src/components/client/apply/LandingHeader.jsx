import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingHeader = () => {
  const navigate = useNavigate();

  const handleSignIn = () => {
    // Navigate to the sign in page. Update with your route.
    navigate('/signin');
  }

  return (
    <header className="flex justify-between items-center py-4 px-8 bg-white shadow-md">
      <div>
        <h1 className="text-2xl text-gray-800 font-bold">AW Auto</h1>
        <div className="h-1 w-24 bg-cyan-500 mt-1"></div>
        <p className="text-gray-600 text-sm mt-1">Auto Financing</p>
      </div>

      <button 
        onClick={handleSignIn} 
        className="bg-cyan-500 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 transition-colors duration-200"
      >
        Sign In
      </button>
    </header>
  );
};

export default LandingHeader;
