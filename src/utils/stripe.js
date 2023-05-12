import Stripe from 'stripe';

const stripe = new Stripe('sk_test_51MtDFfFpXNbzjj8lin0xmRIhxg8vmqrFhyWi5KcRGddoJDyqAd83BVF6U4wCENIb6GdSDVNLmUDP3JxF4S1A3pzq003hFZ0IxG');

export const createStripeCustomer = async (customer) => {
  try {
    const stripeCustomer = await stripe.customers.create({
      name: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      description: 'Customer for ' + customer.email,
    });

    return stripeCustomer.id;
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
}
