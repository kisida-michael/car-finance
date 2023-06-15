import React, { useState } from "react";
import { FiChevronRight, FiChevronLeft, FiLogOut } from "react-icons/fi";
import { useNavigate, useLocation } from "react-router-dom";
import useUserStore from "../../../store/userStore";
import { auth } from "../../../../firebaseConfig";
import UserPanel from "./UserPanel";
import SidebarNav from "./SidebarNav";

const getActiveTabFromLocation = () => {
  const location = useLocation();

  if (location.pathname.includes("/admin/dash")) {
    return "Dashboard";
  }
  if (location.pathname.includes("/admin/customers")) {
    return "Customers";
  }
  if (location.pathname.includes("/admin/invoice")) {
    return "Invoice";
  }
  if (location.pathname.includes("/admin/Management")) {
    return "Management";
  }
  return "Dashboard"; // Default to 'Dashboard' if no other match.
};

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState(getActiveTabFromLocation());
  const currentUser = useUserStore((state) => state.currentUser);
  const navigate = useNavigate();

  
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigate("/admin");
      })
      .catch((error) => {
        console.log("Error signing out:", error);
      });
  };

  return (
    <div
      className={`flex flex-col h-screen justify-between bg-card ${
        collapsed ? "w-28" : "w-64"
      }`}
    >
      <div>
        <div className="mt-10 ml-2 p-4 font-semibold text-xl text-gray-300 flex items-center justify-between">
          {!collapsed && "AWAuto"}
          <button onClick={() => setCollapsed(!collapsed)}>
            {collapsed ? (
              <FiChevronRight className="text-xl" />
            ) : (
              <FiChevronLeft className="text-xl" />
            )}
          </button>
        </div>

        <div className="mt-16">
          <SidebarNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            collapsed={collapsed}
          />
        </div>
      </div>

      <div>
      <UserPanel currentUser={currentUser} collapsed={collapsed} />
      <button
  className="p-4 w-full text-left hover:bg-gray-700 transition-colors flex items-center text-gray-300 hover:text-cyan-500"
  onClick={handleSignOut}
>
  <FiLogOut className="ml-2 text-xl" />
  {!collapsed && <span className="ml-2">Logout</span>}
</button>


        
      </div>
    </div>
  );
};

export default Sidebar;
