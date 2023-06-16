import React from 'react';
import { FiLink } from 'react-icons/fi';

const ReviewInfo = ({ formValues, documentUrls }) => {

  const formatLabel = (label) => {
    return label
      .replace(/([A-Z0-9])/g, ' $1')  // Adjusted to include numbers
      .replace(/^./, function(str){ return str.toUpperCase(); })
  }

  const excludeFields = ["bankStatements1", "bankStatements2", "bankStatements3", "leaseAgreement", "phoneBill"];

  return (
    <div className="p-4 space-y-4 w-2xl">
      <h2 className="text-2xl text-cyan-500 mb-10 font-semibold">Review Information</h2>
      <div className="space-y-4">
  {Object.entries(formValues)
    .filter(([fieldName]) => !excludeFields.includes(fieldName))
    .map(([fieldName, fieldValue]) => {
      if (typeof fieldValue === 'object') {
        return (
          <div>
          <h3 className="text-xl text-gray-200 mb-4 font-semibold">{formatLabel(fieldName)}</h3>
          <div className='bg-admin p-4 rounded-xl' key={fieldName}>
            
            <div className="grid grid-cols-2 gap-4">
              {Object.entries(fieldValue).map(([subFieldName, subFieldValue]) => (
                <div className="border-gray-500 border-2 p-2 rounded-md "key={subFieldName}>
                  <p className="text-lg font-medium text-gray-300">{formatLabel(subFieldName).toUpperCase()}</p>
                  <p className="text-base text-gray-200 ">{subFieldValue}</p>
                </div>
              ))}
            </div>
          </div>
          </div>
        )
      } else {
        return (
          <div key={fieldName}>
            <p className="text-lg text-gray-300">{formatLabel(fieldName).toUpperCase()}</p>
            <p className="text-base text-gray-200 mb-4">{fieldValue}</p>
            <hr className="my-4" />
          </div>
        )
      }
    })}
</div>



<h3 className="text-xl text-gray-200 mb-4 font-semibold">Documents</h3>
<div className='bg-admin p-4 text-gray-300 rounded-xl'>
{Object.entries(documentUrls).map(([field, url]) => (
      <div key={field} className="mb-2 p-2 border border-gray-300 rounded-md">
        <a 
          href={url} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center space-x-2"
        >
          <FiLink className="text-cyan-500" />  {/* The FiLink icon */}
          <p>{formatLabel(field)}</p>
        </a>
      </div>
    ))}
    </div>
    </div>
  );
};

export default ReviewInfo;
