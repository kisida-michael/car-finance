import React from 'react'
import useUserStore from '../../store/userStore';
import UserPortalHeader from '../../components/client/UserPortalHeader';

const AdminLayout = ({ children }) => {
  return (
    

    <div className="flex bg-client">
     
      <div className="w-full  bg-client min-h-screen">
      <UserPortalHeader/>
        {children}
      </div>
    </div>
   

  );
};

export default AdminLayout