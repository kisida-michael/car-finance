import {  FiFile, FiUsers, FiPhoneCall } from "react-icons/fi";
import { firestore, auth } from "../../firebaseConfig";
import React, { useMemo, useState, useEffect } from "react";
import { collection, getDocs, doc, getDoc } from "firebase/firestore"; 

const useFetchData = (collectionName) => {
  const [data, setData] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const ref = collection(firestore, collectionName);
      const snapshot = await getDocs(ref);
      setData(snapshot.size);
    };

    fetchData();
  }, [collectionName]);

  return data;
};

const KPI = ({icon, label, data}) => {
  // Clone the icon and add the size prop
  const Icon = React.cloneElement(icon, { size: "1.5em" });

  return (
    <div className="bg-card py-8 px-4 rounded-lg flex items-center ">
      <div className="ml-2 bg-cyan-200 p-6 rounded-full items-center">
        {Icon} {/* Render the cloned icon with adjusted size */}
      </div>
      <div className="ml-6 flex-grow flex flex-col justify-center"> {/* Added flex-grow and flex flex-col justify-center */}
        <div className="font-medium text-3xl">{data}</div>
        <div className="text">{label}</div>
      </div>
    </div>
  );
};



const AdminDashboard = () => {
  const customers = useFetchData('customers');
  const invoices = useFetchData('invoices');
  const leads = useFetchData('leads');

  //...

  return (
    <div className="w-full bg-admin p-12 min-h-screen text-gray-200">
  {/*...*/}
  <header className="mt-4 flex justify-between items-center">
     
     <h1 className="text-2xl font-semibold">Dashboard</h1>
     
   </header>

  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8 ">
    <KPI icon={<FiUsers className="text-cyan-700" />} label="Customers" data={customers} />
    <KPI icon={<FiFile className="text-cyan-700" />} label="Invoices" data={invoices} />
    <KPI icon={<FiPhoneCall className="text-cyan-700" />} label="Leads" data={leads} />
    <KPI icon={<FiPhoneCall className="text-cyan-700" />} label="Leads" data={leads} />
    {/*...*/}
    {/*...*/}
  </div>
  {/*...*/}
</div>

  );
};

export default AdminDashboard;
