import React from "react";

const ContactInformation = ({ newCustomer, setNewCustomer, errors }) => {
  const {
    nameError,
    emailError,
    phoneError,
    addressError,
    cityError,
    stateError,
    zipCodeError,
  } = errors;
  const states = ["State1", "State2", "State3", "State4"]; // add all states

  // handle onChange logic here

  return (
    <>
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
              <div className="-mt-2 mb-1 text-white font-medium">Last Name</div>
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
              <div className="-mt-2 mb-1 text-white font-medium">Zip Code</div>
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
    </>
  );
};

export default ContactInformation;
