import React from 'react';
import { FiMail, FiPhone, FiMoreVertical } from 'react-icons/fi';


const CustomerCard = ({ customer, onClick, onOpenModal }) => {
  return (
    <div
      className="bg-card p-4 rounded-lg mb-2 flex items-center cursor-pointer"
    >
      <div
        className="flex flex-1 items-center space-x-4"
        onClick={onClick}
      >
        <img
          src="https://via.placeholder.com/100"
          alt="User profile"
          className="w-8 h-8 rounded-full"
        />
        <div className="flex-1">{customer.fullName}</div>
        <div className="ml-8 flex-1 flex items-center space-x-2">
          <FiMail className="mr-2 ml-7 text-cyan-500 font-bold"/> 
          <div>{customer.email}</div>
        </div>
        <div className="flex-1  flex items-center space-x-2">
          <FiPhone className="mr-2 ml-14 text-cyan-500 font-bold" />
          <div>{customer.phoneNumber}</div>
        </div>
      </div>
      <FiMoreVertical className="ml-2" onClick={onOpenModal} />
    </div>
  );
};
export default CustomerCard;
 