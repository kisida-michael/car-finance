// PrivateRoute.js

import { useEffect, useState } from 'react';
import useUserStore from '../store/userStore';
import { Outlet, Navigate } from "react-router-dom";

const PrivateRoute = ({ adminOnly }) => {
  const currentUser = useUserStore((state) => state.currentUser);
  const authReady = useUserStore((state) => state.authReady);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    setUserLoaded(true);
  }, [currentUser]);

  console.log('PrivateRoute:', { currentUser, authReady });

  if (!authReady || !userLoaded) {
    return null;
  }

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && !currentUser.isAdmin) {
    return <Navigate to="/user/dash" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
