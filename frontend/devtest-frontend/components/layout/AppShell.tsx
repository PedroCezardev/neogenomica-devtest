import Sidebar from './Sidebar';
import Header from './Header';

interface AppShellProps {
  children: React.ReactNode;
}

/**
 * AppShell — wrapper de layout para todas as páginas protegidas.
 * Sidebar fixo à esquerda + Header fixo no topo + conteúdo scrollável à direita.
 *
 * Uso: envolver os children no (main)/layout.tsx
 */
export default function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-full min-h-screen bg-content">
      {/* Sidebar fixo à esquerda */}
      <Sidebar />

      {/* Área principal — deslocada pelo tamanho do sidebar (w-60 = 240px) */}
      <div className="flex-1 flex flex-col ml-60 min-h-screen">
        {/* Header sticky no topo */}
        <Header />

        {/* Conteúdo da página */}
        <main className="flex-1 p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
}
