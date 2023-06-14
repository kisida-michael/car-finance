import React, { useState } from "react";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "../../../../../firebaseConfig";
import { useForm } from "react-hook-form";
import CustomAlert from "../../CustomAlert";

import { FileUpload } from "./FormComponents";

const UploadDocs = ({ formMethods, tempId, setFileUploaded, setDocumentUrls }) => {
  const { register, control, formState: { errors }, } = formMethods;
  const [alertMessage, setAlertMessage] = useState(null);

  const [selectedFiles, setSelectedFiles] = useState({
    bankStatements1: null,
    bankStatements2: null,
    bankStatements3: null,
    phoneBill: null,
    leaseAgreement: null,
  });

  const fields = ["bankStatements1", "bankStatements2", "bankStatements3", "phoneBill", "leaseAgreement"];
  const placeholders = ["Bank Statement 1", "Bank Statement 2", "Bank Statement 3", "Cell Phone Bill", "Lease Agreement"];
  const requiredMessages = ["Last 3 bank statements are required", "Last 3 bank statements are required", "Last 3 bank statements are required", "Cell phone bill is required", "Lease agreement is required"];

  const handleFileClear = (field) => {
    setSelectedFiles(prevFiles => {
      const newFiles = { ...prevFiles };
      newFiles[field] = null;
      return newFiles;
    });
  };

  const handleFileSelect = (e, field) => {
    const file = e.target.files[0];
    if (file.type !== "application/pdf") {
      setAlertMessage("Only PDFs are allowed");
    } else {
      setSelectedFiles(prevFiles => ({
        ...prevFiles,
        [field]: file,
      }));
      if (alertMessage) setAlertMessage(null); // Clear the alert message if there was one
    }
  };
  

  const handleFileUpload = async (e) => {
    e.preventDefault();
    
    const uploadPromises = fields.map(field => {
      if (selectedFiles[field])
        return uploadFile(selectedFiles[field], `${tempId}/${field}`);
    });
    
    try {
      const downloadURLs = await Promise.all(uploadPromises);
      
      // now downloadURLs is an array that contains the download URLs for your files
      // you can use it to update your form state
  
      const documentUrls = downloadURLs.reduce((result, url, index) => {
        const field = fields[index]; // Use the index to get the corresponding field
        result[field] = url;
        return result;
      }, {});
      
      setDocumentUrls(documentUrls);
      setFileUploaded(true);
      
    } catch (error) {
      console.log(error);
    }
  };
  
  

  const uploadFile = (file, path) => {
    const storage = getStorage(app);
    const storageRef = ref(storage, path);
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    // return a new Promise
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          console.log(error);
          reject(error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log("File available at", downloadURL);
            resolve(downloadURL);
          });
        }
      );
    });
  };
  

  return (
    <form className="p-4 space-y-4">
      <h2 className="text-2xl text-cyan-500 mb-10 font-semibold">Documents</h2>
      {fields.map((field, index) => (
        <div key={field}>
          <h3 className="text-xl text-gray-500 mb-4 font-semibold">{placeholders[index]}</h3>
          <div className="flex flex-wrap -mx-3">
            <FileUpload
              onChange={(e) => handleFileSelect(e, field)}
              name={field}
              register={register}
              requiredMessage={requiredMessages[index]}
              placeholder={placeholders[index]}
              errors={errors}
            />
            <div className="flex flex-wrap items-center space-x-2 mb-4 min-w-full max-w-full">
              <p className="ml-3 text-sm text-gray-600">
                {selectedFiles[field]?.name}
              </p>
              {selectedFiles[field] && (
                <button
                  onClick={() => handleFileClear(field)}
                  className=" bg-gray-200 hover:bg-gray-300 hover:text-red-600 text-gray-800 py-1 px-2 rounded text-sm"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      ))}
      <button
        onClick={handleFileUpload}
        className="bg-cyan-500 flex mx-auto text-white py-2 px-12 rounded hover:bg-cyan-700 transition-colors duration-200"
      >
        Upload Files
      </button>
      {alertMessage && <CustomAlert message={alertMessage} onDismiss={() => setAlertMessage(null)} />}

    </form>
    
  );
};

export default UploadDocs;
