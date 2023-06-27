import React, { useState, Fragment } from "react";
import {
  FiMail,
  FiPhone,
  FiMoreVertical,
  FiUser,
  FiEdit,
  FiTrash,
} from "react-icons/fi";
import { Menu, Dialog, Transition } from "@headlessui/react";
import { doc, deleteDoc } from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";

const leadsCard = ({ leads, fetchData, onClick, onOpenModal, isEvenRow }) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  return (
    <div
      className={`bg-card p-2 h-[4.8vh] rounded-lg mb-2 flex items-center font-regular ${
        isEvenRow ? "bg-card" : "bg-cardAlt"
      }`}
      // style={{ height: "4.5vh" }} // Change '10vh' to the desired height relative to the viewport height
    >
      <div className="flex flex-1 items-center space-x-4">
        <FiUser className="mr-2 text-2xl text-cyan-500 font-bold" />
        <div className="flex-1 font-semibold">{leads.name}</div>
        <div className="ml-8 flex-1 flex items-center space-x-2">
          <FiMail className="mr-2 -ml-9 text-cyan-500 font-bold" />
          <div>{leads.email}</div>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <FiPhone className="mr-2 -ml-2 text-cyan-500 font-bold" />
          <div>{leads.phoneNumber}</div>
        </div>
      </div>
      <button
        className="ml-4 mr-4 border-cyan-600 border-2 text-white px-4 py-[.2rem] rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200"
        onClick={onClick}
      >
        Select
      </button>
    </div>
  );
};

export default leadsCard;
