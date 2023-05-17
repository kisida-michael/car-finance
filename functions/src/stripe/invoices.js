const functions = require("firebase-functions");
const admin = require("firebase-admin");
const stripeApp = require("stripe");
const stripe = stripeApp(functions.config().stripe.secret);


exports.stripeWebhook = functions.https.onRequest((request, response) => {

  const sig = request.headers["stripe-signature"];
  const event = stripe.webhooks.constructEvent(
      request.rawBody,
      sig,
      functions.config().stripe.webhookkey,
  );



  if (event.type === "invoice.updated" || event.type === "invoice.paid") {
    const invoice = event.data.object;

    

    const invoiceData = {
      dueDate: invoice.due_date,
      id: invoice.id,
      customerName: invoice.customer_name,
      type: invoice.metadata.type,
      customer: invoice.customer,
      amountDue: invoice.amount_due / 100, // Convert to dollars
      paid: invoice.paid,
      status: invoice.status,
    };

    admin
        .firestore()
        .collection("invoices")
        .doc(invoice.id)
        .set(invoiceData)
        .then(() => {
          response.json({
            received: true,
            message: "Invoice saved successfully",
          });
        })
        .catch((error) => {
          console.error("Error writing invoice to Firestore: ", error);
          response.status(500).send({error: "Failed to save invoice"});
        });
  } else {
    response.json({received: true, message: "No action required"});
  }
});
