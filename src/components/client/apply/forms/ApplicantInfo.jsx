import React from 'react'
import {useState } from 'react'
import Input from './Input'
const ApplicantInfo = () => {

    const [applicantInfo, setApplicantInfo] = useState({
        name: "",
        dob: "",
        currentAddress: "",
        city: "",
        ssn: "",
        phone: "",
        zip: "",
        state: "",
        rent: "",
      });

      const fields = [
        { title: "Name", type: "text", value: applicantInfo.name, setValue: (value) => setApplicantInfo({ ...applicantInfo, name: value }) },
        { title: "DOB", type: "date", value: applicantInfo.dob, setValue: (value) => setApplicantInfo({ ...applicantInfo, dob: value }) },
        { title: "Current Address", type: "text", value: applicantInfo.currentAddress, setValue: (value) => setApplicantInfo({ ...applicantInfo, currentAddress: value }) },
        { title: "City", type: "text", value: applicantInfo.city, setValue: (value) => setApplicantInfo({ ...applicantInfo, city: value }) },
        { title: "SSN", type: "text", value: applicantInfo.ssn, setValue: (value) => setApplicantInfo({ ...applicantInfo, ssn: value }) },
        { title: "Phone", type: "text", value: applicantInfo.phone, setValue: (value) => setApplicantInfo({ ...applicantInfo, phone: value }) },
        { title: "Zip", type: "text", value: applicantInfo.zip, setValue: (value) => setApplicantInfo({ ...applicantInfo, zip: value }) },
        { title: "State", type: "text", value: applicantInfo.state, setValue: (value) => setApplicantInfo({ ...applicantInfo, state: value }) },
        { title: "Rent", type: "text", value: applicantInfo.rent, setValue: (value) => setApplicantInfo({ ...applicantInfo, rent: value }) },

      ];

   
//make a form for the applicant info
    return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl text-cyan-500 mb-4 font-semibold">Applicant Info</h2>
      {fields.map((field) => (
        <Input
          key={field.title}
          title={field.title}
          type={field.type}
          value={field.value}
          setValue={field.setValue}
        />
      ))}
    </div>
  );
}

export default ApplicantInfo
