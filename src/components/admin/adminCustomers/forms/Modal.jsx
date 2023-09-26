import { useForm } from "react-hook-form";
import { FormInput, FormSelectFull } from "./AdminFormComponents";
import { Fragment, useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  createMonthlyPayment,
  createDownPayment,
  createOriginationFee,
  createManualPayment,
} from "../../../../utils/createPayments";

const Modal = ({ isOpen, closeModal, title, fields, onSubmit, customer }) => {
  const { register, errors, trigger, getValues, watch, control, reset } =
    useForm({
      defaultValues: {},
      mode: "onBlur",
    });

  const [isOpen2, setIsOpen2] = useState(false);
  const [monthlyPaymentAmnt, setMonthlyPayment] = useState(0);

  const currencyFormatter = (value) => {
    // convert the input value to a number (if it isn't already), then format it as currency
    return Number(value).toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
    });
  };

  const calculateMonthlyPayment = () => {
    const carPriceWatch = watch("monthlyPayment.carPrice");
    const downPaymentWatch = watch("monthlyPayment.downPayment");
    const interestRateWatch = watch("monthlyPayment.interestRate");
    const termsWatch = watch("monthlyPayment.terms");

    const carPrice = parseFloat(carPriceWatch || "0");
    const downPayment = parseFloat(downPaymentWatch || "0");
    const interestRate = parseFloat(interestRateWatch || "0");
    const terms = parseInt(termsWatch || "0");

    console.log(carPrice, downPayment, interestRate, terms);
    // Add your calculation logic here
    let principal = carPrice - downPayment; // 20000 - 2000 = 18000
    let annualInterest = 0.1; // 10% annual interest rate
    let monthlyInterest = annualInterest / 12; // convert to monthly rate

    let payment =
      (principal * (monthlyInterest * Math.pow(1 + monthlyInterest, terms))) /
      (Math.pow(1 + monthlyInterest, terms) - 1);

    console.log(payment);

    setMonthlyPayment(payment);
    // console.log(monthlyPayment)
    console.log(monthlyPaymentAmnt.toFixed(2));
  };

  const modifyFormValues = (values, key) => {
    // Common values that get added regardless of the key
    const commonValues = {
      stripeCustomerId: customer.stripeCustomerId,
      customerID: customer.cusID,
      Address: customer.applicant.Address,
      City: customer.applicant.City,
      State: customer.applicant.State,
      Zip: customer.applicant.ZipCode,
      FirstName: customer.applicant.FirstName,
      LastName: customer.applicant.LastName,
      VIN: customer.vehicle.Vin,
    };

    let newValues = {};

    // If the key is "monthlyPayment", add monthlyPaymentAmnt
    if (key === "monthlyPayment") {
      newValues = {
        invoiceAmount: monthlyPaymentAmnt.toFixed(2),
        ...commonValues,
      };
    } else {
      newValues = {
        ...commonValues,
      };
    }

    const modifiedValues = {
      ...values,
      [key]: {
        ...values[key], // Preserve the original values
        ...newValues, // Add/overwrite with the new values
      },
    };

    return modifiedValues;
  };

  const handleSubmit = async () => {
    const isFormValid = await trigger();

    if (isFormValid) {
      let formValues = getValues();

      switch (title) {
        case "Monthly Payment Plan":
          formValues = modifyFormValues(formValues, "monthlyPayment");
          createMonthlyPayment(formValues);
          break;
        case "Origination Fee Invoice":
          formValues = modifyFormValues(formValues, "originationFee");
          createOriginationFee(formValues);
          break;
        case "Down Payment Invoice":
          formValues = modifyFormValues(formValues, "downPayment");
          createDownPayment(formValues);
          break;
        case "Manual Invoice":
          formValues = modifyFormValues(formValues, "manualInvoice");
          createManualPayment(formValues);
          break;
        default:
          console.error("Unexpected title value:", title);
          break;
      }

      reset();
      closeModal();
    }
  };
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog
        as="div"
        className="fixed inset-0 z-10 overflow-y-auto"
        open={isOpen}
        onClose={() => setIsOpen2(false)}
        static={true}
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
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-md bg-card p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-medium leading-6 text-white ml-2"
              >
                {title}
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-300 ml-2 mb-4">
                  Enter Details in to create{" "}
                  <span className="font-bold">{title}</span> for:
                  <br />
                  <span className="font-semibold text-lg text-cyan-500">
                    {customer.applicant.fullName}
                  </span>
                </p>
              </div>

              <form>
                {fields.map((field) => {
                  if (field.type === "select") {
                    return (
                      <FormSelectFull
                        key={field.name}
                        name={field.name}
                        control={control}
                        requiredMessage={field.requiredMessage}
                        placeholder={field.label}
                        errors={errors}
                        options={field.options}
                      />
                    );
                  }

                  return (
                    <div key={field.name} className="w-full">
                      <FormInput
                        name={field.name}
                        register={register}
                        requiredMessage={field.requiredMessage}
                        placeholder={field.label}
                        value={field.defaultValue}
                        errors={errors}
                      />
                    </div>
                  );
                })}

                {title === "Monthly Payment Plan" && (
                  <div className=" ml-2 text-white flex flex-col mr-2 ">
                    <button
                      type="button" // change this to "button" to prevent form submission
                      className="inline-flex justify-center rounded-md border-cyan-600 border-2 text-white px-4 py-2  hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200 mb-4"
                      onClick={calculateMonthlyPayment} // place onClick here
                    >
                      Calculate
                    </button>
                    <div>
                      <span className="text-lg font-medium">
                        Projected Monthly Payments:
                      </span>
                      <span className="text-2xl font-bold text-cyan-500">
                        {" "}
                        {monthlyPaymentAmnt.toFixed(2)}
                      </span>
                    </div>
                  </div>
                )}

                <div className="mt-4 space-x-2">
                  <button
                    type="button" // change this to "button" to prevent form submission
                    className="inline-flex justify-center rounded-md border-cyan-600 border-2 text-white px-4 py-2  hover:bg-cyan-500 hover:border-cyan-500 transition-all duration-200 m-2"
                    onClick={handleSubmit} // place onClick here
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
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Modal;
