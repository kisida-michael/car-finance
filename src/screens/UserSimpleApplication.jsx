import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SimpleForm from "../components/client/apply/forms/SimpleForm";
import CustomAlert from "../components/client/CustomAlert";
import LandingHeader from "../components/client/LandingHeader";
import { firestore } from "../../firebaseConfig";
import { addDoc, collection } from 'firebase/firestore';


const UserSimpleApplication = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const methods = useForm({ defaultValues: {}, mode: "onBlur" });
  const { trigger, getValues } = methods;

  const handleAlertDismiss = () => {
    setErrorMessage(null);
  };

  const handleSubmit = async () => {
    const isFormValid = await trigger();

    if (isFormValid) {
      console.log("Form submitted");
      const formValues = getValues();
      console.log(formValues);

      try {
        const docRef = await addDoc(collection(firestore, "leads"), formValues);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
    } else {
      setErrorMessage("Please correct the errors before proceeding");
    }
  };
  return (
    <div className="flex flex-col min-h-screen bg-client">
      <LandingHeader />

      <div className="lg:w-2/5 md:w-3/4 justify-center items-center mx-auto mt-20 bg-white rounded-md p-4 shadow-md mb-20">
        <SimpleForm formMethods={methods} />

        <div className="flex justify-center mt-4 mx-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-white bg-cyan-500 rounded-md"
          >
            Submit
          </button>
        </div>
      </div>

      {errorMessage && (
        <CustomAlert message={errorMessage} onDismiss={handleAlertDismiss} />
      )}
    </div>
  );
};

export default UserSimpleApplication;
