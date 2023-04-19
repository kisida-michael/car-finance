const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.setUserRole = functions.https.onCall(async (data, context) => {
  const { uid, role } = data;

  if (!context.auth || !context.auth.token.admin) {
    // Only admins can change user roles
    throw new functions.https.HttpsError(
      "permission-denied",
      "You must be an admin to change user roles"
    );
  }

  if (!uid || !role) {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "UID and role are required"
    );
  }

  if (role !== "admin" && role !== "user") {
    throw new functions.https.HttpsError(
      "invalid-argument",
      "Role must be 'admin' or 'user'"
    );
  }

  await admin.auth().setCustomUserClaims(uid, { role });

  return { message: `User role has been set to ${role}` };
});
