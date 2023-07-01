import React, { useState } from "react";
import {
  FiUser,
  FiLogOut,
  FiHome,
  FiCreditCard,
  FiDollarSign,
  FiMenu,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import useUserStore from "../../store/userStore";

const UserPortalHeader = () => {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);

  const handleLogout = () => {
    // Handle logout logic here
    // Reset the currentUser state after logout
    useUserStore.getState().setCurrentUser(null);
    navigate("/user");
  };

  return (
    <div>
      <header className="flex justify-between items-center py-4 px-4 sm:px-40 bg-cyan-500 text-white shadow-sm">
        <h1
          onClick={() => navigate("/auto-loans")}
          className="cursor-pointer text-2xl font-bold"
        >
          AW Auto
        </h1>

        <div className="sm:hidden">
          <button onClick={() => setMobileNavOpen(!isMobileNavOpen)}>
            <FiMenu className="mr-2" />
          </button>
        </div>

        <div className="hidden sm:flex items-center">
          <FiUser className="mr-2" />
          <p className="mr-4">
            {currentUser.displayName
              ? currentUser.displayName
              : `${currentUser.firstName} ${currentUser.lastName}`}
          </p>
          <button onClick={handleLogout} className="flex items-center">
            <FiLogOut className="mr-2" />
            Sign Out
          </button>
        </div>
      </header>

      {isMobileNavOpen && (
        <div className="bg-white p-4 sm:hidden">
          <div className=" font-semibold flex items-center mb-4 text-cyan-500">
          <FiUser className="mr-2" />
          <p className="">
            {currentUser.displayName
              ? currentUser.displayName
              : `${currentUser.firstName} ${currentUser.lastName}`}
          </p>
          </div>
          <button onClick={handleLogout} className="flex items-center mb-4">
            <FiLogOut className="mr-2" />
            Sign Out
          </button>

          <div
            className="mb-4 cursor-pointer"
            onClick={() => navigate("/user/dash")}
          >
            <p>Dashboard</p>
          </div>
          <div
            className="mb-4 cursor-pointer"
            onClick={() => navigate("/user/billing")}
          >
            <p>My Bill</p>
          </div>
          <div
            className="mb-4 cursor-pointer"
            onClick={() => navigate("/user/payment-methods")}
          >
            <p>Payment Methods</p>
          </div>
        </div>
      )}

<div className="hidden sm:flex bg-white px-40 py-3 shadow-md  space-x-4">
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/user/dash")}
        >
          <p
            className={
              location.pathname === "/user/dash"
                ? "text-sm font-bold uppercase text-cyan-500"
                : "text-sm font-bold uppercase text-gray-500 hover:text-cyan-500"
            }
          >
            Dashboard
          </p>
        </div>
        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/user/billing")}
        >
          <p
            className={
              location.pathname === "/user/billing"
                ? "text-sm font-bold uppercase text-cyan-500"
                : "text-sm font-bold uppercase text-gray-500 hover:text-cyan-500"
            }
          >
            My Bill
          </p>
        </div>

        <div
          className="flex items-center cursor-pointer"
          onClick={() => navigate("/user/payment-methods")}
        >
          <p
            className={
              location.pathname === "/user/payment-methods"
                ? "text-sm font-bold uppercase text-cyan-500"
                : "text-sm font-bold uppercase text-gray-500 hover:text-cyan-500"
            }
          >
            Payment Methods
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserPortalHeader;
