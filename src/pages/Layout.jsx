import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { theme } = useSelector((state) => state.common);

  return (
    <div className={`flex h-screen w-full ${theme ? 'dark' : ''}`}>
      <div className="bg-card text-card-foreground w-96 flex-shrink-0">
        <SidebarLayout />
      </div>
      <div className="bg-background flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
