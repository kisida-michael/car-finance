

import React, { useEffect, useState } from 'react'
import useUserStore from '../store/userStore'
import { doc, getDoc } from "firebase/firestore"
import { firestore } from '../../firebaseConfig'
import { getFunctions, httpsCallable } from 'firebase/functions'; // Import this
import { getApps, initializeApp } from "firebase/app"; // Import this

const UserDash = () => {
  const { currentUser } = useUserStore()
  const [stripeCustomer, setStripeCustomer] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState(null)
  const [invoices, setInvoices] = useState(null)

  const app = getApps()[0]; // Assuming you have only one Firebase app in your client
  const functions = getFunctions(app); // Initialize Cloud Functions

  // Declare callable functions
  const getStripeCustomerFunction = httpsCallable(functions, 'getStripeCustomer');
  const getPaymentMethodsFunction = httpsCallable(functions, 'getPaymentMethods');
  const getInvoicesFunction = httpsCallable(functions, 'getInvoices');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        if (stripeCustomer) {
          const {data: invoiceList} = await getInvoicesFunction({ stripeCustomerId: stripeCustomer.id })
          setInvoices(invoiceList)
        }
      } catch (error) {
        console.error("Error fetching invoices:", error)
      }
    }

    fetchInvoices()
  }, [stripeCustomer])

  useEffect(() => {
    const fetchStripeCustomer = async () => {
      try {
        // Only proceed if currentUser is defined
        if (currentUser) {
          const userRef = doc(firestore, 'users', currentUser.uid)
          const userSnap = await getDoc(userRef)
  
          if (userSnap.exists()) {
            const { cusID } = userSnap.data()
            const customerRef = doc(firestore, 'customers', cusID)
            const customerSnap = await getDoc(customerRef)
  
            if (customerSnap.exists()) {
              const { stripeCustomerId } = customerSnap.data()
              const {data: customer} = await getStripeCustomerFunction({ stripeCustomerId }) // Use callable function
              console.log(customer)
              setStripeCustomer(customer)
            } else {
              console.log('No such customer!')
            }
            
          } else {
            console.log('No such user!')
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
  
    fetchStripeCustomer()
  }, [])
  

  useEffect(() => {
    const fetchPaymentMethods = async () => {
      try {
        if (stripeCustomer) {
          const {data: methods} = await getPaymentMethodsFunction({ stripeCustomerId: stripeCustomer.id }) // Use callable function
          setPaymentMethods(methods)
        }
      } catch (error) {
        console.error("Error fetching payment methods:", error)
      }
    }

    fetchPaymentMethods()
  }, [stripeCustomer])

  return (
    <div className='h-screen bg-gray-100'>
      {/* Display Stripe customer data */}
      {stripeCustomer && (
        <div>
          <h1>{stripeCustomer.name}</h1>
          <p>Email: {stripeCustomer.email}</p>
        </div>
      )}

      {/* Display payment methods */}
      {paymentMethods && paymentMethods.data.map((method, index) => (
        <div key={index}>
          <p>Card Brand: {method.card.brand}</p>
          <p>Last 4 Digits: {method.card.last4}</p>
        </div>
      ))}

      {invoices && invoices.data.map((invoice, index) => (
        <div key={index}>
          <p>Invoice ID: {invoice.id}</p>
          <p>Amount Due: {invoice.amount_due / 100}</p>
          <p>Status: {invoice.status}</p>
        </div>
      ))}
    </div>
  )
}

export default UserDash
