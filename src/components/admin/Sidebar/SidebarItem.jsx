import React from 'react';

const SidebarItem = ({ label, icon: Icon, active, onClick, collapsed }) => (
  <button
    className={`
      flex items-center p-4 w-full text-left transition-colors 
      ${collapsed ? 'justify-center' : 'space-x-4 justify-start'} 
      ${active ? "bg-[#464250]" : "hover:bg-gray-700"}`}
    onClick={onClick}
  >
    <Icon className={`text-xl ${active ? "text-cyan-500" : "text-gray-300"}`} />
    {!collapsed && (
      <span className={`font-medium ${active ? "text-cyan-500" : "text-gray-300"}`}>
        {label}
      </span>
    )}
  </button>
);

export default SidebarItem;
