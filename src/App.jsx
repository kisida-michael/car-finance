import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useUserStore from "./store/userStore";
import SignUp from "./screens/Signup";
import AdminLogin from "./screens/AdminLogin";
import UserLogin from "./screens/UserLogin";

import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./screens/AdminDashboard";
import AdminCustomers from "./screens/AdminCustomers";
import AdminInvoices from "./screens/AdminInvoices";
import AdminManagement from "./screens/AdminManagement";
import UserLayout from "./layouts/users/UserLayout";
import UserLanding from "./screens/UserLanding";
import UserApplication from "./screens/UserApplication";
import UserDash from "./screens/UserDash";
import UserPayment from "./screens/UserPayment";

import { auth } from "../firebaseConfig";
import "./index.css";

function App() {
  const setCurrentUser = useUserStore((state) => state.setCurrentUser);
  const setAuthReady = useUserStore((state) => state.setAuthReady);
  const authReady = useUserStore((state) => state.authReady);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setCurrentUser(user);
      setAuthReady(true);
    });

    return () => {
      unsubscribe();
    };
  }, []);

  if (!authReady) {
    return (
      <div
        className={`min-h-screen ${darkMode ? "bg-gray-900" : "bg-gray-100"}`}
      >
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    
    <BrowserRouter>
      <div
      
      >
        <Routes>
          <Route path="/admin" element={<AdminLogin darkMode={darkMode} />} />
          <Route path="/signup" element={<SignUp/>} />
          <Route path= "/auto-loan" element= {<UserLanding/>} />
          <Route path= "/application" element= {<UserApplication/>} />

       
          <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/dash" element={<AdminDashboard />} />
                <Route path="/customers" element={<AdminCustomers />} />
                <Route path="/invoice" element={<AdminInvoices />} />
                <Route path="/management" element={<AdminManagement />} />
              </Routes>
            </AdminLayout>
          }
        />

        <Route path="/user" element={<UserLogin darkMode={darkMode} />} />
        <Route path = "/user/*" element = {
        <UserLayout>
          <Routes>
            <Route path = "/dash" element = {<UserDash/>} />
            <Route path = "/application" element = {<UserPayment/>} />
        
        </Routes>
        </UserLayout>
        } />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
