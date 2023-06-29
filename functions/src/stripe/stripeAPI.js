const functions = require("firebase-functions");
const admin = require("../firebaseAdmin");
const stripeApp = require("stripe");

const stripe = stripeApp(functions.config().stripe.secret);
const firestore = admin.firestore();

const checkAuthentication = async (context) => {
  if (!(context.auth && context.auth.token)) {
    throw new functions.https.HttpsError(
      "unauthenticated",
      "The function must be called while authenticated."
    );
  }

  const uid = context.auth.uid;
  const userDoc = await firestore.collection("users").doc(uid).get();
  if (!userDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      "No user record corresponding to provided Firebase UID could be found."
    );
  }

  const user = userDoc.data();
  const customerDoc = await firestore
    .collection("customers")
    .doc(user.cusID)
    .get();

  if (!customerDoc.exists) {
    throw new functions.https.HttpsError(
      "not-found",
      "No customer record corresponding to the user’s cusID could be found."
    );
  }

  const customer = customerDoc.data();

  if (customer.uid !== uid) {
    throw new functions.https.HttpsError(
      "permission-denied",
      "User does not have permission to access this Stripe customer."
    );
  }
};

exports.getStripeCustomer = async (data, context) => {
  const stripeCustomerId = String(data.stripeCustomerId);
  await checkAuthentication(context, stripeCustomerId);

  try {
    const customer = await stripe.customers.retrieve(stripeCustomerId);
    return customer;
  } catch (error) {
    console.error("Error retrieving Stripe customer:", error);
    throw error;
  }
};

exports.getPaymentMethods = async (data, context) => {
  const stripeCustomerId = String(data.stripeCustomerId);
  await checkAuthentication(context, stripeCustomerId);

  try {
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: "card",
    });
    return paymentMethods;
  } catch (error) {
    console.error("Error retrieving payment methods:", error);
    throw error;
  }
};

exports.getInvoices = async (data, context) => {
  const stripeCustomerId = String(data.stripeCustomerId);
  await checkAuthentication(context, stripeCustomerId);

  try {
    const invoices = await stripe.invoices.list({
      customer: stripeCustomerId,
    });
    return invoices;
  } catch (error) {
    console.error("Error retrieving Stripe invoices:", error);
    throw error;
  }
};
