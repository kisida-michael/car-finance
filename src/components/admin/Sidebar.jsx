import React, { useState } from 'react';
import { FiHome, FiUsers, FiFileText, FiSettings, FiLogOut, FiChevronRight, FiChevronLeft } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { auth } from '../../../firebaseConfig';

const SidebarItem = ({ label, icon: Icon, active, onClick, collapsed }) => (
    <button
      className={`flex items-center space-x-4 p-4 w-full text-left ${active ? 'bg-[#464250]'  : 'hover:bg-gray-700'} transition-colors`}
      onClick={onClick}
    >
      <Icon className={`text-xl ${active ? 'text-cyan-500' : 'text-gray-300'}`} />
      {!collapsed && <span className={` font-medium ${active ? 'text-cyan-500' : 'text-gray-300'}`}>{label}</span>}
    </button>
  );
const Sidebar = () => {
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();

  const handleSignOut = () => {
    auth.signOut() // call the signOut method from the auth instance
      .then(() => {
        console.log('User signed out successfully!');
        navigate('/admin');
      })
      .catch((error) => {
        console.log('Error signing out:', error);
      });
  };

  return (
    <div className={`flex flex-col h-screen bg-card   ${collapsed ? 'w-28' : 'w-64'}`}>
     <div className="mt-10 ml-2 p-4 font-semibold text-xl text-gray-300 flex items-center justify-between">
        {!collapsed && 'AWAuto'}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronRight className="text-xl" /> : <FiChevronLeft className="text-xl" />}
        </button>
      </div>
      <div className="flex-1 mt-8">
        <SidebarItem
          label="Dashboard"
          icon={FiHome}
          active={activeTab === 'Dashboard'}
          onClick={() => {
            setActiveTab('Dashboard');
            navigate('/admin/dash');
          }}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Customers"
          icon={FiUsers}
          active={activeTab === 'Customers'}
          onClick={() => {
            setActiveTab('Customers');
            navigate('/admin/customers');
          }}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Invoice"
          icon={FiFileText}
          active={activeTab === 'Invoice'}
          onClick={() => {
            setActiveTab('Invoice');
            navigate('/admin/invoice');
          }}
          collapsed={collapsed}
        />
        <SidebarItem
          label="Settings"
          icon={FiSettings}
          active={activeTab === 'Settings'}
          onClick={() => {
            setActiveTab('Settings');
            navigate('/admin/settings');
          }}
          collapsed={collapsed}
        />
      </div>
      {/* <div className="p-4 flex items-center space-x-4">
        <img className="h-10 w-10 rounded-full" src={currentUser.photoURL} alt="Profile" />
        {!collapsed && (
          <div className={`text-gray-300`}>
            <div>{currentUser.displayName}</div>
            <div>{currentUser.isAdmin ? 'Admin' : 'User'}</div>
          </div>
        )}
      </div> */}
      <button
        className="p-4 w-full text-left hover:bg-gray-700 transition-colors"
        onClick={handleSignOut}
      >
        <FiLogOut className="text-xl text-gray-300" />
      </button>
    </div>
  );
};

export default Sidebar;
