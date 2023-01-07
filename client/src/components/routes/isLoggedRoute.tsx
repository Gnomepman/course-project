import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { isAuthenticated } from '../../utils';

export const IsLoggedRoute = () => {
  return isAuthenticated() ? <Navigate to="/" /> : <Outlet />;
};
