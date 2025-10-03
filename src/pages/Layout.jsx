import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { theme } = useSelector((state) => state.common);

  return (
    <div
      className={`grid min-h-screen w-full grid-cols-12 ${theme ? 'dark' : ''} bg-white dark:bg-zinc-800`}
    >
      <div className="col-span-3 bg-gray-100 text-gray-900 dark:bg-zinc-700 dark:text-white">
        <SidebarLayout />
      </div>
      <div className="col-span-9" style={{ zIndex: 1000 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
