import React from 'react'
import useUserStore from '../../store/userStore';
import UserPortalHeader from '../../components/client/UserPortalHeader';

const AdminLayout = ({ children }) => {
  return (
    

    <div className="flex">
     
      <div className="w-full  bg-admin max-h-screen overflow-x-hidden">
      <UserPortalHeader/>
        {children}
      </div>
    </div>
   

  );
};

export default AdminLayout