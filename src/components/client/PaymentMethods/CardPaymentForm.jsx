import { CardElement, useStripe, useElements, PaymentElement} from "@stripe/react-stripe-js";
import React, { useEffect, useState } from 'react';

const CardPaymentForm = ({ amount, invoice, subtotal, stripeCustomerID }) => {
  const stripe = useStripe();
  const elements = useElements();

  const [cardholderName, setCardholderName] = useState("");
  const [savePaymentMethod, setSavePaymentMethod] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Ensure stripe and elements have loaded
    if (!stripe || !elements) {
      return;
    }
  
    // Step 1: Create payment method using stripe.createPaymentMethod
    const result = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
      billing_details: {
        name: cardholderName,
      }
    });
  
    if (result.error) {
      console.error(result.error.message);
      return;
    }
  
    // Step 2: Send payment method ID to backend
    const paymentMethodId = result.paymentMethod.id;

    console.log(invoice.stripeCustomerId)
    const response = await fetch('http://localhost:5001/awautofinancing/us-central1/createPaymentIntent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        paymentMethodId: paymentMethodId,
        invoiceId: invoice.invoiceId, // sending the invoice number/ID
        amount: amount,
        subtotal: subtotal,
        paymentMethod: "creditCard",
        stripeCustomerId: invoice.stripeCustomerId
      })
    });

    console.log("Response: ", response);
    console.log("Payment method ID: ", paymentMethodId);
  };

  const CARD_ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#aab7c4"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };
  

  return (
    <div className="bg-client p-8 rounded-lg shadow-md max-w-lg mx-auto mb-12">
    <form onSubmit={handleSubmit} className="space-y-4">
      
      <div className="bg-white p-2 rounded-md border border-gray-300">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Name on Card
          <input 
            type="text" 
            className="mt-1 block w-full border-1 font-normal border-gray-300 rounded-md"
            value={cardholderName}
            onChange={e => setCardholderName(e.target.value)}
            placeholder="John Doe"
          />
        </label>
      </div>

      <div className="bg-white p-2 rounded-md border border-gray-300">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Card Details
          <CardElement options={CARD_ELEMENT_OPTIONS} />
         
        </label>
      </div>
      
      <button 
        type="submit" 
        disabled={!stripe} 
        className="bg-cyan-500 text-white mt-4 px-4 py-2 rounded-md hover:bg-cyan-600 focus:outline-none"
      >
        Pay ${amount.toFixed(2)}
      </button>
    </form>
  </div>
  );
}

export default CardPaymentForm;
