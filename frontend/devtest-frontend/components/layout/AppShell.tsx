import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — wrapper de layout para todas as páginas protegidas.
 * Sidebar fixo no desktop + Bottom Navigation Bar no mobile.
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full min-h-screen bg-content">
      {/* Sidebar no desktop */}
      <Sidebar />

      {/* Área principal — sem margem no mobile, com margem ml-60 no desktop, padding-bottom no mobile para o BottomNav */}
      <div className="flex-1 flex flex-col ml-0 md:ml-60 pb-16 md:pb-0 min-h-screen">
        {/* Header sticky no topo */}
        <Header />

        {/* Conteúdo da página */}
        <main className="flex-1 p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>

      {/* Navegação por Bottom Bar no Mobile */}
      <MobileNav />
    </div>
  );
}
