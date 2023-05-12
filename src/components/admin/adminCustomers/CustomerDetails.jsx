import React from 'react';
import { Resizable } from 'react-resizable';
import 'react-resizable/css/styles.css';
import Draggable from 'react-draggable';
import { FiMail, FiPhone, FiHome, FiDollarSign, FiCalendar, FiPercent} from 'react-icons/fi';



const CustomerDetails = ({ customer, onClose }) => {
  return (
    <div className="flex-none w-1/5 h-screen bg-card text-gray-200 p-4 flex flex-col px-4 transition-all duration-500 ease-in-out transform">
    <div className='p-4'>
      <img 
        src="https://via.placeholder.com/100" 
        alt="User profile" 
        className="mt-8 w-24 h-24 rounded-full mb-4 mx-auto "
      />
      <h2 className="text-xl font-semibold mb-4 text-center">{customer.fullName}</h2>

      <h4 className="text-lg font-bold mt-4 mb-2 ">Contact Info</h4>
      <div className="my-2 flex items-center ">
        <FiMail className="mr-2"/> {customer.email}
      </div>
      <hr className="opacity-20"/>
      <div className="my-2 flex items-center">
        <FiPhone className="mr-2"/> {customer.phoneNumber}
      </div>
      <hr className="opacity-20"/>
      <div className="my-2 flex items-center">
        <FiHome className="mr-2"/> {customer.address} {customer.city} {customer.state}, {customer.zipCode}
      </div>
      <hr className="opacity-20"/>

      <h4 className="text-lg font-bold mt-4 mb-2">Payment Info</h4>
      <div className="my-2 flex items-center">
        <FiPercent className="mr-2"/> <span className="font-bold mr-1">Interest Rate: </span> {customer.interest}
      </div>
      <hr className="opacity-20"/>
      <div className="my-2 flex items-center">
        <FiCalendar className="mr-2"/> <span className="font-bold mr-1">Terms: </span> {customer.terms} months
      </div>
      <hr className="opacity-20"/>
      <div className="bg-admin text-white text-center rounded-lg my-2 mx-auto flex flex-col justify-between py-8 items-center space-y-4 ">
  <div className="text-xl ">Oustanding Balance</div>
  <div className="text-4xl font-bold text-cyan-500">${customer.balance.toFixed(2)}</div>
  <div  className= "text-md text-gray-400 font-semibold"> Due June 5, 2023</div>
</div>
      
      <button
        className="mt-4 bg-red-500 text-gray-200 px-4 py-2 rounded-lg"
        onClick={onClose}
      >
        Close
      </button>
    </div>
  </div>
  );
};


export default CustomerDetails;
