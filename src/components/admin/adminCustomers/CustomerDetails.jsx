import React, { useState, Fragment } from "react";
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
import Modal from "./forms/Modal";

const SECTION_NAMES = ["Personal Info", "Employment", "Vehicle Info"];

const CustomerDetails = ({ customer, onClose }) => {
  const [activeModal, setActiveModal] = useState(null);
  const [openSections, setOpenSections] = useState(
    SECTION_NAMES.reduce((acc, curr) => ({ ...acc, [curr]: true }), {})
  ); // Initialize all sections as open

  const openModal = (modalName) => {
    setActiveModal(modalName);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  const functionToTrigger = () => {
    console.log("Function triggered");
  };

  function currencyFormatter(value) {
    return "$" + parseFloat(value).toFixed(2);
  }

  function getStatusColor(status) {
    switch (status) {
      case "pending":
        return "bg-gray-400";
      case "late":
        return "bg-red-500";
      case "approved":
      case "on time":
        return "bg-green-500";
      default:
        return "bg-cardAlt"; // default color, you can change this
    }
  }

  const toggleSection = (sectionName) => {
    setOpenSections((prevState) => ({
      ...prevState,
      [sectionName]: !prevState[sectionName],
    }));
  };

  const handleClick = (index) => {
    setActiveIndex(index === activeIndex ? null : index);
  };
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
      <div className="p-4 mt-8 text-gray-300">
        <div className="mb-8 p-4 rounded-lg bg-admin relative">
          <div className="absolute top-4 left-4">
            <span
              className={`inline-block w-4 h-4 rounded-full ${getStatusColor(
                customer.status || "temp"
              )}`}
            ></span>
          </div>

          <div className="p-4 ">
            <h2 className="text-2xl font-bold mb-6 pt-4 text-center">
              {customer.applicant.fullName}
            </h2>

            {/* <h3 className="ml-2 font-bold text">
              Balance Remaining: <span className="font-normal">1,000</span>
            </h3>
            <h3 className="ml-2 font-bold text">
              Total Paid: <span className="font-normal">1,000</span>
            </h3>
            <h3 className="ml-2 font-bold text">
              Months Remaining: <span className="font-normal">20</span>
            </h3> */}

            <hr className="opacity-20 mt-2 mx-2"></hr>
          </div>

          <div className="p-4">
  <h2 className="text-lg font-bold text-cyan-500 ml-2 mt-2 mb-2">
    Actions
  </h2>
  <div className="flex flex-row">
    <button
      onClick={() => openModal("origination")}
      className="w-1/2 border-cyan-600 border-2 text-gray-300 px-4 py-[.4rem] rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200 m-2"
    >
      Origination Fee
    </button>
    <button
      onClick={() => openModal("downPayment")}
      className="w-1/2 border-cyan-600 border-2 text-gray-300 px-4 py-[.4rem] rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200 m-2"
    >
      Down Payment
    </button>
  </div>
  <div className="flex flex-row">
    <button
      onClick={() => openModal("createPayment")}
      className="w-1/2 border-cyan-600 border-2 text-gray-300 px-4 py-[.4rem] rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200 m-2"
    >
      Create Payment
    </button>
    <button
      onClick={() => openModal("manualInvoice")}
      className="w-1/2 border-cyan-600 border-2 text-gray-300 px-4 py-[.4rem] rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200 m-2"
    >
      Add Invoice
    </button>
  </div>

  {/* Dropdown for Status */}
  <div className="flex flex-row mt-2">
    <select
      id="status"
      className="w-1/2 m-2 border-cyan-600 border-2 text-gray-300 px-4 py-[.4rem] rounded-lg bg-transparent hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200"
    >
      <option value="approved">Approved</option>
      <option value="pending">Pending</option>
      
    </select>
  </div>
  <div></div>
</div>

          <Modal
            isOpen={activeModal === "origination"}
            closeModal={closeModal}
            title="Origination Fee Invoice"
            customer={customer}
            fields={[
              {
                name: "originFee.invoiceAmount",
                label: "Invoice Amount",
                type: "number",
                requiredMessage: "This field is required",
              },
              // other fields...
            ]}
           
          />

          <Modal
            isOpen={activeModal === "downPayment"}
            closeModal={closeModal}
            title="Down Payment Invoice"
            customer={customer}
            fields={[
              {
                name: "downPayment.invoiceAmount",
                label: "Total",
                type: "number",
                requiredMessage: "This field is required",
              },
              // other fields...
            ]}
           
          />

          <Modal
            isOpen={activeModal === "createPayment"}
            closeModal={closeModal}
            title="Monthly Payment Plan"
            customer={customer}
            fields={[
              {
                name: "monthlyPayment.carPrice",
                label: "Car Price",
                type: "number",
                requiredMessage: "This field is required",
              },
              {
                name: "monthlyPayment.downPayment",
                label: "Down Payment",
                type: "number",
                requiredMessage: "This field is required",
              },
              {
                name: "monthlyPayment.interestRate",
                label: "Interest Rate",
                type: "number",
                requiredMessage: "This field is required",
              },
              {
                name: "monthlyPayment.terms",
                label: "Terms",
                type: "select",
                requiredMessage: "This field is required",
                options: ["12 months", "24 months", "36 months", "48 months"], // Define the options here
              },
              // other fields...
            ]}
          
          />
          <Modal
            isOpen={activeModal === "manualInvoice"}
            closeModal={closeModal}
            title="Manual Invoice"
            customer={customer}
            fields={[
              {
                name: "manualInvoice.invoiceAmount",
                label: "Total",
                type: "number",
                requiredMessage: "This field is required",
              },
              // other fields...
            ]}
           
          />
        </div>

        <Section title="Personal Info" name="Personal Info">
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
            {customer.applicant.City}, {customer.applicant.State}{" "}
            {customer.applicant.ZipCode}
          </div>
          <hr className="opacity-20" />
          <h4 className="text-lg font-bold mb-2 mt-8 text-cyan-500 ">
            Residence Info
          </h4>
          <div className="my-2 flex items-center font-bold">
            Housing Status:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.applicant.HousingStatus}
            </span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Monthly Payment:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              ${customer.applicant.MonthlyPayment}
            </span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Residence Duration:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.applicant.ResidenceDuration}
            </span>
          </div>
        </Section>

        <Section title="Employment" name="Employment">
          <div className="my-2 flex items-center font-bold">
            Current Employer:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.employment.CurrentEmployer}
            </span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Duration:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.employment.Duration}
            </span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Position:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.employment.Position}
            </span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Annual Income:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.employment.GrossAnnualIncome}
            </span>
          </div>
        </Section>

        <Section title="Vehicle Info" name="Vehicle Info">
        <div className="my-2 flex items-center font-bold">
            Insurance Number:{" "}
            <span className=" ml-1 font-normal"> {customer.vehicle.insuranceNum}</span>
          </div>
          <hr className="opacity-20" />
          <div className="my-2 flex items-center font-bold">
            Make:{" "}
            <span className=" ml-1 font-normal"> {customer.vehicle.Make}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Mileage:{" "}
            <span className=" ml-1 font-normal">
              {" "}
              {customer.vehicle.Mileage}
            </span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            VIN:{" "}
            <span className=" ml-1 font-normal"> {customer.vehicle.Vin}</span>
          </div>
          <hr className="opacity-20" />

          <div className="my-2 flex items-center font-bold">
            Year:{" "}
            <span className=" ml-1 font-normal"> {customer.vehicle.Year}</span>
          </div>
        </Section>
      </div>
    </motion.div>
  );
};

export default CustomerDetails;
