// validation.js
import { useState } from "react";

const validateEmail = (email) => {
  // Regular expression for email validation
  const re = /\S+@\S+\.\S+/;
  return re.test(email);
};

const validatePhoneNumber = (phoneNumber) => {
  const re = /^\(\d{3}\) \d{3}-\d{4}$/;
  return re.test(String(phoneNumber));
};

export const useValidation = () => {
  const [emailError, setEmailError] = useState(null);
  const [phoneError, setPhoneError] = useState(null);
  const [nameError, setNameError] = useState(null);
  const [carPriceError, setcarPriceError] = useState(null);
  const [interestError, setInterestError] = useState(null);
  const [termsError, setTermsError] = useState(null);
  const [addressError, setAddressError] = useState(null);
  const [cityError, setCityError] = useState(null);
  const [stateError, setStateError] = useState(null);
  const [zipCodeError, setZipCodeError] = useState(null);
  const [downPaymentError, setDownPaymentError] = useState(null);

  const validateCustomer = (newCustomer) => {
    let errors = [];

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

    if (!newCustomer.carPrice) {
      setcarPriceError("Please enter a Value");
      errors.push("carPrice");
    } else {
      setcarPriceError(null);
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

    if (!newCustomer.address) {
      setAddressError("Please enter an address");
      errors.push("address");
    } else {
      setAddressError(null);
    }

    if (!newCustomer.city) {
      setCityError("Please enter a city");
      errors.push("city");
    } else {
      setCityError(null);
    }

    if (!newCustomer.state) {
      setStateError("Please enter a state");
      errors.push("state");
    } else {
      setStateError(null);
    }

    if (!newCustomer.zipCode) {
      setZipCodeError("Please enter a zip code");
      errors.push("zipCode");
    } else {
      setZipCodeError(null);
    }

    if (!newCustomer.downPayment) {
      setDownPaymentError("Please enter a down payment");
      errors.push("downPayment");
    } else {
      setDownPaymentError(null);
    }

    // implement the rest of your validation logic here
    // ...

    return errors;
  };

  return {
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
  };
};
