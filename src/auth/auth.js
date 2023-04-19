import { auth, provider } from "../../firebaseConfig";


export const signInWithGoogle = async () => {
    try {
      const result = await auth.signInWithPopup(provider);
      return result;
    } catch (error) {
      if (error.code === "auth/account-exists-with-different-credential") {
        return {
          error: error,
          email: error.email,
          credential: error.credential,
        };
      } else {
        console.error("Error signing in with Google:", error);
      }
    }
  };