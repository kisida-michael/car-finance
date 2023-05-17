import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { firestore } from "../../firebaseConfig";
import UserCard from "../../src/components/admin/adminSettings/UserCard";
// import UserDetails from "../../src/components/admin/adminManagement/UserDetails";


const AdminManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [data, setData] = useState([]);
  const [isAdminView, setIsAdminView] = useState(true); // Start with admin view by default

  const fetchData = async () => {
    let usersRef = collection(firestore, "users");

   
    // if the view is set to admin, then query only admin users
    if (isAdminView) {
      usersRef = query(usersRef, where("isAdmin", "==", true));
    } else {
      usersRef = query(usersRef, where("isAdmin", "==", false));
    }

    const usersSnapshot = await getDocs(usersRef);
    
    setData(usersSnapshot.docs.map((doc) => doc.data()));
    console.log(data)
  };

  useEffect(() => {
    fetchData();
  }, [isAdminView]); // Fetch data again when isAdminView changes

  return (
    <div className="w-full bg-admin min-h-screen text-gray-200">
      <div className="flex lg:flex-row md:flex-col">
        <div className="mx-12 mt-8 w-full flex-grow flex flex-col overflow">
          <header className="flex mb-4 justify-between items-center">
            <h1 className="mt-8 text-2xl font-semibold">User Management</h1>
            <div>
              <button
                className={isAdminView ? "bg-cyan-600 text-white" : "bg-gray-600 text-white"}
                onClick={() => setIsAdminView(true)}
              >
                Admins
              </button>
              <button
                className={isAdminView ? "bg-gray-600 text-white" : "bg-cyan-600 text-white"}
                onClick={() => setIsAdminView(false)}
              >
                Non-Admins
              </button>
            </div>
          </header>

          {data.map((user) => (
            <UserCard
              key={user.uid}
              user={user}
              onClick={() => {
                setSelectedUser(user);
                setAddingUser(false);
              }}
            />
          ))}
        </div>
{/* 
        {selectedUser && !addingUser && (
          <UserDetails
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}

        {addingUser && (
          <AddUser
            onClose={() => setAddingUser(false)}
            onAdd={() => {
              setAddingUser(false);
              fetchData(); // Refresh the user data
            }}
          />
        )} */}
      </div>
    </div>
  );
};

export default AdminManagement;
