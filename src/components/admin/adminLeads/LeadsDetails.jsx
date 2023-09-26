import React, { useState } from "react";
import { motion } from "framer-motion";
import { FiX, FiChevronDown, FiChevronUp, FiMail, FiPhone } from "react-icons/fi";

const SECTION_NAMES = ["Contact Info", "Trade-In Info", "Loan Info"];

const LeadsDetails = ({ leads, onClose }) => {
  const toggleSection = (sectionName) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  };

  const tradeInDetails = [
    { label: 'Color', field: 'tradeInColor' },
    { label: 'Make', field: 'tradeInMake' },
    { label: 'Miles', field: 'tradeInMiles' },
    { label: 'Model', field: 'tradeInModel' },
    { label: 'Trim', field: 'tradeInTrim' },
    { label: 'VIN', field: 'tradeInVin' },
    { label: 'Year', field: 'tradeInYear' },
  ];


  function Section({ title, children, name }) {
    return (
      <div className="p-4 bg-admin rounded-md my-4">
        <button
          className="text-lg font-bold text-cyan-500 flex justify-between items-center focus:outline-none w-full"
          onClick={() => toggleSection(name)}
        >
          {title}
          {openSections[name] ? <FiChevronUp /> : <FiChevronDown />}
        </button>
        {openSections[name] && children}
      </div>
    );
  }
  const [openSections, setOpenSections] = useState(
    SECTION_NAMES.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
  ); //

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
        className="absolute top-4 left-8 bg-cardAlt text-gray-200 rounded-full h-8 w-8 flex items-center justify-center hover:bg-gray-300 transition-colors hover:text-red-500"
        onClick={onClose}
      >
        <FiX />
      </button>
      <div className="p-4 mt-8">
        <div className="">
          <h2 className="text-2xl font-bold  text-center">{leads.name}</h2>
        </div>
        <Section title="Contact Info" name="Contact Info">
        <div className="my-2 flex items-center ">
            <FiMail className="mr-2" /> {leads.email}
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center ">
            <FiPhone className="mr-2" /> {leads.phoneNumber}
          </div>
          
        </Section>
        <Section title="Loan Info" name="Loan Info">
        <div className="my-2 flex items-center font-bold">
            Loan Amount:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              ${leads.loanAmount}
            </span>
          </div>
          <hr className="opacity-20" />
          <div className="my-2 flex items-center font-bold">
            Down Payment:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              ${leads.downpayment}
            </span>
          </div>
          <hr className="opacity-20" />
          <div className="my-2 flex items-center font-bold">
            Monthly Income:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              ${leads.monthlyIncome}
            </span>
          </div>
          
        </Section>
        {
  leads.tradeIn && (
    <Section title="Trade-In Info" name="Trade-In Info">
      {tradeInDetails.map((detail, index) => (
        <div key={index}>
          <div className="my-2 flex items-center font-bold">
            {detail.label}:
            <span className="ml-1 font-normal">{leads[detail.field]}</span>
          </div>
          {index !== tradeInDetails.length - 1 && <hr className="opacity-20" />}
        </div>
      ))}
    </Section>
  )
}
      </div>
    </motion.div>
  );
};

export default LeadsDetails;
