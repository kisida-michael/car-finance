import React, { useState } from "react";
import Select from "react-select";
import { FiUser, FiAtSign, FiKey, FiEdit, FiSave } from "react-icons/fi";
import { doc, updateDoc } from "firebase/firestore";
import { firestore } from "../../../../firebaseConfig";

const UserCard = ({ user, isEvenRow }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);

  const handleSave = async () => {
    console.log(editedUser.uid)
    const userRef = doc(firestore, "users", editedUser.uid);

    await updateDoc(userRef, {
      firstName: editedUser.firstName,
      lastName: editedUser.lastName,
      email: editedUser.email,
      isAdmin: editedUser.isAdmin,
    });
    setIsEditing(false);
  };

  return (
    <div
      className={`bg-card p-4 rounded-lg mb-2 flex items-center font-regular ${
        isEvenRow ? "bg-card" : "bg-cardAlt"
      }`}
    >
      <FiUser className="mr-2 text-2xl text-cyan-500 font-bold" />
      <div className="flex flex-1 items-center space-x-4">
        {isEditing ? (
          <input
            type="text"
            value={editedUser.firstName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, firstName: e.target.value })
            }
            className="bg-transparent border-b-2 focus:outline-none"
          />
        ) : (
          <p>{editedUser.firstName}</p>
        )}

        {isEditing ? (
          <input
            type="text"
            value={editedUser.lastName}
            onChange={(e) =>
              setEditedUser({ ...editedUser, lastName: e.target.value })
            }
            className="bg-transparent border-b-2 focus:outline-none"
          />
        ) : (
          <p>{editedUser.lastName}</p>
        )}

        <FiAtSign className="mr-2 -ml-9 text-cyan-500 font-bold" />

        {isEditing ? (
          <input
            type="text"
            value={editedUser.email}
            onChange={(e) =>
              setEditedUser({ ...editedUser, email: e.target.value })
            }
            className="bg-transparent border-b-2 focus:outline-none"
          />
        ) : (
          <p>{editedUser.email}</p>
        )}

        <FiKey className="mr-2 -ml-7 text-cyan-500 font-bold" />

        {isEditing ? (
          <Select
            value={editedUser.isAdmin ? { value: true, label: "Admin" } : { value: false, label: "User" }}
            onChange={(selectedOption) =>
              setEditedUser({ ...editedUser, isAdmin: selectedOption.value })
            }
            options={[
              { value: true, label: "Admin" },
              { value: false, label: "User" },
            ]}
            className="w-24"
          />
        ) : (
          <p>{editedUser.isAdmin ? "Admin" : "User"}</p>
        )}

        {isEditing ? (
          <button onClick={handleSave} className="text-cyan-500">
            <FiSave />
          </button>
        ) : (
          <button onClick={() => setIsEditing(true)} className="text-cyan-500">
            <FiEdit />
          </button>
        )}
      </div>
    </div>
 
    );
};

export default UserCard;