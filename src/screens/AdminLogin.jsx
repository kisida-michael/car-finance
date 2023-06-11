import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth, provider, firestore } from "../../firebaseConfig";
import { doc, getDoc, getDocFromServer } from "firebase/firestore";

import {
  getAuth,
  fetchSignInMethodsForEmail,
  signInWithEmailAndPassword,
  setPersistence,
  browserLocalPersistence,
  signInWithPopup,
} from "firebase/auth";

import useUserStore from "../store/userStore";
import { useNavigate } from "react-router-dom";

const AdminLogin = ({ darkMode }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const currentUser = useUserStore((state) => state.currentUser);
  const authReady = useUserStore((state) => state.authReady);

  const navigate = useNavigate();

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Fetch user data from 'users' collection using the user's UID
      const userDocRef = doc(firestore, "users", user.uid);
      const userDocSnapshot = await getDocFromServer(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        console.log("User ID:", user.uid);
        console.log("User data:", userData);
        setCurrentUser({
          ...userCredential.user,
          uid: userCredential.user.uid,
          isAdmin: userData.isAdmin,
        });
        if (userData.isAdmin) {
          navigate("/admin/dash");
        } else {
          navigate("/user/dash");
        }
      } else {
        console.error(
          "No user data found in the users collection for UID:",
          user.uid
        );
      }

      return user;
    } catch (error) {
      console.error("Error signing in:", error.message);
      throw error;
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google

      await setPersistence(auth, browserLocalPersistence);

      const googleResult = await signInWithPopup(auth, provider);
      const googleUser = googleResult.user;
      console.log(googleUser);

      const userDocRef = doc(firestore, "users", googleUser.uid);
      console.log(userDocRef);
      const userDoc = await getDocFromServer(userDocRef);

      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log("handleGoogleSignIn: User data:", {
          ...googleUser,
          uid: googleUser.uid,
          isAdmin: userData.isAdmin,
        });

        setCurrentUser({
          ...googleUser,
          uid: googleUser.uid,
          isAdmin: userData.isAdmin,
        });
        if (userData.isAdmin) {
          navigate("/admin/dash");
        } else {
          navigate("/user/dash");
        }
        console.log(currentUser);
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error signing in with Google:", error);
    }
  };

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-admin" : "bg-admin"
      } flex items-center justify-center`}
    >
      <div
        className={`w-full max-w-md ${
          darkMode ? "bg-gray-800" : "bg-card"
        } rounded-lg shadow-md`}
      >
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-center text-cyan-500">
            Admin Sign In
          </h2>
          <form className="mt-6" onSubmit={handleEmailPasswordSignIn}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Email"
                  required
                  ref={emailRef}
                  className={
                    "w-full p-2  rounded-md text-gray-200 bg-cardAlt ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                  }
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Password"
                  required
                  ref={passwordRef}
                  className={
                    "w-full p-2  rounded-md text-white- bg-cardAlt ring-0 border-0 focus:ring-2 focus:ring-cyan-600"
                  }
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full mt-6 py-2 ${
                darkMode ? "bg-cyan-500" : "bg-cyan-500"
              } text-white font-semibold rounded-md transition duration-200 ease-in-out transform  ${
                darkMode ? "hover:bg-cyan-600" : "hover:bg-cyan-600"
              }`}
            >
              Sign In
            </button>
          </form>
          <div className="mt-6 hover:text-white">
            <button
              onClick={handleGoogleSignIn}
              className="w-full py-2 border text-white bg-cardAlt border-red-500 rounded-md flex items-center justify-center transition duration-200 ease-in-out hover:bg-red-500"
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className=" mr-2 hover:text-white"

              />
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
