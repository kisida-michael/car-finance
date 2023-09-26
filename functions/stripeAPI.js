const stripeApp = require("stripe");
const stripe = stripeApp(functions.config().stripe.secret);

export const createStripeCustomer = async (customer) => {
  try {
    console.log("Creating Stripe customer:", customer);
    const stripeCustomer = await stripe.customers.create({
      name: `${customer.FirstName} ${customer.LastName}`,
      email: customer.Email,
      description: "Customer for " + customer.Email,
    });
  } catch (error) {
    console.error("Error creating Stripe customer:", error);
    throw error;
  }
};

export const createStripeInvoice = async (invoiceTyoe) => {


}

