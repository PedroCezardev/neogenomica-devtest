'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — wrapper de layout para todas as páginas protegidas.
 * Sidebar comprimível no desktop + Bottom Navigation Bar no mobile.
 */
export default function AppShell({ children }: AppShellProps) {
  const [collapsed, setCollapsed] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem('neo_sidebar_collapsed') === 'true';
  });

  function toggleSidebar() {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem('neo_sidebar_collapsed', String(next));
      return next;
    });
  }

  return (
    <div className="flex h-full min-h-screen bg-content">
      {/* Sidebar no desktop */}
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />

      {/* Área principal — transição suave da margem no desktop */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ml-0 ${
          collapsed ? 'md:ml-[72px]' : 'md:ml-60'
        } pb-16 md:pb-0 min-h-screen`}
      >
        {/* Header sticky no topo */}
        <Header />

        {/* Conteúdo da página */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">{children}</main>
      </div>

      {/* Navegação por Bottom Bar no Mobile */}
      <MobileNav />
    </div>
  );
}
