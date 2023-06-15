import React from 'react'

const UserPanel = ({ collapsed, currentUser }) => (
    <div className="p-4 ml-2 flex items-center space-x-4">
   
      {!collapsed && currentUser && (
        <div className={`text-gray-300`}>
          <div className='font-semibold text-xl'>{currentUser.displayName}</div>
          <div>{currentUser.isAdmin ? "Admin" : "User"}</div>
        </div>
      )}
    </div>
  );
export default UserPanel
