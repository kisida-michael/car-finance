import React from 'react'
import useUserStore from '../../store/userStore';
import Sidebar from '../../components/admin/Sidebar';
import AdminDashboard from '../../screens/AdminDashboard';
import { AnimatePresence } from "framer-motion";

const AdminLayout = ({ children }) => {
  return (
    <AnimatePresence>

    <div className="flex">
      <Sidebar />
      <div className="w-full  bg-admin max-h-screen overflow-x-hidden">
        {children}
      </div>
    </div>
    </AnimatePresence>

  );
};

export default AdminLayout
