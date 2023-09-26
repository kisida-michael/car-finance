import React, { useState } from 'react';
import { useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';

const BankAccountPaymentForm = ({ amount }) => {
    const stripe = useStripe();
    const elements = useElements();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError(null);

        if (!stripe || !elements) {
            return;
        }

        const iban = elements.getElement(IbanElement);
        const { error, paymentMethod } = await stripe.createPaymentMethod({
            type: 'ach_credit_transfer',
            ach_credit_transfer: iban,
        });

        if (error) {
            setError(error.message);
        } else {
            // Send the payment method to your server or handle further processing
            setSuccess(true);
        }
    };

    return (
        <div>
            {error && <div className="error">{error}</div>}
            {success ? (
                <div>Payment successful!</div>
            ) : (
                <form onSubmit={handleSubmit}>
                    <label>
                        Bank Account Details
                        {/* <IbanElement options={{ supportedCountries: ['SEPA'] }} /> */}
                    </label>
                    <p>Total Amount: ${amount}</p>
                    <button type="submit" disabled={!stripe}>
                        Pay with ACH
                    </button>
                </form>
            )}
        </div>
    );
};

export default BankAccountPaymentForm;
