import React, { useState } from "react";
import { firestore, auth } from "../../../../firebaseConfig";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { collection, doc, setDoc, addDoc } from "firebase/firestore";
import { useValidation } from "../../../utils/validation";
import { states } from "../../../utils/constants";
import {
  validateEmail,
  validatePhoneNumber,
  formatPhoneNumber,
} from "../../../utils/adminUtils";
import { createStripeCustomer } from "../../../utils/stripe";
import { motion } from "framer-motion";

// Inside the JSX, replace the state input with the following:

<select
  className="w-full p-2 rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
  onChange={(e) => setNewCustomer({ ...newCustomer, state: e.target.value })}
>
  <option value="" className="text-gray-400">
    Select State
  </option>
  {states.map((state) => (
    <option key={state} value={state} className="text-gray-400">
      {state}
    </option>
  ))}
</select>;

const generateRandomPassword = () => {
  // A simple random password generator function
  const length = 12;
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};
const AddCustomer = ({ onClose, onAdd }) => {

  const slideIn = {
    hidden: { x: "100%" }, // Start from the right
    visible: { x: "0%", transition: { duration: 0.2 } }, // Slide to the left
    exit: { x: "100%", transition: { duration: 0.2 } }, // Slide out to the right
  };

  const {
    emailError,
    phoneError,
    nameError,
    carPriceError,
    interestError,
    termsError,
    addressError,
    cityError,
    stateError,
    zipCodeError,
    downPaymentError,
    validateCustomer,
  } = useValidation();

  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [referenceCollapse, setReferenceCollapse] = useState([
    false,
    false,
    false,
  ]);
  const [referenceErrors, setReferenceErrors] = useState([null, null, null]);
  const [createDownPayment, setCreateDownPayment] = useState(false);
  const [createOriginationFee, setCreateOriginationFee] = useState(false);

  const toggleReferenceCollapse = (index) => {
    setReferenceCollapse((prev) => {
      const newCollapse = [...prev];
      newCollapse[index] = !newCollapse[index];
      return newCollapse;
    });
  };
  const [newCustomer, setNewCustomer] = useState({
    fullName: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    state: "",
    city: "",
    address: "",
    zipCode: "",
    terms: "",
    interest: 0,
    carPrice: 0,
    downPayment: 0,
    originationFee: 0,
    references: [
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
      {
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        address: "",
        city: "",
        state: "",
        zipCode: "",
      },
    ],
  });
  const createCustomer = async (e) => {
    e.preventDefault();

    newCustomer.carPrice = Number(newCustomer.carPrice);
    newCustomer.interest = Number(newCustomer.interest);
    newCustomer.downPayment = Number(newCustomer.downPayment);

    let errors = validateCustomer(newCustomer);
    if (errors.length > 0) {
      return;
    }

    // Create a new user in Firebase with a default password
    try {
      const randomPassword = generateRandomPassword();
      const { user } = await createUserWithEmailAndPassword(
        auth,
        newCustomer.email,
        randomPassword
      );

      await sendPasswordResetEmail(auth, newCustomer.email);

      // Create a new user document with isAdmin set to false
      const newUser = {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
        isAdmin: false,
        uid: user.uid, // Add the user's UID from the authentication
      };

      const usersCollection = collection(firestore, "users");
      const userDocRef = doc(usersCollection, user.uid);
      await setDoc(userDocRef, newUser);
      console.log(createDownPayment, createOriginationFee);
      const stripeCustomerId = await createStripeCustomer(
        newCustomer,
        createDownPayment,
        createOriginationFee
      );

      newCustomer.stripeCustomerId = stripeCustomerId; // Store the Stripe customer ID in Firestore
    } catch (error) {
      console.error("Error creating new user:", error);
      // Handle user creation errors here (e.g., set an error message state)
    }

    newCustomer.fullName = `${newCustomer.firstName} ${newCustomer.lastName}`;
    const customersCollection = collection(firestore, "customers");

    // Add the customer to Firestore and get the DocumentReference
    const docRef = await addDoc(customersCollection, newCustomer);

    // Store the user's UID in the customer document
    newCustomer.uid = auth.currentUser.uid;
    // Change the id of the customer to cusID
    newCustomer.cusID = docRef.id;

    // Update the document with the new cusID and uid
    await setDoc(docRef, newCustomer);

    onAdd();
  };

  return (
    <motion.div
      variants={slideIn} 
      initial="hidden" 
      animate="visible" 
      exit="exit" className="flex-none lg:w-1/3 w-full  h-screen  bg-card text-gray-200 p-4 flex flex-col px-4 transition-all duration-500 ease-in-out transform">
      <div className="mt-2 p-4 ">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Add New Customer
        </h2>

        <form
          onSubmit={createCustomer}
          className="bg-admin p-12 max-h-[75rem] rounded-lg space-y-6 overflow-y-scroll"
        >
          {/* Contact Information */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-lg">
              Contact Information
            </h2>
            <div className="flex gap-4">
              <div className="flex-grow">
                {nameError ? (
                  <div className="-mt-2 mb-1 text-red-500">{nameError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    First Name
                  </div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    nameError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="First Name"
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      firstName: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-grow">
                {nameError ? (
                  <div className="-mt-2 mb-1 text-red-500">{nameError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Last Name
                  </div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600  ${
                    nameError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="Last Name"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, lastName: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-grow">
                {emailError ? (
                  <div className="-mt-2 mb-1 text-red-500">{emailError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">Email</div>
                )}

                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    emailError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="example@mail.com"
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, email: e.target.value });
                    // emailError(null); // clear error when user starts typing
                  }}
                />
              </div>
              <div>
                {phoneError ? (
                  <div className="-mt-2 mb-1 text-red-500">{phoneError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Phone Number
                  </div>
                )}

                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    phoneError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="(123)-456-7890"
                  value={newCustomer.phoneNumber}
                  onChange={(e) => {
                    const formatted = formatPhoneNumber(e.target.value);
                    setNewCustomer({ ...newCustomer, phoneNumber: formatted });
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-grow">
                {addressError ? (
                  <div className="-mt-2 mb-1 text-red-500">{addressError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Street Address
                  </div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    addressError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="Street Address"
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, address: e.target.value });
                    // setAddressError(null);
                  }}
                />
              </div>
              <div className="flex-grow">
                {cityError ? (
                  <div className="-mt-2 mb-1 text-red-500">{cityError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">City</div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    cityError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="City"
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, city: e.target.value });
                    // setCityError(null);
                  }}
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="w-1/4">
                {stateError ? (
                  <div className="-mt-2 mb-1 text-red-500">{stateError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">State</div>
                )}
                <select
                  className={`w-full p-2 rounded text-gray-400 bg-card ${
                    stateError ? "border-red-500 border-2" : ""
                  }`}
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, state: e.target.value });
                    // setStateError(null);
                  }}
                >
                  <option value="" className="text-gray-400">
                    Select State
                  </option>
                  {states.map((state) => (
                    <option key={state} value={state} className="text-gray-400">
                      {state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex-grow">
                {zipCodeError ? (
                  <div className="-mt-2 mb-1 text-red-500">{zipCodeError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Zip Code
                  </div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    zipCodeError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="Zip Code"
                  onChange={(e) => {
                    setNewCustomer({ ...newCustomer, zipCode: e.target.value });
                    // setZipCodeError(null);
                  }}
                />
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-600" />

          {/* Payment Information */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-lg">
              Payment Information
            </h2>
            <div className="flex gap-4">
              <div className="flex-grow">
                {carPriceError ? (
                  <div className="-mt-2 mb-1 text-red-500">{carPriceError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Car Price
                  </div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    carPriceError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="Car Price"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, carPrice: e.target.value })
                  }
                />
              </div>
              <div className="flex-grow">
                {carPriceError ? (
                  <div className="-mt-2 mb-1 text-red-500">{carPriceError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Down Payment
                  </div>
                )}
                <input
                  className={`w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600 ${
                    downPaymentError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="Down Payment"
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      downPayment: e.target.value,
                    })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              <div className="flex-grow">
                {termsError ? (
                  <div className="-mt-2 mb-1 text-red-500">{termsError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Monthly Terms
                  </div>
                )}
                <select
                  className={`w-full p-2 rounded text-gray-400 bg-card ${
                    termsError ? "border-red-500 border-2" : ""
                  }`}
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, terms: e.target.value })
                  }
                >
                  <option value="" className="text-gray-400">
                    Select Terms
                  </option>
                  <option value="12" className="text-gray-400">
                    12 Months
                  </option>
                  <option value="24" className="text-gray-400">
                    24 Months
                  </option>
                  <option value="36" className="text-gray-400">
                    36 Months
                  </option>
                  <option value="48" className="text-gray-400">
                    48 Months
                  </option>
                  <option value="60" className="text-gray-400">
                    60 Months
                  </option>
                  <option value="72" className="text-gray-400">
                    72 Months
                  </option>
                  <option value="84" className="text-gray-400">
                    84 Months
                  </option>
                  <option value="96" className="text-gray-400">
                    96 Months
                  </option>
                </select>
              </div>

              <div className="flex-grow">
                {interestError ? (
                  <div className="-mt-2 mb-1 text-red-500">{interestError}</div>
                ) : (
                  <div className="-mt-2 mb-1 text-white font-medium">
                    Interest Rate
                  </div>
                )}
                <input
                  className={`w-full p-2 rounded text-gray-400 bg-card ${
                    interestError ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="Interest"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, interest: e.target.value })
                  }
                />
              </div>
            </div>
            {/* Origination Fee */}
            <div className="flex-grow">
              <div className="-mt-2 mb-1 text-white font-medium">
                Origination Fee
              </div>
              <input
                className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                type="text"
                placeholder="Origination Fee"
                onChange={(e) =>
                  setNewCustomer({
                    ...newCustomer,
                    originationFee: e.target.value,
                  })
                }
              />
              <div className="flex items-center mt-4">
                <input
                  type="checkbox"
                  className="text-cyan-500 rounded-sm"
                  onChange={(e) => setCreateOriginationFee(e.target.checked)}
                />
                <label className="text-white ml-2">
                  Create Origination Fee Invoice
                </label>
              </div>
            </div>

            

            {/* Down Payment */}
            <div className="flex-grow">
              {/* existing input field */}
              <div className="flex items-center mt-2">
                <input
                  type="checkbox"
                  className="text-cyan-500 rounded-sm"
                  onChange={(e) => setCreateDownPayment(e.target.checked)}
                />
                <label className="text-white ml-2">
                  Create Down Payment Invoice
                </label>
              </div>
            </div>
          </div>
          <hr className="border-gray-600" />

          {/* References */}
          <div className="space-y-4">
            <h2 className="text-white font-semibold text-lg">References</h2>
            {Array.from({ length: 3 }, (_, index) => (
              <div key={index} className="space-y-2">
                <button
                  type="button"
                  className="text-white font-medium"
                  onClick={(e) => {
                    e.preventDefault();
                    toggleReferenceCollapse(index);
                  }}
                >
                  Reference {index + 1} {referenceCollapse[index] ? "▲" : "▼"}
                </button>
                {referenceCollapse[index] && (
                  <>
                    <div className="flex gap-4">
                      <div className="flex-grow">
                        {referenceErrors[index] && (
                          <div className="-mt-2 mb-1 text-red-500">
                            {referenceErrors[index]}
                          </div>
                        )}

                        <div className="-mt-2 mb-1 text-white font-medium">
                          First Name
                        </div>

                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="First Name"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              firstName: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        <div className="-mt-2 mb-1 text-white font-medium">
                          Last Name
                        </div>

                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="Last Name"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              lastName: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-grow">
                        <div className="-mt-2 mb-1 text-white font-medium">
                          Email
                        </div>

                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="example@mail.com"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              email: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                      <div>
                        <div className="-mt-2 mb-1 text-white font-medium">
                          Phone Number
                        </div>

                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="(123)-456-7890"
                          value={
                            newCustomer.references[index]?.phoneNumber || ""
                          }
                          onChange={(e) => {
                            const formatted = formatPhoneNumber(e.target.value);
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              phoneNumber: formatted,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-grow">
                        {/* Street address input */}
                        <div className="-mt-2 mb-1 text-white font-medium">
                          Street Address
                        </div>
                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="Street Address"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              address: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                      <div className="flex-grow">
                        {/* City input */}
                        <div className="-mt-2 mb-1 text-white font-medium">
                          City
                        </div>
                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="City"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              city: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                    </div>
                    <div className="flex gap-4">
                      {/* State and zip code inputs */}
                      <div className="w-1/4">
                        <div className="-mt-2 mb-1 text-white font-medium">
                          State
                        </div>
                        <select
                          className="w-full p-2 rounded text-gray-400 bg-card"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              state: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        >
                          <option value="" className="text-gray-400">
                            Select State
                          </option>
                          {states.map((state) => (
                            <option
                              key={state}
                              value={state}
                              className="text-gray-400"
                            >
                              {state}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="flex-grow">
                        <div className="-mt-2 mb-1 text-white font-medium">
                          Zip Code
                        </div>
                        <input
                          className="w-full p-2  rounded-md text-gray-200 bg-card ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                          type="text"
                          placeholder="Zip Code"
                          onChange={(e) => {
                            const updatedReferences = [
                              ...newCustomer.references,
                            ];
                            updatedReferences[index] = {
                              ...updatedReferences[index],
                              zipCode: e.target.value,
                            };
                            setNewCustomer({
                              ...newCustomer,
                              references: updatedReferences,
                            });
                          }}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Divider */}
          <hr className="border-gray-600" />
          <div className="flex space-x-4">
            <button
              type="submit"
              className="w-full bg-green-600 text-gray-200 px-4 py-2 rounded-lg hover:bg-green-800 transition-all duration-300"
            >
              Add Customer
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-full bg-red-700 text-gray-200 px-4 py-2 rounded-lg hover:bg-red-900 transition-all duration-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      </motion.div>
  );
};

export default AddCustomer;
