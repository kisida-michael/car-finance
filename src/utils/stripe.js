import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51MtDFfFpXNbzjj8lin0xmRIhxg8vmqrFhyWi5KcRGddoJDyqAd83BVF6U4wCENIb6GdSDVNLmUDP3JxF4S1A3pzq003hFZ0IxG');
export const createStripeCustomer = async (customer, createDownPayment, createOriginationFee) => {
  try {
    const stripeCustomer = await stripe.customers.create({
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      description: 'Customer for ' + customer.email,
    });

    if (createDownPayment) {
      const downPaymentProduct = await stripe.products.create({
        name: `Down Payment  - ${customer.firstName} ${customer.lastName}`,
        description: 'Down payment for a car',
      });

      const downPaymentPrice = await stripe.prices.create({
        unit_amount: customer.downPayment * 100, // Convert to cents
        currency: 'usd',
        product: downPaymentProduct.id,
      });

      const downPaymentInvoice = await stripe.invoices.create({
        customer: stripeCustomer.id,
        collection_method: 'send_invoice',
        metadata: {
          type: 'downpayment', // Custom field: type = downpayment
        },
        days_until_due: 30, // Change this based on your business logic
      });
      console.log("Down Payment Invoice Created:", downPaymentInvoice);


      const downPaymentInvoiceItem = await stripe.invoiceItems.create({
        customer: stripeCustomer.id,
        price: downPaymentPrice.id,
        invoice: downPaymentInvoice.id,
      });
      console.log("Down Payment Invoice Item Created:", downPaymentInvoiceItem);

      const finalizedDownPaymentInvoice = await stripe.invoices.finalizeInvoice(downPaymentInvoice.id);
      console.log("Down Payment Invoice Finalized:", finalizedDownPaymentInvoice);
      console.log(`Down Payment Invoice URL: ${finalizedDownPaymentInvoice.hosted_invoice_url}`);
    }

    if (createOriginationFee) {
      const originationFeeProduct = await stripe.products.create({
        name: `Origination Fee - ${customer.firstName} ${customer.lastName}`,
        description: 'Origination fee for a car',
      });

      const originationFeePrice = await stripe.prices.create({
        unit_amount: customer.originationFee * 100, // Convert to cents
        currency: 'usd',
        product: originationFeeProduct.id,
      });

      const originationFeeInvoice = await stripe.invoices.create({
        customer: stripeCustomer.id,
        collection_method: 'send_invoice',
        metadata: {
          type: 'originationFee', // Custom field: type = originationFee
        },
        days_until_due: 30, // Change this based on your business logic
      });
      console.log("Origination Fee Invoice Created:", originationFeeInvoice);

      const originationFeeInvoiceItem = await stripe.invoiceItems.create({
        customer: stripeCustomer.id,
        price: originationFeePrice.id,
        invoice: originationFeeInvoice.id,
      });

      console.log("Origination Fee Invoice Item Created:", originationFeeInvoiceItem);

      const finalizedOriginationFeeInvoice = await stripe.invoices.finalizeInvoice(originationFeeInvoice.id);
      console.log("Origination Fee Invoice Finalized:", finalizedOriginationFeeInvoice);

      console.log(`Origination Fee Invoice URL: ${finalizedOriginationFeeInvoice.hosted_invoice_url}`);
    }

    return stripeCustomer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
}

export const deleteStripeCustomer = async (stripeCustomerId) => {
  try {
    const deletedCustomer = await stripe.customers.del(stripeCustomerId);
    console.log("Deleted Stripe customer:", deletedCustomer);
  } catch (error) {
    console.error("Error deleting Stripe customer:", error);
    throw error;
  }
}


