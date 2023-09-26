import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import SimpleForm from "../components/client/apply/forms/SimpleForm";
import CustomAlert from "../components/client/CustomAlert";
import LandingHeader from "../components/client/LandingHeader";
import { firestore } from "../../firebaseConfig";
import { addDoc, collection, doc, getDoc, setDoc } from 'firebase/firestore';
import CustomConfirm from '../components/client/CustomConfirm';
import { ClipLoader } from 'react-spinners'; // Import the spinner

const UserSimpleApplication = () => {
  const [errorMessage, setErrorMessage] = useState(null);
  const [confirmMessage, setConfirmMessage] = useState(null);
  const [loading, setLoading] = useState(false);  // Loading state for spinner
  const [submitted, setSubmitted] = useState(false); // Submitted state for confirmation message
  const methods = useForm({ defaultValues: {}, mode: "onBlur" });
  const { trigger, getValues, register, reset} = methods;

  const handleAlertDismiss = () => {
    setErrorMessage(null);
  };
  const emailToDocId = (email) => email.toLowerCase().replace(/[^a-z0-9]/g, '_');

  const handleSubmit = async () => {
    setLoading(true); // Start loading spinner

    const isFormValid = await trigger();

    if (isFormValid) {
   
      const formValues = getValues();
      if (formValues.tradeInMake === undefined) {
        formValues.tradeInMake = "";
      }
      const docId = emailToDocId(formValues.email);

      const docRef = doc(firestore, "leads", docId);
      const docSnap = await getDoc(docRef);
     
      if (docSnap.exists()) {
        // Document with the email already exists
        setErrorMessage("A submission with this email already exists.");
        setLoading(false); // Stop loading spinner
        return;
      }
      try {
        await setDoc(doc(firestore, "leads", docId), formValues);
        console.log("Document written with ID: ", docId);
        
        setConfirmMessage("Your application has been submitted successfully");
        // reset(); // Reset the form to its default state
        setSubmitted(true); // Set submitted to true after successful submission

       
      } catch (e) {
        console.error("Error adding document: ", e);
      }
      
    } else {
      setErrorMessage("Please enter all of the fields");
    }
    setLoading(false); // Stop loading spinner
  };
  return (
    <div className="flex flex-col min-h-screen bg-client">
      <LandingHeader />

      <div className="lg:w-2/5 md:w-3/4 justify-center items-center mx-auto mt-20 bg-white rounded-md p-4 shadow-md mb-20">
        <SimpleForm formMethods={methods} />

        <div className="flex justify-center mt-4 mx-4">
          <button
            onClick={handleSubmit}
            className="px-4 py-2 w-40 h-10 text-white bg-cyan-500 rounded-md"
            // disabled={loading || submitted}  
            >
            {loading ? <ClipLoader color={"#ffffff"}size={22} /> : 'Submit'}  {/* Show spinner or text */}
            
          </button>
        </div>
      </div>

      {errorMessage && (
        <CustomAlert message={errorMessage} onDismiss={handleAlertDismiss} />
       
      )}

      {confirmMessage && (
        <CustomConfirm message={confirmMessage}  />
      )}
    </div>
  );
};

export default UserSimpleApplication;
