'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

// ─── Mapa de título por rota ──────────────────────────────────────────────
const pageTitles: Record<string, string> = {
  '/': 'Dashboard',
  '/estrutura': 'Estrutura Física',
  '/amostras': 'Amostras',
  '/amostras/nova': 'Nova Amostra',
};

function getTitle(pathname: string): string {
  if (pageTitles[pathname]) return pageTitles[pathname];
  if (pathname.startsWith('/caixas') && pathname.endsWith('/mapa')) return 'Mapa da Caixa';
  return 'NeoGenomica';
}

// ─── Ícones ───────────────────────────────────────────────────────────────
const SearchIcon = () => (
  <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="currentColor" strokeWidth="1.5"/>
    <path d="M10 10l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const BellIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M9 2a5 5 0 015 5v3l1.5 2.5H2.5L4 10V7a5 5 0 015-5z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
    <path d="M7 14.5a2 2 0 004 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
  </svg>
);

const ChevronIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

// ─── Componente principal ─────────────────────────────────────────────────
import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const [search, setSearch] = useState('');
  const { usuario } = useAuth();

  // Iniciais do usuário para o avatar
  const initials = usuario?.nome
    ?.split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase() ?? 'U';


  return (
    <header className="h-16 bg-card border-b border-border flex items-center px-6 gap-4 sticky top-0 z-20 shadow-sm">

      {/* ── Título da página ── */}
      <div className="flex-1">
        <h1 className="text-base font-semibold text-text-primary">{title}</h1>
      </div>

      {/* ── Barra de busca ── */}
      <div className="flex items-center gap-2 bg-neo-lighter border border-border rounded-lg px-3 py-2 w-72 group focus-within:border-accent focus-within:ring-2 focus-within:ring-accent/20 transition-all">
        <span className="text-text-muted group-focus-within:text-accent transition-colors">
          <SearchIcon />
        </span>
        <input
          id="header-search"
          type="search"
          placeholder="Buscar amostras, pacientes..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-text-primary placeholder:text-text-muted outline-none flex-1 w-full"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-text-muted hover:text-text-primary transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M2 2l8 8M10 2l-8 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>
        )}
      </div>

      {/* ── Notificações (decorativo) ── */}
      <button
        id="btn-notifications"
        className="relative w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-neo-lighter transition-all"
        aria-label="Notificações"
      >
        <BellIcon />
        {/* badge de notificação */}
        <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-neo-teal rounded-full border-2 border-card" />
      </button>

      {/* ── Separador ── */}
      <div className="w-px h-6 bg-border" />

      {/* ── Usuário ── */}
      <div className="flex items-center gap-2.5 cursor-pointer group">
        {/* Avatar com inicial */}
        <div className="w-8 h-8 rounded-full bg-neo-dark flex items-center justify-center text-xs font-bold text-neo-light border-2 border-accent/30">
          {initials}
        </div>

        {/* Nome + email */}
        <div className="hidden md:block">
          <p className="text-sm font-semibold text-text-primary leading-tight">
            {usuario?.nome ?? 'Usuário'}
          </p>
        </div>

        <span className="text-text-muted group-hover:text-text-primary transition-colors">
          <ChevronIcon />
        </span>
      </div>
    </header>
  );
}
