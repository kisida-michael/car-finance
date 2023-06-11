import React from 'react';
import { FiUser, FiLogOut, FiHome, FiCreditCard, FiDollarSign } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import useUserStore from "../../store/userStore";

const UserPortalHeader = () => {
    const navigate = useNavigate();
    const { currentUser } = useUserStore();
  
    console.log(currentUser);
    const handleLogout = () => {
      // Handle logout logic here
      // Reset the currentUser state after logout
      useUserStore.getState().setCurrentUser(null);
      navigate('/user');
    }
  
    return (
      <div>
        <header className="flex justify-between items-center py-4 px-40 bg-cyan-500 text-white shadow-md">
          <h1 onClick={() => navigate('/auto-loans')}className="cursor-pointer text-2xl font-bold">AW Auto</h1>
  
          <div className="flex items-center">
            <FiUser className="mr-2" />
            <p className="mr-4">{currentUser.displayName ? currentUser.displayName : `${currentUser.firstName} ${currentUser.lastName}`}</p>
            <button 
              onClick={handleLogout} 
              className="flex items-center"
            >
              <FiLogOut className="mr-2" />
              Sign Out
            </button>
          </div>
        </header>
  
        <div className="bg-white text-cyan-500 px-40 py-3 shadow-md flex space-x-4">
        <div className="flex items-center cursor-pointer" onClick={() => navigate('/user/dash')}>
        <FiHome className={location.pathname === '/user/dash' ? 'text-cyan-500' : 'text-gray-500 hover:text-cyan-500'} />
        <p className="text-sm font-bold uppercase">Dashboard</p>
      </div>
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/user/billing')}>
        <FiCreditCard className={location.pathname === '/user/billing' ? 'text-cyan-500' : 'text-gray-500 hover:text-cyan-500'} />
        <p className="text-sm font-bold uppercase">Billing</p>
      </div>
      <div className="flex items-center cursor-pointer" onClick={() => navigate('/user/payment-methods')}>
        <FiDollarSign className={location.pathname === '/user/payment-methods' ? 'text-cyan-500' : 'text-gray-500 hover:text-cyan-500'} />
        <p className="text-sm font-bold uppercase">Payment Methods</p>
      </div>
        </div>
      </div>
    );
  };
  
  export default UserPortalHeader;
  