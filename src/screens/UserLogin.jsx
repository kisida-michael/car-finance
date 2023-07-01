import React, { useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { auth, provider, firestore } from "../../firebaseConfig";
import { doc, getDoc, getDocFromServer } from "firebase/firestore";
import LandingHeader from "../components/client/LandingHeader";
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
const Login = ({ darkMode }) => {
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
          firstName: userData.firstName,
          lastName: userData.lastName,
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
        darkMode ? 'bg-gray-900' : 'bg-client'
      } `}
    >
    <LandingHeader/>
    <div className="mt-40 flex flex-col justify-center items-center"> 
      <div
        className={`w-full max-w-md ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-md`}
      >
        <div className="p-6">
          <h2
            className={`text-3xl font-semibold ${
              darkMode ? 'text-cyan-500' : 'text-cyan-500'
            }`}
          >
            User Portal
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
                  className={`w-full px-4 py-2 border ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  } rounded-md focus:outline-none ${
                    darkMode
                      ? "focus:ring-2 focus:ring-cyan-300 text-white"
                      : "focus:ring-2 focus:ring-cyan-500"
                  }`}
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
                  className={`w-full px-4 py-2 border ${
                    darkMode ? "border-gray-600" : "border-gray-300"
                  } rounded-md focus:outline-none ${
                    darkMode
                      ? "focus:ring-2 focus:ring-cyan-300 text-white"
                      : "focus:ring-2 focus:ring-cyan-500"
                  }`}
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
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className={`w-full py-2 border ${
                darkMode ? "border-gray-600" : "border-gray-300"
              } rounded-md flex items-center justify-center transition duration-200 ease-in-out transform  ${
                darkMode ? "text-white hover:bg-gray-700" : "hover:bg-gray-200"
              }`}
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className={`text-red-500 mr-2 ${
                  darkMode ? "text-red-400" : ""
                }`}
              />
              Sign In with Google
            </button>
          </div>
        
        </div>
      </div>
    </div>
    </div>
  );
  
};
export default Login;
