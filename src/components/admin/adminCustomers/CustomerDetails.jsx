import React, { useState } from "react";
import { Resizable } from "react-resizable";
import "react-resizable/css/styles.css";
import Draggable from "react-draggable";
import {
  FiMail,
  FiPhone,
  FiHome,
  FiDollarSign,
  FiCalendar,
  FiPercent,
  FiChevronDown,
  FiChevronUp,
  FiUser,
  FiX
} from "react-icons/fi";
import { motion } from "framer-motion";

const CustomerDetails = ({ customer, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };

  const slideIn = {
    hidden: { x: "100%" }, // Start from the right
    visible: { x: "0%", transition: { duration: 0.2 } }, // Slide to the left
    exit: { x: "100%", transition: { duration: 0.2 } }, // Slide out to the right
  };

  return (
     <motion.div
      variants={slideIn} 
      initial="hidden" 
      animate="visible" 
      exit="exit"
      className="flex-none lg:w-1/5 sm:w-full  h-screen  bg-card text-gray-200 p-4 flex flex-col px-4 transition-all duration-500 ease-in-out transform"
    >
    
      <button
        className="absolute top-6 left-6 bg-cardAlt text-gray-200 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors hover:text-red-500"
        onClick={onClose}
      >
        <FiX />
      </button>
      <div className="p-4">
        <div className="mb-8">
        <img
          src="https://via.placeholder.com/100"
          alt="User profile"
          className="mt-4 w-24 h-24 rounded-full mb-4 mx-auto "
        />
        <h2 className="text-2xl font-bold mb-4 text-center">
          {customer.fullName}
        </h2>
        </div>
        <div className="p-4 bg-admin rounded-lg my-4">
  <h4 className="text-lg font-bold mb-2 text-cyan-500 ">Contact Info</h4>
  <div className="my-2 flex items-center ">
    <FiMail className="mr-2" /> {customer.email}
  </div>
  <hr className="opacity-20" />
  <div className="my-2 flex items-center">
    <FiPhone className="mr-2" /> {customer.phoneNumber}
  </div>
  <hr className="opacity-20" />
  <div className="my-2 flex items-center">
    <FiHome className="mr-2" /> {customer.address} {customer.city}{" "}
    {customer.state}, {customer.zipCode}
  </div>
</div>

<div className="p-4 bg-admin rounded-lg my-4">
  <h4 className="text-lg font-bold mb-2 text-cyan-500">Payment Info</h4>
  <div className="my-2 flex items-center">
    <FiPercent className="mr-2" />
    <span className="font-bold mr-1">Interest Rate: </span>{" "}
    {customer.interest}
  </div>
  <hr className="opacity-20" />

  <div className="my-2 flex items-center">
    <FiCalendar className="mr-2" />
    <span className="font-bold mr-1">Terms: </span> {customer.terms}{" "}
    months
  </div>
  <hr className="opacity-20" />

  <div className="my-2 flex items-center">
    <FiDollarSign className="mr-2" />
    <span className="font-bold mr-1">Down Payment: </span> {customer.downPayment.toFixed(2)}{" "}
  </div>
</div>
        
<div className="p-4 bg-admin rounded-lg my-4">
  <h4 className="text-lg font-bold text-cyan-500">References</h4>
  {customer.references && customer.references.length > 0 && customer.references.map((reference, index) => (
  <div key={index} className="bg-card px-4 py-2 mt-4 rounded-lg">
    <button
      className="flex justify-between items-center w-full text-left text-white"
      onClick={() => handleClick(index)}
    >
      <span className="font-medium text-md">{reference.firstName} {reference.lastName}</span>
      {activeIndex === index ? <FiChevronUp className="text-white" /> : <FiChevronDown className="text-white" />}
    </button>
    {activeIndex === index && (
      <div className="mt-2">
        <div className="flex items-center text-white">
          <FiHome className="mr-2" />
          <p>{reference.address} {reference.city}{" "}
          {reference.state}, {reference.zipCode}</p>
        </div>
        <div className="flex items-center mt-2 text-white">
          <FiPhone className="mr-2" />
          <p>{reference.phoneNumber}</p>
        </div>
        <div className="flex items-center mt-2 text-white">
          <FiMail className="mr-2" />
          <p>{reference.email}</p> 
        </div>
      </div>
    )}
  </div>
))}

</div>


        <div className="bg-admin text-white text-center rounded-lg my-2 mx-auto flex flex-col justify-between py-8 items-center space-y-4 ">
          <div className="text-xl ">Car Price</div>
          <div className="text-4xl font-bold text-cyan-500">
            ${customer.carPrice.toFixed(2)}
          </div>
          <div className="text-md text-gray-400 font-semibold">
            {" "}
            Due June 5, 2024
          </div>
        </div>

        
      </div>
      </motion.div>
  );
};

export default CustomerDetails;
