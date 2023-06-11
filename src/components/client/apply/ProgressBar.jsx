import React from 'react';

const ProgressBar = ({ step, totalSteps }) => {
  const progress = (step / totalSteps) * 100;

  return (
    <div className="w-full bg-gray-200 rounded-md h-4">
      <div className="h-full text-center text-xs text-white bg-cyan-500 rounded-md" style={{ width: `${progress}%` }}></div>
    </div>
  );
};

export default ProgressBar;
