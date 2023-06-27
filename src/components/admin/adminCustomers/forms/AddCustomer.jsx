import { ref, push } from "firebase/database";
import { getDatabase } from "firebase/database";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import ApplicantInfo from "./ApplicantInfo";
import EmploymentInfo from "./EmploymentInfo"
import AdminCustomerAlert from "../../AdminCustomAlert";
import ProgressBar from "../../../client/apply/ProgressBar";
import UploadDocs from "./UploadDocs";
import VehicleInfo from "./VehicleInfo";
import ReviewInfo from "./ReviewInfo";
import { v4 as uuidv4 } from "uuid";
import { firestore } from "../../../../../firebaseConfig";
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';

const AddCustomer = () => {
  const [step, setStep] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [tempId, setTempId] = useState(uuidv4());
  const [fileUploaded, setFileUploaded] = useState(false); // add this to your existing state variables
  const [docNames, setDocNames] = useState({}); // Step 1
  const [formValues, setFormValues] = useState({});
  const [documentUrls, setDocumentUrls] = useState({});
  const [uploadMessage, setUploadMessage] = useState(null);

  const methods = useForm({ defaultValues: {}, mode: "onBlur" });
  const { trigger, getValues, reset } = methods;

  useEffect(() => {
    // Initialize a temporary ID when the component mounts
    const db = getDatabase();
    const newPostKey = push(ref(db, "temp")).key;
    setTempId(newPostKey);
  }, []);


 const handleNext = async () => {
  const isFormValid = await trigger();

  if (step === 3 && !fileUploaded) {
    setUploadMessage('No files have been uploaded.');
  }

  if (isFormValid) {
    // Save the form data when you navigate to the next step
    const currentFormData = getValues();

    if (step < components.length - 1) {
      setStep(step + 1);
    }
  } else {
    setErrorMessage("Please correct the errors before proceeding");
  }
};

  const handleAlertDismiss = () => {
    setErrorMessage(null);
  };
  const handleDocNamesChange = (newDocNames) => {
    setDocNames(newDocNames);
  };
  const handlePrev = () => {
    if (step > 0) {
      reset(getValues()); // Save the form data when navigating back
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    const isFormValid = await trigger();
  
    if (isFormValid) {
      console.log("Form submitted");
  
      try {
        const { bankStatements1, bankStatements2, bankStatements3, phoneBill, leaseAgreement, ...restFormValues } = formValues;
  
        // Combine firstName and lastName into fullName
        const fullName = `${restFormValues.applicant.FirstName} ${restFormValues.applicant.LastName}`;
        restFormValues.applicant.fullName = fullName;

        // Use tempId as the document ID
        const docRef = doc(firestore, "customers", tempId);
        await setDoc(docRef, restFormValues);
        console.log("Document written with ID: ", docRef.id);
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    }
  };

  
  

  useEffect(() => {
    if (step > 0) {
      const currentFormData = getValues();
      setFormValues(prevFormValues => ({
        ...prevFormValues,
        ...currentFormData
      }));
    }
  }, [step, getValues]);


  // useEffect(() => {
  //   if (step > 0) {
  //     const currentFormData = getValues();
  //     setFormValues(prevFormValues => ({
  //       ...prevFormValues,
  //       [step]: getValues(),
  //     }));
  //   }
  // }, [step, getValues]);
  const components = [
    <ApplicantInfo formMethods={methods} />,
    <EmploymentInfo formMethods={methods} />,
    <VehicleInfo formMethods={methods} />, 
   
    <UploadDocs
    formMethods={methods}
    tempId={tempId}
    fileUploaded={fileUploaded}
    setFileUploaded={setFileUploaded}
    docNames={docNames} // Step 3
    onDocNamesChange={handleDocNamesChange} // Step 3
    setDocumentUrls={setDocumentUrls} // Add this line
  />,
  

  <ReviewInfo formValues={formValues} documentUrls={documentUrls} />
 
  ];

  return (
    <div className="w-full sm:pl-8 pl-0 pr-8 text-gray-800">
      {/* <LandingHeader /> */}
      {uploadMessage && (
  <AdminCustomerAlert  message={uploadMessage} onDismiss={() => setUploadMessage(null)} />
)}
      <div className="bg-card justify-center items-center mx-auto mt-20   rounded-md p-4 shadow-md mb-20">
        <div className="mb-10 mt-4">
          <ProgressBar step={step + 1} totalSteps={components.length} />
        </div>
        {components[step]}

        <div className="flex justify-between mt-4 mx-4">
          <button
            onClick={handlePrev}
            disabled={step === 0}
            className="px-4 py-2 text-white bg-cyan-500 rounded-md disabled:opacity-50"
          >
            Previous
          </button>

          {step < components.length - 1 ? (
            <button
              onClick={handleNext}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-white bg-cyan-500 rounded-md"
            >
              Submit
            </button>
          )}
        </div>
      </div>
      {errorMessage && (
        <AdminCustomerAlert  message={errorMessage} onDismiss={handleAlertDismiss} />
      )}
    </div>
  );
};

export default AddCustomer;
