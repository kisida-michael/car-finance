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
import { deleteStripeCustomer } from "../../../utils/stripe";

const CustomerCard = ({
  customer,
  fetchData,
  onClick,
  onOpenModal,
  isEvenRow,
}) => {
  let [isOpen, setIsOpen] = useState(false);

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }
  const deleteCustomer = async () => {
    try {
      // Close the confirmation dialog
      closeModal();
      console.log(customer.cusID);

      // Get the user's UID from the customer document
      const uid = customer.uid;

      // Delete the user document from the users collection
      const userDocRef = doc(firestore, "users", uid);
      console.log(userDocRef);

      try {
        // Delete the user document
        await deleteDoc(userDocRef);
      } catch (error) {
        console.error("Error deleting user: ", error);
        throw error;
      }

      // Delete the customer from firebase
      const customerDocRef = doc(firestore, "customers", customer.cusID);
      console.log(customerDocRef);

      try {
        // Delete the customer document
        await deleteDoc(customerDocRef);
      } catch (error) {
        console.error("Error deleting customer: ", error);
        throw error;
      }

      // Delete the customer from Stripe
      try {
        await deleteStripeCustomer(customer.stripeCustomerId);
      } catch (error) {
        console.error("Error deleting Stripe customer: ", error);
        throw error;
      }

      await fetchData();
    } catch (error) {
      console.error("Error during customer deletion: ", error);
    }
  };

  return (
    <div
      className={`bg-card p-2 h-[4.8vh] rounded-lg mb-2 flex items-center font-regular ${
        isEvenRow ? "bg-card" : "bg-cardAlt"
      }`}
      // style={{ height: "4.5vh" }} // Change '10vh' to the desired height relative to the viewport height
    >
      <div className="flex flex-1 items-center space-x-4">
        <FiUser className="mr-2 text-2xl text-cyan-500 font-bold" />
        <div className="flex-1 font-semibold">
          {customer.applicant.fullName}
        </div>
        <div className="ml-8 flex-1 flex items-center space-x-2">
          <FiMail className="mr-2 -ml-9 text-cyan-500 font-bold" />
          <div>{customer.applicant.Email}</div>
        </div>
        <div className="flex-1 flex items-center space-x-2">
          <FiPhone className="mr-2 -ml-2 text-cyan-500 font-bold" />
          <div>{customer.applicant.Phone}</div>
        </div>
      </div>
      <button
        className="ml-4 mr-4 border-cyan-600 border-2 text-white px-4 py-[.2rem] rounded-lg hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200"
        onClick={onClick}
      >
        Select
      </button>
      <Menu
        as="div"
        className="relative rounded-md inline-block text-left items-center mt-1"
      >
        <div>
          <Menu.Button className="text-2xl cursor-pointer">
            <FiMoreVertical />
          </Menu.Button>
        </div>
        <Menu.Items className="absolute rounded-md right-0 w-28 mt-2 origin-top-right bg-[#1A1926]  divide-y divide-gray-600 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <Menu.Item>
            {({ active }) => (
              <div
                className={`w-full py-1 px-4 text-white  ${
                  active ? "bg-gray-800" : ""
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <FiEdit className="mr-2" />
                  <span>Edit</span>
                </div>
              </div>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button
                onClick={openModal}
                className={`w-full py-1 px-4 text-white  ${
                  active ? "bg-gray-800" : ""
                } cursor-pointer`}
              >
                <div className="flex items-center">
                  <FiTrash className="mr-2" />
                  <span>Delete</span>
                </div>
              </button>
            )}
          </Menu.Item>
        </Menu.Items>
      </Menu>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 z-10 overflow-y-auto"
          onClose={closeModal}
        >
          <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />

          <div className="flex min-h-screen items-center justify-center px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-card p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-white"
                >
                  Delete Customer?
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-300">
                    Are you sure you want to delete this customer? This cannot
                    be undone.
                  </p>
                </div>

                <div className="mt-4 space-x-2">
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                    onClick={deleteCustomer}
                  >
                    Confirm
                  </button>
                  <button
                    type="button"
                    className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CustomerCard;
