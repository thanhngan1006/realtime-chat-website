import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { theme } = useSelector((state) => state.common);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="relative flex h-svh min-h-svh w-full overflow-x-hidden overflow-y-auto bg-slate-100 text-slate-900 transition-colors duration-700 xl:overflow-hidden dark:bg-zinc-950 dark:text-slate-100">
        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10 xl:flex-row">
          <aside className="order-2 w-full xl:order-1 xl:h-full xl:w-96">
            <div className="flex h-full flex-col rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-200 dark:border-zinc-700 dark:bg-zinc-900/80">
              <SidebarLayout />
            </div>
          </aside>

          <main className="order-1 flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-md transition-all duration-200 xl:h-full dark:border-zinc-700 dark:bg-zinc-900/85">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
