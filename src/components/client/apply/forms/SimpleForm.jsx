import React, { useState } from "react";
import {
  FormInput,
  FormSelect,
  FormCheckbox,
  FormPhone,
  FormEmail,
} from "./FormComponents";
import { carMakes } from "../../../../utils/constants";

const SimpleForm = ({ formMethods }) => {
  const {
    register,
    control,
    formState: { errors },
  } = formMethods;
  const [isTradeInFieldsVisible, setTradeInFieldsVisible] = useState(false);
  const [phone, setPhone] = useState("");
  const [income, setIncome] = useState("");
  const [loanAmount, setLoanAmount] = useState("");
  const [downpayment, setDownpayment] = useState(""); // Add this to your state variables

  const toggleTradeInFields = () => {
    setTradeInFieldsVisible(!isTradeInFieldsVisible);
  };
  const [miles, setMiles] = useState(""); // Add this to your state variables
  const handleDownpaymentChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    value = value ? (value / 100).toFixed(2) : ""; // Divide by 100 and fix to 2 decimal places only if there's a value
    value = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
      value
    ); // Add commas
    setDownpayment(value);
  };
  const handleMilesChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    value = new Intl.NumberFormat("en-US").format(value); // Add commas
    setMiles(value);
  };

  const handleIncomeChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    value = value ? (value / 100).toFixed(2) : ""; // Divide by 100 and fix to 2 decimal places only if there's a value
    value = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
      value
    ); // Add commas
    setIncome(value);
  };

  const handleLoanChange = (event) => {
    let value = event.target.value;
    value = value.replace(/[^\d]/g, ""); // Remove all non-numeric characters
    value = value ? (value / 100).toFixed(2) : ""; // Divide by 100 and fix to 2 decimal places only if there's a value
    value = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2 }).format(
      value
    ); // Add commas
    setLoanAmount(value);
  };

  const handlePhoneChange = (event) => {
    let value = event.target.value.replace(/\D/g, "");

    // Limit input to 10 digits
    if (value.length > 10) {
      value = value.slice(0, 10);
    }

    let formattedValue = "";

    if (value.length > 0) {
      formattedValue += "(" + value.substring(0, 3);
    }
    if (value.length >= 3) {
      formattedValue += ") " + value.substring(3, 6);
    }
    if (value.length >= 6) {
      formattedValue += " - " + value.substring(6);
    }

    setPhone(formattedValue);
  };

  return (
    <form className="p-4 space-y-4">
      <h2 className="text-2xl text-cyan-500 mb-10 font-semibold">
        Loan Request
      </h2>
      <div className="flex flex-wrap -mx-3">
        <FormInput
          name="name"
          register={register}
          requiredMessage="Name is required"
          placeholder="Name"
          errors={errors}
        />
        <FormPhone
          name="phoneNumber"
          register={register}
          requiredMessage="Phone Number is required"
          placeholder="Phone Number*"
          value={phone}
          onChange={handlePhoneChange}
          errors={errors}
        />
        <FormEmail
          name="email"
          register={register}
          requiredMessage="Email is required"
          placeholder="Email"
          errors={errors}
        />
        <FormInput
          name="loanAmount"
          register={register}
          requiredMessage="Loan amount is required"
          placeholder="Loan Amount"
          value={loanAmount}
          onChange={handleLoanChange}
          errors={errors}
          prefix="$"
        />
        <FormInput
          name="downpayment"
          register={register}
          requiredMessage="Down payment is required"
          placeholder="Down payment"
          value={downpayment}
          onChange={handleDownpaymentChange}
          errors={errors}
          prefix="$"
        />
        <FormInput
          name="monthlyIncome"
          register={register}
          requiredMessage="Monthly income is required"
          placeholder="Monthly Income"
          value={income}
          onChange={handleIncomeChange}
          errors={errors}
          prefix="$"
        />
      </div>
      <hr className="my-4" />

      <FormCheckbox
        name="TradeIn"
        control={control}
        label="Trade In"
        onChange={toggleTradeInFields}
      />

      <div className="flex flex-wrap -mx-3">
        {isTradeInFieldsVisible && (
          <>
            <FormInput
              name="tradeInYear"
              register={register}
              requiredMessage="Year is required"
              placeholder="Year"
              errors={errors}
            />
            <FormSelect
              name="tradeInMake"
              control={control}
              requiredMessage="Make is required"
              options={carMakes}
              placeholder="Make - Select a Car Make"
              errors={errors}
            />
            <FormInput
              name="tradeInModel"
              register={register}
              requiredMessage="Model is required"
              placeholder="Model"
              errors={errors}
            />

            <FormInput
              name="tradeInMiles"
              register={register}
              requiredMessage="Miles is required"
              placeholder="Miles"
              value={miles}
              onChange={handleMilesChange}
              errors={errors}
            />
            <FormInput
              name="tradeInTrim"
              register={register}
              requiredMessage="Trim is required"
              placeholder="Trim"
              errors={errors}
            />
            <FormInput
              name="tradeInColor"
              register={register}
              requiredMessage="Color is required"
              placeholder="Color"
              errors={errors}
            />
            <FormInput
              name="tradeInVin"
              register={register}
              requiredMessage="VIN is required"
              placeholder="VIN"
              errors={errors}
            />
          </>
        )}
      </div>
    </form>
  );
};

export default SimpleForm;
