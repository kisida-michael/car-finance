const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const { onDocumentWritten } = require("firebase-functions/v2/firestore");
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");
const { defineSecret } = require("firebase-functions/params");
const { log } = require("firebase-functions/logger");
const stripeApiKey = defineSecret("STRIPE_KEY");
const stripeWebhookKey = defineSecret("STRIPE_WEBHOOK_KEY");

initializeApp();

const db = getFirestore();
exports.invoiceCreate = onDocumentCreated(
  {
    minInstances: 1,
    document: "tempInvoices/{docId}",
    secrets: [stripeApiKey],
  },

  async (event) => {
    const stripeApp = require("stripe");
    const stripe = stripeApp(stripeApiKey.value());

    data = event.data.data();

    invoiceType = Object.keys(data)[0];
    const createInvoice = async (stripe, data, type) => {
      const commonInvoiceTypeHandling = (descriptionTemplate, nameTemplate) => {
        const description = descriptionTemplate.replace(
          /\{(\w+)\}/g,
          (_, key) => data[key]
        );
        const name = nameTemplate.replace(/\{(\w+)\}/g, (_, key) => data[key]);

        return { description, name };
      };

      const INVOICE_TYPES = {
        manualPayment: () =>
          commonInvoiceTypeHandling(
            `Manual payment for ${data.FirstName} ${data.LastName}`,
            `Manual Payment - ${data.FirstName} ${data.LastName}`
          ),
        downPayment: () =>
          commonInvoiceTypeHandling(
            `Down payment for ${data.FirstName} ${data.LastName}`,
            `Down Payment - ${data.FirstName} ${data.LastName}`
          ),
        originationFee: () =>
          commonInvoiceTypeHandling(
            `Origination payment for ${data.FirstName} ${data.LastName}`,
            `Origination Fee - ${data.FirstName} ${data.LastName}`
          ),
        monthlyPayment: () => {
          const result = commonInvoiceTypeHandling(
            `Monthly payment for ${data.FirstName} ${data.LastName}}`,
            `Monthly Payment - ${data.FirstName} ${data.LastName}`
          );

          // Additional or different logic for monthlyPayment
          // For instance, maybe you want to set up a recurring payment
          // Modify result.description or result.name if necessary

          return result;
        },
      };

      let invoiceAmount = parseInt(data.invoiceAmount);
      console.log(invoiceAmount);
      if (isNaN(invoiceAmount)) {
        logger.log(`Invalid invoiceAmount for ${data.type}`);
        return;
      }

      const invoiceConfigFunc = INVOICE_TYPES[type];
      if (!invoiceConfigFunc) {
        logger.log("Unknown invoice type");
        return;
      }

      const { description, name } = invoiceConfigFunc();
      // Create product
    
      const customerAddress = {
        line1: data.Address,
        city: data.City,
        state: data.State,
        postal_code: data.Zip,
        country: 'US',
      };
      const taxResult = await calculateTaxAmount(stripe, invoiceAmount, customerAddress);

      // console.log(taxAmount);

      const Invoice = await stripe.invoices.create({
        customer: data.stripeCustomerId,
        collection_method: "send_invoice",
        metadata: {
          type,
          customerID: data.customerID,
        },
       
        days_until_due: 30,
      });

      // Create an invoice item associated with the customer and price
      const InvoiceItem = await stripe.invoiceItems.create({
        customer: data.stripeCustomerId,
         amount: invoiceAmount * 100,
        invoice: Invoice.id,
        "description": description,
      });

      const TaxInvoiceItem = await stripe.invoiceItems.create({
        customer: data.stripeCustomerId,
        amount: taxResult.taxAmount,
        description: `Sales Tax (@ ${taxResult.taxPercentage}%)`,
        invoice: Invoice.id,
        metadata: {
          'tax_percentage': taxResult.taxPercentage.toString(),
          // any other relevant info
       }
      });

      async function calculateTaxAmount(stripe, invoiceAmount, customerAddress) {
        const taxCalculation = await stripe.tax.calculations.create({
          currency: 'usd',
          line_items: [
            {
              amount: invoiceAmount * 100,  // Convert to cents
              reference: '1',
            },
          ],
          customer_details: {
            address: customerAddress,
            address_source: 'billing',  // Or 'billing' based on your requirement
          },
          expand: ['line_items.data.tax_breakdown'],
        });
      
        // logger.log(taxCalculation);
        // Extract the tax amount
        const taxAmount = taxCalculation.tax_amount_exclusive;

        const taxPercentage = taxCalculation.tax_breakdown[0].tax_rate_details.percentage_decimal;
        console.log(taxAmount);
        
        return { taxAmount, taxPercentage }
      }
      
      
      // Now, create an invoice associated with the same customer

      const invoiceDraft = await stripe.invoices.retrieve(Invoice.id);
      {}
      // logger.log(invoiceDraft);
  
      
      // Finalize invoice
    //  finalizedInvoice =  await stripe.invoices.finalizeInvoice(Invoice.id);
     
    
      const createFirebaseInvoice = async (data, invoiceDraft, type, invoiceAmount, tax, subtotal) => {
        const customerRef = db.collection("customers").doc(data.customerID);
        const invoicesRef = customerRef.collection("invoices");
        const allInvoicesRef = db.collection("invoices");
    
        // Prepare your invoice data
        const invoiceData = {
            subtotal: invoiceAmount,
            tax: tax/100,
            customerName: invoiceDraft.customer_name,
            invoiceId: invoiceDraft.id,
            type: type,
            amountDue: invoiceAmount + tax/100,
            status: "Pending",
            date: invoiceDraft.created,
            stripeCustomerId: data.stripeCustomerId,
            dueDate: invoiceDraft.due_date,
        };
    
        const batch = db.batch();
    
        // Set the invoice inside the customer's subcollection
        batch.set(invoicesRef.doc(invoiceDraft.id), invoiceData);
    
        // Set the invoice in the root-level allInvoices collection
        batch.set(allInvoicesRef.doc(invoiceDraft.id), invoiceData);
    
        try {
            // Commit the batch
            await batch.commit();
            console.log("Invoice created successfully in both collections");
            // You can log other relevant info here as well.
        } catch (error) {
            logger.error("Error:", error);
            throw error;
        }
    }
    
    await createFirebaseInvoice(data, invoiceDraft, type, invoiceAmount, taxResult.taxAmount);
      // logger.log(`${type} Invoice Finalized:`, invoiceDraft.id);
    };

    if (invoiceType !== "monthlyPayment") {
      await createInvoice(stripe, data[invoiceType], invoiceType);
    } else {
      logger.log("Monthly Payment Invoice Created:", data[invoiceType]);
    }
  }
);

exports.customerCreate = onDocumentCreated(
  {
    minInstances: 1,
    document: "customers/{docId}",
    secrets: [stripeApiKey],
  },
  async (event) => {
    // Make the outer function asynchronous

    const stripeApp = require("stripe");
    const stripe = stripeApp(stripeApiKey.value());

    const firstName = event.data.data().applicant.FirstName;
    const lastName = event.data.data().applicant.LastName;
    const email = event.data.data().applicant.Email;

    try {
      logger.log("Creating Stripe customer:");
      const stripeCustomer = await stripe.customers.create({
        name: `${firstName}` + " " + `${lastName}`,
        email: email,
        description: "Customer for " + email,
      });

      // Update the Firestore document with the Stripe customer ID
      await event.data.ref.update({ StripeCustomerId: data.stripeCustomerId });
      logger.log(
        "Stripe customer created and Firestore document updated:",
        stripeCustomer
      );
    } catch (error) {
      logger.error("Error:", error);
      throw error;
    }
  }
);

exports.updateInvoiceStatus =onRequest(
  // make the secret available to this function
  { minInstances: 1,
    secrets: [stripeApiKey, stripeWebhookKey] },
  async (req, res) => {
    // retrieve the value of the secret
    const stripeApp = require("stripe");
    const stripe = stripeApp(stripeApiKey.value());
  
    webhookKey = stripeWebhookKey.value();
   

    const sig = req.headers["stripe-signature"];
    const event = stripe.webhooks.constructEvent(
      req.rawBody,
      sig,
      webhookKey
    
     
  );

 
  // logger.log("Event type:", event.type);
  if (event.type === "invoice.paid") {
    const invoice = event.data.object;
    
    const invoiceData = {
      invoiceId: invoice.id,
      amountDue: invoice.amount_remaining,
      paid: invoice.paid,
      status: invoice.status,
      customerID: invoice.metadata.customerID,
      datePaid: invoice.status_transitions.paid_at,
      amountPaid: invoice.amount_paid/100,
      pdfURL: invoice.invoice_pdf,
    }

    logger.log(invoiceData);
   

    const updateInvoices = async (invoiceData) => {
      const invoiceRef = db.collection("customers")
                           .doc(invoiceData.customerID)
                           .collection("invoices")
                           .doc(invoiceData.invoiceId);

      const allInvoicesRef = db.collection("invoices").doc(invoiceData.invoiceId);

      const batch = db.batch();

      // Update the invoice inside the customer's subcollection
      batch.update(invoiceRef, invoiceData);

      // Update the invoice in the root-level allInvoices collection
      batch.update(allInvoicesRef, invoiceData);

      try {
          // Commit the batch
          await batch.commit();
          console.log("Invoice updated successfully in both collections");
          res.send("OK");
      } catch (error) {
          console.error("Error updating invoices:", error);
          res.status(500).send("Internal Server Error");
      }
  }

  updateInvoices(invoiceData).catch(err => {
      console.error("Failed to update invoices:", err);
      // Handle the error or send a response accordingly
  });
  
}

// if (event.type === "payment_intent.succeeded"){
//   logger.log('payment intent success')
//   const paymentIntent = event.data.object;
//   logger.log(paymentIntent)

//   res.send("OK");
  

// }
else {
  // logger.log("Unexpected event type:", event.type);
  res.status(400).end();
}
  
}
  

);

exports.createPaymentIntent = onRequest(

  {  cors: ['http://localhost:5173', 'https://awautofinancing.web.app/'],
     minInstances: 1,
  secrets: [stripeApiKey] },
async (req, res) => {

 console.log(req.body)
  const stripeApp = require("stripe");
  const stripe = stripeApp(stripeApiKey.value());
  data = req.body;

  const invoice = await stripe.invoices.retrieve(data.invoiceId);

  if (invoice.status === "draft") {
    if (data.paymentMethod === "creditCard") {
        const ServiceFee = await stripe.invoiceItems.create({
            customer: data.stripeCustomerId,
            amount: (data.subtotal * .03) * 100,
            invoice: data.invoiceId,
            description: 'Service Fee',
        });
    }
    
    // Now, finalize the invoice
    await stripe.invoices.finalizeInvoice(data.invoiceId);
}


const invoiceFinal = await stripe.invoices.retrieve(data.invoiceId);
const paymentIntentId = invoiceFinal.payment_intent;

try {
    // Confirm the Payment Intent with the payment method ID
    const confirmedPaymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, {
        payment_method: data.paymentMethodId,
    });

    if (confirmedPaymentIntent.status === 'succeeded') {
        // The invoice will be marked as paid automatically by Stripe
        res.send({ status: "success", message: "Payment successful!" });
    } else {
        res.send({ status: "failed", message: "Payment failed!" });
    }

} catch (error) {
    logger.error("Payment failed:", error);
    res.status(400).send({ status: "error", message: error.message });
}
}
)
