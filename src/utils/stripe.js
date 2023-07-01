import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51MtDFfFpXNbzjj8lin0xmRIhxg8vmqrFhyWi5KcRGddoJDyqAd83BVF6U4wCENIb6GdSDVNLmUDP3JxF4S1A3pzq003hFZ0IxG');
export const createStripeCustomer = async (customer, vehicle, createDownPayment, createOriginationFee) => {
  try {
    console.log("Creating Stripe customer:", customer)
    console.log("Creating Stripe vehicle:", vehicle)
    const stripeCustomer = await stripe.customers.create({
      name: `${customer.FirstName} ${customer.LastName}`,
      email: customer.Email,
      description: 'Customer for ' + customer.Email,
    });

  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
  
  
  //   if (createDownPayment) {
  //     const DownPaymentProduct = await stripe.products.create({
  //       name: `Down Payment  - ${customer.FirstName} ${customer.LastName}`,
  //       description: 'Down payment for a car',
  //     });

  //     const DownPaymentPrice = await stripe.prices.create({
  //       unit_amount: vehicle.DownPayment * 100, // Convert to cents
  //       currency: 'usd',
  //       product: DownPaymentProduct.id,
  //     });

  //     const DownPaymentInvoice = await stripe.invoices.create({
  //       customer: stripeCustomer.id,
  //       collection_method: 'send_invoice',
  //       metadata: {
  //         type: 'DownPayment', // Custom field: type = DownPayment
  //       },
  //       days_until_due: 30, // Change this based on your business logic
  //     });
  //     console.log("Down Payment Invoice Created:", DownPaymentInvoice);


  //     const DownPaymentInvoiceItem = await stripe.invoiceItems.create({
  //       customer: stripeCustomer.id,
  //       price: DownPaymentPrice.id,
  //       invoice: DownPaymentInvoice.id,
  //     });
  //     console.log("Down Payment Invoice Item Created:", DownPaymentInvoiceItem);

  //     const finalizedDownPaymentInvoice = await stripe.invoices.finalizeInvoice(DownPaymentInvoice.id);
  //     console.log("Down Payment Invoice Finalized:", finalizedDownPaymentInvoice);
  //     console.log(`Down Payment Invoice URL: ${finalizedDownPaymentInvoice.hosted_invoice_url}`);
  //   }

  //   if (createOriginationFee) {
  //     const OriginationFeeProduct = await stripe.products.create({
  //       name: `Origination Fee - ${customer.FirstName} ${customer.LastName}`,
  //       description: 'Origination fee for a car',
  //     });

  //     const OriginationFeePrice = await stripe.prices.create({
  //       unit_amount: vehicle.OriginationFee * 100, // Convert to cents
  //       currency: 'usd',
  //       product: OriginationFeeProduct.id,
  //     });

  //     const OriginationFeeInvoice = await stripe.invoices.create({
  //       customer: stripeCustomer.id,
  //       collection_method: 'send_invoice',
  //       metadata: {
  //         type: 'OriginationFee', // Custom field: type = OriginationFee
  //       },
  //       days_until_due: 30, // Change this based on your business logic
  //     });
  //     console.log("Origination Fee Invoice Created:", OriginationFeeInvoice);

  //     const OriginationFeeInvoiceItem = await stripe.invoiceItems.create({
  //       customer: stripeCustomer.id,
  //       price: OriginationFeePrice.id,
  //       invoice: OriginationFeeInvoice.id,
  //     });

  //     console.log("Origination Fee Invoice Item Created:", OriginationFeeInvoiceItem);

  //     const finalizedOriginationFeeInvoice = await stripe.invoices.finalizeInvoice(OriginationFeeInvoice.id);
  //     console.log("Origination Fee Invoice Finalized:", finalizedOriginationFeeInvoice);

  //     console.log(`Origination Fee Invoice URL: ${finalizedOriginationFeeInvoice.hosted_invoice_url}`);
  //   }

  //   return stripeCustomer.id;
  // } catch (error) {
  //   console.error("Error creating Stripe customer:", error);
  //   throw error;
  // }
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

