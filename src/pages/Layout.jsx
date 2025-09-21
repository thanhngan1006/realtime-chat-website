import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { theme } = useSelector((state) => state.common);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        // md breakpoint
        setIsSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div
      className={`grid min-h-screen w-full grid-cols-1 md:grid-cols-12 ${theme ? 'dark' : ''} relative bg-white dark:bg-zinc-800`}
    >
      {/* Sidebar */}
      <div
        className={`bg-gray-100 text-gray-900 transition-all duration-300 md:col-span-3 dark:bg-zinc-700 dark:text-white ${isSidebarOpen ? 'absolute top-0 left-0 z-50 h-full w-64 shadow-lg' : 'hidden md:block'}`}
      >
        <SidebarLayout
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />
      </div>

      {/* Overlay when sidebar open on mobile */}
      {isSidebarOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div
        className="relative z-10 col-span-1 md:col-span-9"
        style={{ zIndex: 1000 }}
      >
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
