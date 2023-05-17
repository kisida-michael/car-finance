
const admin = require("firebase-admin");
const {stripeWebhook} = require("./src/stripe/invoices");
admin.initializeApp();

exports.stripeWebhook = stripeWebhook;
