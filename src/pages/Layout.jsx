import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { theme } = useSelector((state) => state.common);

  return (
    <div
      className={`grid min-h-screen w-full grid-cols-12 ${theme ? 'dark' : ''} bg-gradient-to-br from-gray-50 to-gray-100 dark:from-neutral-900 dark:to-neutral-800 transition-colors duration-300`}
    >
      <div className="col-span-12 lg:col-span-3 bg-white/80 backdrop-blur-sm border-r border-gray-200 dark:border-neutral-700 dark:bg-neutral-800/80 shadow-lg animate-slide-in-left">
        <SidebarLayout />
      </div>
      <div className="col-span-12 lg:col-span-9 relative animate-fade-in" style={{ zIndex: 1000 }}>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
