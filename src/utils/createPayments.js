import { collection, addDoc } from "firebase/firestore";
import { firestore, auth } from "../../firebaseConfig";
export const createMonthlyPayment = async (payments) => {
  console.log("createMonthlyPayment: payments:", payments);

  try {
    const docRef = await addDoc(collection(firestore, "tempInvoices"), payments);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }


  
};
export const createDownPayment = async (payments) => {
  console.log("createDownPayment: payments:", payments);

  try {
    const docRef = await addDoc(collection(firestore, "tempInvoices"), payments);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const createOriginationFee = async (payments) => {
  console.log("createOriginationFee: payments:", payments);

  try {
    const docRef = await addDoc(collection(firestore, "tempInvoices"), payments);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
};

export const createManualPayment = async (payments) => {
   console.log("createManualPayment: payments:", payments);

   try {
    const docRef = await addDoc(collection(firestore, "tempInvoices"), payments);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

