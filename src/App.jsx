import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import useUserStore from "./store/userStore";
import AdminLogin from "./screens/AdminLogin";
import Login from "./screens/UserLogin";

import AdminLayout from "./layouts/admin/AdminLayout";
import AdminDashboard from "./screens/AdminDashboard";
import AdminCustomers from "./screens/AdminCustomers";
import AdminInvoices from "./screens/AdminInvoices";
import AdminSettings from "./screens/AdminSettings";
import UserLayout from "./layouts/users/UserLayout";
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
          <Route path="/login" element={<Login darkMode={darkMode} />} />
          <Route
          path="/admin/*"
          element={
            <AdminLayout>
              <Routes>
                <Route path="/dash" element={<AdminDashboard />} />
                <Route path="/customers" element={<AdminCustomers />} />
                <Route path="/invoice" element={<AdminInvoices />} />
                <Route path="/settings" element={<AdminSettings />} />
              </Routes>
            </AdminLayout>
          }
        />

          <Route
            path="/user/dash"
            element={
              <UserLayout darkMode={darkMode} setDarkMode={setDarkMode} />
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
