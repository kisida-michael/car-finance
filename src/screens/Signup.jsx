import React, { useState } from "react";
import { auth, provider, firestore } from "../../firebaseConfig";
import useUserStore from '../store/userStore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');

  const handlePasswordChange = (e) => {
    if (e.target.value.length < 8) {
      setError('Password must be at least 8 characters long.');
    } else {
      setError(null);
    }
    setPassword(e.target.value);
  };

  
  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );
      await firestore.collection("users").doc(user.uid).set({
        uid: user.uid,
        email: user.email,
        authProvider: "email",
        isAdmin: false,
      });

      console.log("New user created in Firestore")
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      const { user } = await auth.signInWithPopup(provider);
  
      // Check if the user exists in Firestore
      const userDocRef = firestore.collection('users').doc(user.uid);
      const userDoc = await userDocRef.get();
  
      // If the user does not exist, create a new user document
      if (!userDoc.exists) {
        await userDocRef.set({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          authProvider: 'google',
          isAdmin: false,
        });
      }
  
      // Retrieve user data from Firestore
      const userData = userDoc.data() || (await userDocRef.get()).data();

      useUserStore.getState().setUser({ ...userData, uid: user.uid });
    } catch (error) {
      console.error("Error signing up with Google:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md">
        <div className="p-6">
          <h2 className="text-3xl font-semibold text-gray-700">Sign Up</h2>
          {error && <p className="text-center text-red-500">{error}</p>}
          <form className="mt-6" onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="first-name" className="sr-only">First Name</label>
                <input
                  id="first-name"
                  name="first-name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="last-name" className="sr-only">Last Name</label>
                <input
                  id="last-name"
                  name="last-name"
                  type="text"
                  autoComplete="name"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="email-address" className="sr-only">Email address</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">Password</label>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Password"
                  value={password}
                  onChange={handlePasswordChange}
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </div>
              <div>
                <label htmlFor="confirm-password" className="sr-only">Confirm Password</label>
                <input
                  id="confirm-password"
                  name="confirm-password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <FontAwesomeIcon icon={faEyeSlash} />
                  ) : (
                    <FontAwesomeIcon icon={faEye} />
                  )}
                </button>
              </div>
            </div>
            <button
              type="submit"
              className="w-full mt-6 py-2 bg-indigo-500 text-white font-semibold rounded-md hover:bg-indigo-600"
            >
              Sign Up
            </button>
          </form>
          <div className="mt-6">
            <button
              onClick={handleGoogleSignUp}
              className="w-full py-2 border border-gray-300 rounded-md flex items-center justify-center"
            >
              <FontAwesomeIcon
                icon={faGoogle}
                className="text-red-500 mr-2"
              />
              Sign Up with Google
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


export default SignUp;
