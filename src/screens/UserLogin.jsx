import React, { useRef,  } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import { auth, provider } from "../../firebaseConfig";
import useUserStore from '../store/userStore';
import { useNavigate } from 'react-router-dom';

const Login = ({ darkMode }) => {
  const emailRef = useRef();
  const passwordRef = useRef();
  // const { setCurrentUser } = useContext(UserContext);
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);

  const handleEmailPasswordSignIn = async (e) => {
    e.preventDefault();

    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    const methods = await auth.fetchSignInMethodsForEmail(email);
   
    if (methods.includes('google.com')) {
      // Re-authenticate the user with the Google account
      alert("You already have an account with this email using google. Please sign in with your google provider.")
    }
    auth
      .signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Update the user in the UserContext
        console.log(userCredential.user);
        setCurrentUser(userCredential.user);
      })
      .catch((error) => {
        console.error("Error signing in with email and password:", error);
      });
      auth.setPersistence('local')
  };
  const handleGoogleSignIn = async () => {
    try {
      // Sign in with Google
      const googleResult = await auth.signInWithPopup(provider);
      const googleUser = googleResult.user;
  
      // Check if there's an email/password account with the same email
      const methods = await auth.fetchSignInMethodsForEmail(googleUser.email);
  
      if (methods.includes('password')) {
        // Re-authenticate the user with the Google account
        const googleCredential = firebase.auth.GoogleAuthProvider.credential(
          googleResult.credential.idToken
        );
        await googleUser.reauthenticateWithCredential(googleCredential);
  
        // Ask the user for their password to link the accounts
        const password = prompt('Enter your password to link your accounts:');
  
        // Get the email/password credential
        const passwordCredential = firebase.auth.EmailAuthProvider.credential(
          googleUser.email,
          password
        );
  
        // Link the email/password account with the Google account
        await googleUser.linkWithCredential(passwordCredential);
        console.log('Accounts linked successfully');
      } else {
        console.log('Google account signed in');
      }
    } catch (error) {
      console.error('Error signing in with Google:', error);
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
          <div className="mt-6 text-center">
            <a
              href="/admin"  // Replace with actual user portal link
              className={`${
                darkMode ? 'text-white' : 'text-gray-500'
              } text-sm underline hover:text-cyan-500`}
            >
              Are you looking for the admin portal? Sign in Here.
            </a>
          </div>
        </div>
      </div>
    </div>
  );
  
};
export default Login;
