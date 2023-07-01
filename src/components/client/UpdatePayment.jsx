// AddPaymentMethod.js

import React, { useState } from 'react';
import { loadStripe } from "@stripe/stripe-js";
import { CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements, Elements } from '@stripe/react-stripe-js';

// load Stripe.js

const ELEMENT_OPTIONS = {
    style: {
      base: {
        color: "#1A202C",
        backgroundColor: "#F9FAFB",
        fontFamily: '"Inter sans-serif',
        fontSize: '16px',
        '::placeholder': {
          color: "#4B5563",
        },
        borderBottom: '2px solid #cyan',
        borderRadius: '',
        
      },
      invalid: {
        color: '#B91C1C',
        iconColor: '#B91C1C',
      },
    },
  };
  
// Then, in your render method:




const stripePromise = loadStripe("pk_test_51MtDFfFpXNbzjj8ldprPPGQN4G4xx5Xmn7lOqXfCKWQapQhOyEWcT9AC7QxuxtJ1RP8mg4Ai9z5VcfDr0a69B3mU00bnsipy9L");

const AddPaymentMethodForm = () => {
    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        setLoading(true);

        const card = elements.getElement(CardElement);

        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'card',
            card: card,
        });

        if (error) {
            setError(error.message);
            setLoading(false);
            return;
        }

        

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className='w-64 mx-auto bg-white p-6 rounded-lg shadow-md'>
            <label className='block mb-4'>
                <span className='text-gray-700'>Card Number</span>
                <div className='mt-1'>
                    <CardNumberElement options={ELEMENT_OPTIONS} className='shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50' />
                </div>
            </label>
            <label className='block mb-4'>
                <span className='text-gray-700'>Card Expiration</span>
                <div className='mt-1'>
                    <CardExpiryElement options={ELEMENT_OPTIONS} className='shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50' />
                </div>
            </label>
            <label className='block mb-4'>
                <span className='text-gray-700'>CVC</span>
                <div className='mt-1'>
                    <CardCvcElement options={ELEMENT_OPTIONS} className='shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md bg-gray-50' />
                </div>
            </label>
            <button disabled={!stripe} type="submit" className='w-full px-3 py-2 text-white bg-cyan-500 hover:bg-cyan-600 rounded'>
                Add Payment Method
            </button>
            {error && <div className='text-red-500 mt-3'>{error}</div>}
        </form>
    );
    
};

const AddPaymentMethod = () => {
    return (
        <Elements stripe={stripePromise}>
            <AddPaymentMethodForm />
        </Elements>
    );
};

export default AddPaymentMethod;
