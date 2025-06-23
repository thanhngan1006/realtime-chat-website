import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';

const Layout = () => {
  return (
    <div className="grid min-h-screen w-full grid-cols-12">
      <div className="col-span-3 bg-gray-100 text-gray-900">
        <SidebarLayout />
      </div>
      <div className="col-span-9">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
