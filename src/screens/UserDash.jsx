import React, { useEffect, useState } from "react";
import useUserStore from "../store/userStore";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import TotalBalance from "../components/client/Dashboard/TotalBalance";
import PaymentMethods from "../components/client/Dashboard/PaymentMethods";
import RecentInvoices from "../components/client/Dashboard/RecentInvoices";
const UserDash = () => {
  const { currentUser } = useUserStore();

  const [invoices, setInvoices] = useState([]);
  const [totalBalance, setTotalBalance] = useState(0);
  const [stripeCustomer, setStripeCustomer] = useState(null);

  const getInvoices = async () => {
    const cusRef = doc(firestore, "customers", currentUser.customerID);
    const cusSnap = await getDoc(cusRef);
    const cusData = cusSnap.data();

    // Create a reference to the 'invoices' subcollection of the current customer
    const invoicesRef = collection(cusRef, "invoices");
    // No need to query because you're already referencing the specific customer's invoices
    const invoicesSnapshot = await getDocs(invoicesRef);

    setInvoices(
      invoicesSnapshot.docs.map((doc) => {
          const data = doc.data();
  
          // If dueDate exists and is a Timestamp, convert to Date
          if (data.dueDate) {
              const date = new Date(data.dueDate * 1000); // Multiply by 1000 to convert from seconds to milliseconds
  
              // Convert the date to a locale string
              data.dueDate = date.toLocaleDateString('en-US', {
                  day: '2-digit', 
                  month: '2-digit', 
                  year: 'numeric'
              });
          }
       
          return data;
      })
  );
  
  };

  console.log(invoices);
  useEffect(() => {
    const balance = invoices.reduce((total, invoice) => {
      if (invoice.paid) {
        return total;
      } else {
        return total + invoice.amountDue;
      }
    }, 0);
    setTotalBalance(balance);
  }, [invoices]); // The dependency array makes sure this effect runs only when `invoices` changes

  useEffect(() => {
    getInvoices();
  }, [currentUser]);

  return (
    <div className="h-max flex flex-col sm:flex-row">
    <div className="mt-14 w-full sm:w-7/12 mx-auto">
        <h1 className="text-2xl font-semibold text-cyan-500 mb-6 mx-4 sm:mx-0">
            {currentUser.firstName} {currentUser.lastName}'s Dashboard
        </h1>

        <div className="flex flex-col sm:flex-row space-y-12 sm:space-y-0 sm:space-x-8 mx-4 sm:mx-0">
            <div className="flex-grow">
                <TotalBalance balance={totalBalance} className="" />
            </div>
            <div className="w-full sm:w-8/12">
                <PaymentMethods currentUser= {currentUser}/>
            </div>
        </div>

        <div className=" my-4 sm:my-8 mx-4 sm:mx-0">
            <RecentInvoices invoices={invoices}/>
        </div>
    </div>
</div>
)
};


export default UserDash;
