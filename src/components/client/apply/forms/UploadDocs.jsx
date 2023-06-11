import React from 'react';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from '../../../../../firebaseConfig';  // Import the Firebase app instance from your configuration file

import { FileUpload } from './FormComponents';

const UploadDocs = ({ formMethods, tempId }) => {
    const { register, formState: { errors } } = formMethods;


    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        const storage = getStorage(app);  // Get a reference to the storage service, which is used to create references in your Cloud Storage bucket
        const storageRef = ref(storage, `${tempId}/${file.name}`);  // Create a reference to the file
      
        // Upload the file
        const uploadTask = uploadBytesResumable(storageRef, file);
      
        // Listen for state changes, errors, and completion of the upload
        uploadTask.on('state_changed',
          (snapshot) => {
            // Get task progress by dividing the number of transferred bytes by the total bytes
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
          }, 
          (error) => {
            console.log(error);
          }, 
          () => {
            // Upload completed successfully, now we can get the download URL
            getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
            });
          }
        );
      }

      
  return (
    <div className="flex flex-wrap -mx-3">
      <FileUpload name="bankStatements" register={register} requiredMessage="Last 3 bank statements are required" placeholder="Last 3 Bank Statements" errors={errors} />
      <FileUpload name="phoneBill" register={register} requiredMessage="Cell phone bill is required" placeholder="Cell Phone Bill" errors={errors} />
      <FileUpload name="leaseAgreement" register={register} requiredMessage="Lease agreement is required" placeholder="Lease Agreement" errors={errors} />
    </div>
  );
};

export default UploadDocs;
