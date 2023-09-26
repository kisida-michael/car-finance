import React, { useState, useEffect } from 'react';
import UpdatePaymentMethod from '../components/client/UpdatePayment'
import { useLocation, useNavigate } from "react-router-dom";
import CardPaymentForm from '../components/client/PaymentMethods/CardPaymentForm';
import BankAccountPaymentForm from '../components/client/PaymentMethods/BankAccountForm';
import SortablePaginatedTable from '../components/client/SortablePaginatedTable';
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

const UserBilling = () => {
  const { currentUser } = useUserStore();

  const location = useLocation();
  const invoice = location.state?.invoice; // use optional chaining in case location.state is undefined

  const [invoices, setInvoices] = useState([]);
  const data = React.useMemo(() => invoices, [invoices]);
  const navigate = useNavigate();
 
  const columns = React.useMemo(
    () => [
      {
        Header: "Due Date",
        accessor: "dueDate",
       
      },
      {
        Header: "Type",
        accessor: "type",
      },
      {
        Header: "Amount Due",
        accessor: "subtotal",
      },
      {
        Header: "Status",
        accessor: "status",
      },
      {
        Header: 'Action',
        accessor: 'action', // this is not an actual field in your data, just a placeholder for the action button
        Cell: ({ row }) => {
          if (row.original.status === "Pending") {
            return (
              <button
              onClick={() => handlePayClick(row.original)}
              className=" px-3 py-1 text-sm rounded-full bg-cyan-500 text-white hover:bg-cyan-600"
              >
                Pay Now
              </button>
            );
          }

          if (row.original.status === "paid") {
            return (
              <button
              onClick={() => handlePayClick(row.original)}
              className=" px-3 py-1 text-sm rounded-full bg-gray-500 text-white hover:bg-cyan-600"
              >
                Details
              </button>
            );
          }
          return null;  // render nothing for non-draft invoices
        }
      }
    ],
    []
  );
  const handlePayClick = (invoice) => {
    navigate("/user/billing", { state: { invoice } });
  };

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

  useEffect(() => {
    // Only fetch invoices if invoice from location is undefined
    if (!invoice) {
      getInvoices();
    }
  }, [currentUser, invoice]); // added invoice as a dependency

  if (!currentUser || !currentUser.customerID) {
    return <p>Loading user details...</p>;
  }


  const InvoiceDetails = ({ invoice }) => {
    const formattedAmountDue = (parseFloat(invoice.amountDue) + parseFloat(fee)).toFixed(2);
    return (
      <div className="invoice-details bg-client p-6 rounded-md  border-gray-200">
        <h2 className="text-2xl mb-6 border-b pb-2">Invoice Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p><strong>Subtotal:</strong> ${parseFloat(invoice.subtotal).toFixed(2)}</p>
          <p><strong>Tax:</strong> ${parseFloat(invoice.tax).toFixed(2)}</p>
          <p><strong>Amount Due:</strong> ${formattedAmountDue}</p>
          {paymentMethod === "creditCard" && <p><strong className='text-red-500'>Service Fee:</strong> ${fee.toFixed(2)}</p>}

          <p><strong>Date:</strong> {new Date(invoice.date * 1000).toLocaleDateString()}</p>
          <p><strong>Due Date:</strong> {invoice.dueDate}</p>
          <p><strong>Invoice ID:</strong> {invoice.invoiceId}</p>
          <p><strong>Type:</strong> {invoice.type}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
        </div>
      </div>
    );
}


const InvoiceDetailsPaid = ({ invoice }) => {
  return (
    <div className="invoice-details bg-client p-6 rounded-md border-gray-200">
      <h2 className="text-2xl mb-6 border-b pb-2">Invoice Details</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p><strong>Amount Paid:</strong> ${parseFloat(invoice.amountPaid).toFixed(2)}</p>
        <p><strong>Tax:</strong> ${parseFloat(invoice.tax).toFixed(2)}</p>
        <p><strong>Date:</strong> {new Date(invoice.date * 1000).toLocaleDateString()}</p>
        <p><strong>Date Paid:</strong> {new Date(invoice.datePaid * 1000).toLocaleDateString()}</p>
        <p><strong>Status:</strong> {invoice.status}</p>
        <p><strong>Invoice ID:</strong> {invoice.invoiceId}</p>
      </div>
    </div>
  );
}



  
  const [paymentMethod, setPaymentMethod] = useState("creditCard");
  const [fee, setFee] = useState(0);

  const handlePaymentMethodChange = (method) => {
    setPaymentMethod(method);
    if (method === "creditCard") {
      setFee(invoice.subtotal * 0.03);
    } else {
      setFee(0);
    }
  };

  useEffect(() => {
    if (paymentMethod === "creditCard" && invoice) {
        setFee(invoice.subtotal * 0.03);
    }
}, [invoice, paymentMethod]);



const totalAmount = invoice?.amountDue + fee || 0;

if (!invoice) {
  return (
    <div className='w-full sm:w-7/12 mx-auto mt-12'>
      <div className='bg-white p-6 flex flex-col rounded-md shadow-sm'>
        {/* Invoice Header */}
        <div className='mb-4'>
          <h2 className="text-2xl font-semibold">All Invoices</h2>
          <p className="text-gray-600">List of all your invoices</p>
        </div>
        
        <SortablePaginatedTable
          columns={columns}
          data={data}
          pageSize={12}
          onRowClick={handlePayClick}
        />
      </div>
    </div>
  );
}

  return (
    <div className='bg-client flex justify-center items-center'>
    <div className=' w-full sm:w-5/12 bg-white shadow-lg p-8 rounded-lg mt-12 mb-12'>
      <h1 className="text-2xl font-semibold mb-6">Billing</h1>
      
      {invoice.status === 'paid' ? 
  <InvoiceDetailsPaid invoice={invoice} /> : 
  <InvoiceDetails invoice={invoice} />
}

      <div>
  {invoice.status !== 'paid' && (
    <>
      <div className="mt-6 border-t pt-6">
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input 
              type="radio" 
              value="creditCard" 
              className="form-radio mr-2"
              checked={paymentMethod === "creditCard"} 
              onChange={() => handlePaymentMethodChange("creditCard")}
            />
            Credit Card
          </label>

          <label className="flex items-center">
            <input 
              type="radio" 
              value="bankAccount" 
              className="form-radio mr-2"
              checked={paymentMethod === "bankAccount"} 
              onChange={() => handlePaymentMethodChange("bankAccount")}
            />
            Bank Account
          </label>
        </div>

        {fee > 0 && <p className="mt-2 text-red-600">There is an additional 3% fee for credit card payments.</p>}
      </div>

      <div className="mt-6 ">
        {paymentMethod === "creditCard" ? 
          <CardPaymentForm amount={totalAmount} invoice={invoice} subtotal={invoice.subtotal} /> : 
          <BankAccountPaymentForm amount={totalAmount} />}
      </div>
    </>
  )}
</div>

    </div>
  </div>
  )
}

export default UserBilling
