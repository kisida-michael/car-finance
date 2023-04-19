import React from 'react'
import useUserStore from '../../store/userStore';
import Sidebar from '../../components/admin/Sidebar';
import AdminDashboard from '../../screens/AdminDashboard';
const AdminLayout = ({ children }) => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="w-full px-4 bg-admin min-h-screen">
        {children}
      </div>
    </div>
  );
};

export default AdminLayout
