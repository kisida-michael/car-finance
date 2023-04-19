import React, { useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { auth, provider, firestore } from "../../firebaseConfig";
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';


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

    const methods = await auth.fetchSignInMethodsForEmail(email);
    console.log(methods)
    if (methods.includes('google.com')) {
      // Re-authenticate the user with the Google account
      alert("You already have an account with this email using google. Please sign in with your google provider.")
    }
    try {
      auth.setPersistence('local')
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      console.log('User Credential', userCredential)
      const userDoc = await firestore.collection("users").doc(userCredential.user.uid).get();
    
      if (userDoc.exists) {
        const userData = userDoc.data();
        setCurrentUser({ ...userCredential.user, uid: userCredential.user.uid, isAdmin: userData.isAdmin });
        if (userData.isAdmin) {
          navigate('/admin/dash');
        } else {
          navigate('/user/dash');
        }
      } else {
        console.error("User document not found");
      }
    } catch (error) {
      console.error("Error signing in with email and password:", error);
    }
    console.log('handleEmailPasswordSignIn: User data:', { ...userCredential.user, uid: userCredential.user.uid, isAdmin: userData.isAdmin });

  };
  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      auth.setPersistence('local')

      const googleResult = await auth.signInWithPopup(provider);
      const googleUser = googleResult.user;
      console.log(googleUser)
      const userDoc = await firestore.collection("users").doc(googleUser.uid).get();
      // Check if there's an email/password account with the same email
     
      if (userDoc.exists) {
        const userData = userDoc.data();
        console.log('handleGoogleSignIn: User data:', { ...googleUser, uid: googleUser.uid, isAdmin: userData.isAdmin });

        setCurrentUser({ ...googleUser, uid: googleUser.uid, isAdmin: userData.isAdmin });
        if (userData.isAdmin) {
          navigate('/admin/dash');
        } else {
          navigate('/user/dash');
        }
        console.log(currentUser)
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
        darkMode ? 'bg-gray-900' : 'bg-gray-100'
      } flex items-center justify-center`}
    >
      <div
        className={`w-full max-w-md ${
          darkMode ? 'bg-gray-800' : 'bg-white'
        } rounded-lg shadow-md`}
      >
        <div className="p-6">
          <h2
            className={`text-3xl font-semibold ${
              darkMode ? 'text-white' : 'text-gray-700'
            }`}
          >
            Sign In
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
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  } rounded-md focus:outline-none ${
                    darkMode
                      ? 'focus:ring-2 focus:ring-indigo-300 text-white'
                      : 'focus:ring-2 focus:ring-indigo-500'
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
                    darkMode ? 'border-gray-600' : 'border-gray-300'
                  } rounded-md focus:outline-none ${
                    darkMode
                      ? 'focus:ring-2 focus:ring-indigo-300 text-white'
                      : 'focus:ring-2 focus:ring-indigo-500'
                  }`}
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full mt-6 py-2 ${
                darkMode ? 'bg-indigo-500' : 'bg-indigo-500'
              } text-white font-semibold rounded-md hover:${
                darkMode ? 'bg-indigo-600' : 'bg-indigo-600'
              }`}
            >
              Sign In
            </button>
          </form>
          <div className="mt-6">
            <button
              onClick={handleGoogleSignIn}
              className={`w-full py-2 border ${
                darkMode ? 'border-gray-600' : 'border-gray-300'
              } rounded-md flex items-center justify-center ${
                darkMode ? 'text-white' : ''
              }`}
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className={`text-red-500 mr-2 ${
                  darkMode ? 'text-red-400' : ''
                }`}
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
