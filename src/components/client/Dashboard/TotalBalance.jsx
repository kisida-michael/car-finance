import React from 'react';
import { PulseLoader } from 'react-spinners';
import { useNavigate } from 'react-router-dom';
function BalanceCard({ balance, goToBill, dueDate, className, isLoading }) {

  const navigate = useNavigate();
  const handleGoToBill = () => {
    navigate("/user/billing");
    
  }


  if (isLoading) {
    return (
      <div className={className}>
        <div className="h-64 bg-cyan-500 rounded-lg shadow-sm flex items-center justify-center">
        <div className="opacity-50">
  <PulseLoader color="#FFFFFF" /> {/* Set the color to white */}
</div>        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="h-64 bg-cyan-500 rounded-lg shadow-sm flex flex-col items-center justify-center">
        <h1 className='mb-2 font-medium text-2xl text-white'>Your Balance</h1>
        <h1 className="font-bold text-5xl text-white">${balance}</h1>
        <h2 className="mt-4 text-md text-gray-50 font-medium">{dueDate}</h2>
        <button
          className="mt-6 px-8 py-2 bg-white text-sm  text-gray-500 font-bold rounded-full"
          onClick={handleGoToBill}
        >
          My Bill
        </button>
      </div>
    </div>
  );
}

export default BalanceCard;
