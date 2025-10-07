import React from 'react';
import { Outlet } from 'react-router-dom';
import SidebarLayout from '../components/layout/SidebarLayout';
import { useSelector } from 'react-redux';

const Layout = () => {
  const { theme } = useSelector((state) => state.common);

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="relative flex h-svh min-h-svh w-full overflow-x-hidden overflow-y-auto text-slate-900 transition-colors duration-700 xl:overflow-hidden dark:text-slate-100">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="from-brand-300/28 via-brand-200/32 absolute -top-28 -left-24 h-96 w-96 rounded-full bg-gradient-to-br to-sky-200/24 blur-3xl" />
          <div className="via-brand-200/24 absolute right-[-12%] bottom-[-28%] h-[26rem] w-[26rem] rounded-full bg-gradient-to-tr from-teal-200/18 to-sky-200/18 blur-[170px]" />
          <div className="bg-grid-light absolute inset-0 bg-[size:26px_26px] opacity-30 dark:opacity-20" />
        </div>

        <div className="relative mx-auto flex h-full w-full max-w-7xl flex-col gap-6 px-4 py-6 md:px-8 md:py-10 xl:flex-row">
          <aside className="order-2 w-full xl:order-1 xl:h-full xl:w-96">
            <div className="flex h-full flex-col rounded-3xl border border-white/45 bg-white/85 shadow-[0_36px_120px_-55px_rgba(6,182,212,0.28)] backdrop-blur-2xl transition-all duration-500 dark:border-zinc-700/60 dark:bg-zinc-900/80">
              <SidebarLayout />
            </div>
          </aside>

          <main className="order-1 flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-3xl border border-white/45 bg-white/85 shadow-[0_42px_140px_-70px_rgba(6,182,212,0.32)] backdrop-blur-2xl transition-all duration-500 xl:h-full dark:border-zinc-700/60 dark:bg-zinc-900/85">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
