// index.js
const functions = require('firebase-functions');
const {stripeWebhook} = require("./src/stripe/invoices");
const stripeAPI = require('./src/stripe/stripeAPI');
const admin = require('./src/firebaseAdmin');

exports.stripeWebhook = stripeWebhook;
exports.getStripeCustomer = functions.https.onCall(stripeAPI.getStripeCustomer);
exports.getPaymentMethods = functions.https.onCall(stripeAPI.getPaymentMethods);
exports.getInvoices = functions.https.onCall(stripeAPI.getInvoices);
