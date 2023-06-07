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
    <header className="flex justify-between items-center py-4 px-40 bg-cyan-500 text-white shadow-md">
      <h1 className="text-2xl font-bold">AW Auto</h1>

      <button 
        onClick={handleSignIn} 
        className="bg-white text-cyan-500 px-6 py-2 rounded-lg text-sm font-bold hover:bg-cyan-600 transition-colors duration-200"
      >
        Sign In
      </button>
    </header>

    <div className="bg-white text-cyan-500 px-40 py-3 shadow-md">
      <p className="text-sm font-bold uppercase">Auto Financing</p>
    </div>
  </div>
  );
};

export default LandingHeader;
