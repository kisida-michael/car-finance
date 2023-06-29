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
  FiX,
} from "react-icons/fi";
import { motion } from "framer-motion";

const CustomerDetails = ({ customer, onClose }) => {
  const [activeIndex, setActiveIndex] = useState(null);
  console.log(customer);
  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
  function Section({ title, children }) {
    const [isOpen, setIsOpen] = useState(true);
  
    return (
      <div className="p-4 bg-admin rounded-lg my-4">
        <button 
          className="text-lg font-bold text-cyan-500 flex justify-between items-center focus:outline-none w-full"
          onClick={() => setIsOpen(!isOpen)}
        >
          {title}
          {isOpen ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {isOpen && children}
      </div>
    );
  }
  
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
      className="flex-none overflow-scroll  h-screen  bg-card text-gray-200 p-4 flex flex-col px-4 transition-all duration-500 ease-in-out transform"
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
            {customer.applicant.fullName}
          </h2>
        </div>
        <Section title="Personal Info">
          <div className="my-2 flex items-center ">
            <FiMail className="mr-2" /> {customer.applicant.Email}
          </div>
          <hr className="opacity-20" />
          <div className="my-2 flex items-center">
            <FiPhone className="mr-2" /> {customer.applicant.Phone}
          </div>
          <hr className="opacity-20" />
          <div className="my-2 flex items-center">
            <FiCalendar className="mr-2" /> {customer.applicant.Dob}
          </div>
          <hr className="opacity-20" />
          <div className="my-2 flex items-center">
            <FiHome className="mr-2" />
            {customer.applicant.Address}
            {customer.AptNumber && ` Apt: ${customer.applicant.AptNumber}`}{" "}
            {/* If AptNumber exists, display it */}
            {customer.applicant.City}, {" "}
            {customer.applicant.State}{" "} {customer.applicant.ZipCode}
          </div>
          <hr className="opacity-20" />
          <h4 className="text-lg font-bold mb-2 mt-8 text-cyan-500 ">
            Residence Info
          </h4>
          <div className="my-2 flex items-center font-bold">
            Housing Status: <span className=" ml-1 font-normal"> {customer.applicant.HousingStatus}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Monthly Payment: <span className=" ml-1 font-normal"> ${customer.applicant.MonthlyPayment}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Residence Duration: <span className=" ml-1 font-normal"> {customer.applicant.ResidenceDuration}</span>
          </div>
          
          </Section>

          <Section title="Employment">

          <div className="my-2 flex items-center font-bold">
           Current Employer: <span className=" ml-1 font-normal"> {customer.employment.CurrentEmployer}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Duration: <span className=" ml-1 font-normal"> {customer.employment.Duration}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Position: <span className=" ml-1 font-normal"> {customer.employment.Position}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Annual Income: <span className=" ml-1 font-normal"> {customer.employment.GrossAnnualIncome}</span>
          </div>
         
        </Section>

        
        <Section title="Vehicle Info">
          <div className="my-2 flex items-center font-bold">
           Make: <span className=" ml-1 font-normal"> {customer.vehicle.Make}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Mileage: <span className=" ml-1 font-normal"> {customer.vehicle.Mileage}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            VIN: <span className=" ml-1 font-normal"> {customer.vehicle.Vin}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Year: <span className=" ml-1 font-normal"> {customer.vehicle.Year}</span>
          </div>
         
        </Section>
        {/* <div className="p-4 bg-admin rounded-lg my-4">
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
            <span className="font-bold mr-1">Down Payment: </span>{" "}
            {customer.downPayment.toFixed(2)}{" "}
          </div>
        </div> */}

        {/* <div className="p-4 bg-admin rounded-lg my-4">
          <h4 className="text-lg font-bold text-cyan-500">References</h4>
          {customer.references &&
            customer.references.length > 0 &&
            customer.references.map((reference, index) => (
              <div key={index} className="bg-card px-4 py-2 mt-4 rounded-lg">
                <button
                  className="flex justify-between items-center w-full text-left text-white"
                  onClick={() => handleClick(index)}
                >
                  <span className="font-medium text-md">
                    {reference.firstName} {reference.lastName}
                  </span>
                  {activeIndex === index ? (
                    <FiChevronUp className="text-white" />
                  ) : (
                    <FiChevronDown className="text-white" />
                  )}
                </button>
                {activeIndex === index && (
                  <div className="mt-2">
                    <div className="flex items-center text-white">
                      <FiHome className="mr-2" />
                      <p>
                        {reference.address} {reference.city} {reference.state},{" "}
                        {reference.zipCode}
                      </p>
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
        </div> */}

        {/* <div className="bg-admin text-white text-center rounded-lg my-2 mx-auto flex flex-col justify-between py-8 items-center space-y-4 ">
          <div className="text-xl ">Car Price</div>
          <div className="text-4xl font-bold text-cyan-500">
            ${customer.carPrice.toFixed(2)}
          </div>
          <div className="text-md text-gray-400 font-semibold">
            {" "}
            Due June 5, 2024
          </div>
        </div> */}
      </div>
    </motion.div>
  );
};

export default CustomerDetails;
