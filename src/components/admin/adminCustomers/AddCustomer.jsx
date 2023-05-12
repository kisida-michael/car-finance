import React, { useState } from "react";
import { firestore, auth } from "../../../../firebaseConfig";
import { createUserWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { collection, doc, setDoc, addDoc } from 'firebase/firestore';
import {
  validateEmail,
  validatePhoneNumber,
  formatPhoneNumber,
} from "../../../utils/adminUtils";
import { createStripeCustomer } from "../../../utils/stripe";
const states = [
  "AL",
  "AK",
  "AZ",
  "AR",
  "CA",
  "CO",
  "CT",
  "DE",
  "FL",
  "GA",
  "HI",
  "ID",
  "IL",
  "IN",
  "IA",
  "KS",
  "KY",
  "LA",
  "ME",
  "MD",
  "MA",
  "MI",
  "MN",
  "MS",
  "MO",
  "MT",
  "NE",
  "NV",
  "NH",
  "NJ",
  "NM",
  "NY",
  "NC",
  "ND",
  "OH",
  "OK",
  "OR",
  "PA",
  "RI",
  "SC",
  "SD",
  "TN",
  "TX",
  "UT",
  "VT",
  "VA",
  "WA",
  "WV",
  "WI",
  "WY",
];

// Inside the JSX, replace the state input with the following:

<select
  className="w-full p-2 rounded text-gray-200 bg-card"
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
  const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0, n = charset.length; i < length; ++i) {
    password += charset.charAt(Math.floor(Math.random() * n));
  }
  return password;
};
const AddCustomer = ({ onClose, onAdd }) => {
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [balanceError, setBalanceError] = useState(null);
  const [interestError, setInterestError] = useState(null);
  const [termsError, setTermsError] = useState(null);
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [referenceCollapse, setReferenceCollapse] = useState([false, false, false]);
  const [referenceErrors, setReferenceErrors] = useState([null, null, null]);


  const toggleReferenceCollapse = (index) => {
    setReferenceCollapse((prev) => {
      const newCollapse = [...prev];
      newCollapse[index] = !newCollapse[index];
      return newCollapse;
    });
  };
  const [newCustomer, setNewCustomer] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    balance: 0,
    terms: "",
    interest: 0,
    fullName: "",
    state: "",
    city: "",
    address: "",
    zipCode: "",


  });

  const addCustomer = async (e) => {
    e.preventDefault();

    newCustomer.balance = Number(newCustomer.balance);
    newCustomer.interest = Number(newCustomer.interest);

    const errors = [];

    if (!newCustomer.firstName || !newCustomer.lastName) {
      setNameError("Please enter a first and last name");
      errors.push("name");
    } else {
      setNameError(null);
    }

    if (!validateEmail(newCustomer.email)) {
      setEmailError("Invalid email address");
      errors.push("email");
    } else {
      setEmailError(null);
    }

    if (!validatePhoneNumber(newCustomer.phoneNumber)) {
      setPhoneError("Invalid phone number");
      errors.push("phone");
    } else {
      setPhoneError(null);
    }

    if (!newCustomer.balance) {
      setBalanceError("Please enter a balance");
      errors.push("balance");
    } else {
      setBalanceError(null);
    }

    if (!newCustomer.terms) {
      setTermsError("Please enter a term length");
      errors.push("terms");
    } else {
      setTermsError(null);
    }

    if (!newCustomer.interest) {
      setInterestError("Please enter an interest rate");
      errors.push("interest");
    } else {
      setInterestError(null);
    }

    // newCustomer.references.forEach((reference, index) => {
    //   if (!reference.firstName || !reference.lastName || !validateEmail(reference.email) || !validatePhoneNumber(reference.phoneNumber)) {
    //     const newErrors = [...referenceErrors];
    //     newErrors[index] = 'Please fill in all fields with valid data';
    //     setReferenceErrors(newErrors);
    //     errors.push('reference');
    //   } else {
    //     const newErrors = [...referenceErrors];
    //     newErrors[index] = null;
    //     setReferenceErrors(newErrors);
    //   }
    // });

    if (errors.length > 0) {
      return;
    }
    // Create a new user in Firebase with a default password
    try {
      const randomPassword = generateRandomPassword();
      const { user } = await createUserWithEmailAndPassword(auth, newCustomer.email, randomPassword);
      
      await sendPasswordResetEmail(auth, newCustomer.email);
      // Create a new user document with isAdmin set to false
      const newUser = {
        firstName: newCustomer.firstName,
        lastName: newCustomer.lastName,
        email: newCustomer.email,
        isAdmin: false,
        uid: user.uid, // Add the user's UID from the authentication
      };
    
      const usersCollection = collection(firestore, 'users');
      const userDocRef = doc(usersCollection, user.uid);
      await setDoc(userDocRef, newUser);

      const stripeCustomerId = await createStripeCustomer(newCustomer);
    
      newCustomer.stripeCustomerId = stripeCustomerId; // Store the Stripe customer ID in Firestore
    } catch (error) {
      console.error("Error creating new user:", error);
      // Handle user creation errors here (e.g., set an error message state)
    }
    
    newCustomer.fullName = `${newCustomer.firstName} ${newCustomer.lastName}`;
    const customersCollection = collection(firestore, 'customers');
    await addDoc(customersCollection, newCustomer);
    onAdd();
  };

  return (
    <div className="flex-none w-1/3 h-screen bg-card text-gray-200 p-4 overflow-hidden ">
      <div className="mt-2 p-4 ">
        <h2 className="text-2xl font-semibold mb-8 text-center">
          Add New Customer
        </h2>

        <form
          onSubmit={addCustomer}
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
                  className={`w-full p-2  rounded text-gray-200 bg-card ${
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
                  className={`w-full p-2  rounded text-gray-200 bg-card ${
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
                className={`w-full p-2  rounded text-gray-200 bg-card ${
                  emailError ? "border-red-500 border-2" : ""
                }`}
                type="text"
                placeholder="example@mail.com"
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, email: e.target.value });
                  setEmailError(null); // clear error when user starts typing
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
                className={`w-full p-2  rounded text-gray-200 bg-card ${
                  phoneError ? "border-red-500 border-2" : ""
                }`}
                type="text"
                placeholder="(123)-456-7890"
                value={phoneNumberInput}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setPhoneNumberInput(formatted);
                  setNewCustomer({ ...newCustomer, phoneNumber: formatted });
                  setPhoneError(null); // clear error when user starts typing
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
                  className="w-full p-2  rounded text-gray-200 bg-card"
                  type="text"
                  placeholder="Street Address"
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      address: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-grow">
                {/* City input */}
                <div className="-mt-2 mb-1 text-white font-medium">City</div>
                <input
                  className="w-full p-2  rounded text-gray-200 bg-card"
                  type="text"
                  placeholder="City"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, city: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              {/* State and zip code inputs */}
              <div className="w-1/4">
                <div className="-mt-2 mb-1 text-white font-medium">State</div>
                <select
                  className="w-full p-2 rounded text-gray-400 bg-card"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, state: e.target.value })
                  }
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
                <div className="-mt-2 mb-1 text-white font-medium">
                  Zip Code
                </div>
                <input
                  className="w-full p-2  rounded text-gray-200 bg-card"
                  type="text"
                  placeholder="Zip Code"
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      zipCode: e.target.value,
                    })
                  }
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
            <div>
              {balanceError ? (
                <div className="-mt-2 mb-1 text-red-500">{balanceError}</div>
              ) : (
                <div className="-mt-2 mb-1 text-white font-medium">
                  Total Payment Amount
                </div>
              )}
              <input
                className={`w-full p-2  rounded text-gray-200 bg-card ${
                  balanceError ? "border-red-500 border-2" : ""
                }`}
                type="text"
                placeholder="Balance"
                onChange={(e) =>
                  setNewCustomer({ ...newCustomer, balance: e.target.value })
                }
              />
            </div>
            <div>
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

            <div>
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
          <hr className="border-gray-600" />

{/* References */}
<div className="space-y-4">
  <h2 className="text-white font-semibold text-lg">
    References
  </h2>
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
        Reference {index + 1} {referenceCollapse[index] ? '▲' : '▼'}
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
                  className={`w-full p-2  rounded text-gray-200 bg-card ${
                    referenceErrors[index] ? "border-red-500 border-2" : ""
                  }`}
                  type="text"
                  placeholder="First Name"
                  onChange={(e) => {
                    const updatedReferences = [...newCustomer.references];
                    updatedReferences[index] = {
                      ...updatedReferences[index],
                      firstName: e.target.value,
                    };
                    setNewCustomer({ ...newCustomer, references: updatedReferences });
                  }}
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
                  className={`w-full p-2  rounded text-gray-200 bg-card ${
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
                className={`w-full p-2  rounded text-gray-200 bg-card ${
                  emailError ? "border-red-500 border-2" : ""
                }`}
                type="text"
                placeholder="example@mail.com"
                onChange={(e) => {
                  setNewCustomer({ ...newCustomer, email: e.target.value });
                  setEmailError(null); // clear error when user starts typing
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
                className={`w-full p-2  rounded text-gray-200 bg-card ${
                  phoneError ? "border-red-500 border-2" : ""
                }`}
                type="text"
                placeholder="(123)-456-7890"
                value={phoneNumberInput}
                onChange={(e) => {
                  const formatted = formatPhoneNumber(e.target.value);
                  setPhoneNumberInput(formatted);
                  setNewCustomer({ ...newCustomer, phoneNumber: formatted });
                  setPhoneError(null); // clear error when user starts typing
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
                  className="w-full p-2  rounded text-gray-200 bg-card"
                  type="text"
                  placeholder="Street Address"
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      streetAddress: e.target.value,
                    })
                  }
                />
              </div>
              <div className="flex-grow">
                {/* City input */}
                <div className="-mt-2 mb-1 text-white font-medium">City</div>
                <input
                  className="w-full p-2  rounded text-gray-200 bg-card"
                  type="text"
                  placeholder="City"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, city: e.target.value })
                  }
                />
              </div>
            </div>
            <div className="flex gap-4">
              {/* State and zip code inputs */}
              <div className="w-1/4">
                <div className="-mt-2 mb-1 text-white font-medium">State</div>
                <select
                  className="w-full p-2 rounded text-gray-400 bg-card"
                  onChange={(e) =>
                    setNewCustomer({ ...newCustomer, state: e.target.value })
                  }
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
                <div className="-mt-2 mb-1 text-white font-medium">
                  Zip Code
                </div>
                <input
                  className="w-full p-2  rounded text-gray-200 bg-card"
                  type="text"
                  placeholder="Zip Code"
                  onChange={(e) =>
                    setNewCustomer({
                      ...newCustomer,
                      zipCode: e.target.value,
                    })
                  }
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
    </div>
  );
};

export default AddCustomer;
