import React from 'react'
import {useState } from 'react'
import Input from './Input'
const EmploymentInfo = () => {

    const [employmentInfo, setEmploymentInfo] = useState({
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
        { title: "Name", type: "text", value: employmentInfo.name, setValue: (value) => setEmploymentInfo({ ...employmentInfo, name: value }) },
        { title: "DOB", type: "date", value: employmentInfo.dob, setValue: (value) => setEmploymentInfo({ ...employmentInfo, dob: value }) },
        { title: "Current Address", type: "text", value: employmentInfo.currentAddress, setValue: (value) => setEmploymentInfo({ ...employmentInfo, currentAddress: value }) },
        { title: "City", type: "text", value: employmentInfo.city, setValue: (value) => setEmploymentInfo({ ...employmentInfo, city: value }) },
        { title: "SSN", type: "text", value: employmentInfo.ssn, setValue: (value) => setEmploymentInfo({ ...employmentInfo, ssn: value }) },
        { title: "Phone", type: "text", value: employmentInfo.phone, setValue: (value) => setEmploymentInfo({ ...employmentInfo, phone: value }) },
        { title: "Zip", type: "text", value: employmentInfo.zip, setValue: (value) => setEmploymentInfo({ ...employmentInfo, zip: value }) },
        { title: "State", type: "text", value: employmentInfo.state, setValue: (value) => setEmploymentInfo({ ...employmentInfo, state: value }) },
        { title: "Rent", type: "text", value: employmentInfo.rent, setValue: (value) => setEmploymentInfo({ ...employmentInfo, rent: value }) },

      ];

   
//make a form for the applicant info
    return (
    <div className="p-4 bg-gray-100 rounded-md">
      <h2 className="text-2xl text-cyan-500 mb-4 font-semibold">Employment Info</h2>
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

export default EmploymentInfo
