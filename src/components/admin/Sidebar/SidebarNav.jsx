import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FiHome, FiUsers, FiFileText, FiSettings, FiPhone } from 'react-icons/fi';
import SidebarItem from './SidebarItem'; // import the SidebarItem component



const SidebarNav = ({ activeTab, setActiveTab, collapsed }) => {
  const navigate = useNavigate();

  const handleNavClick = (newActiveTab, route) => {
    setActiveTab(newActiveTab);
    navigate(route);
  };

  const navItems = [
    { label: 'Dashboard', icon: FiHome, route: '/admin/dash' },
    { label: 'Customers', icon: FiUsers, route: '/admin/customers' },
    { label: 'Leads', icon: FiPhone, route: '/admin/leads'},
    { label: 'Invoice', icon: FiFileText, route: '/admin/invoice' },
    { label: 'Management', icon: FiSettings, route: '/admin/Management' },

  ];

  return navItems.map((item, index) => (
    <SidebarItem
      key={index}
      label={item.label}
      icon={item.icon}
      active={activeTab === item.label}
      onClick={() => handleNavClick(item.label, item.route)}
      collapsed={collapsed}
    />
  ));
};

export default SidebarNav;